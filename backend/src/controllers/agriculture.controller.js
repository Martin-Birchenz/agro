import pool from "../config/db.js";
import { sendSuccess } from "../middlewares/response.middleware.js";

class AgricultureController {
  // Obtener los lotes de un campo con sus campañas asociadas
  async getPlotsByFarm(req, res, next) {
    try {
      const { farmId } = req.params;

      const query = `
        SELECT 
          p.id AS plot_id,
          p.name AS plot_name,
          p.surface_ha,
          p.soil_type,
          c.id AS campaign_id,
          c.crop_type,
          c.season_year,
          c.status AS campaign_status,
          c.sowing_date,
          c.target_yield_tn_ha,
          c.actual_yield_tn_ha
        FROM agricultural_plots p
        LEFT JOIN agricultural_campaigns c ON p.id = c.plot_id
        WHERE p.farm_id = ?
        ORDER BY p.id ASC, c.id DESC
      `;

      const [rows] = await pool.query(query, [farmId]);
      return sendSuccess(res, rows, "Lotes agrícolas recuperados", 200);
    } catch (error) {
      next(error);
    }
  }

  // Crear un nuevo lote agrícola
  async createPlot(req, res, next) {
    try {
      const { farmId, name, surfaceHa, soilType } = req.body;
      const [result] = await pool.query(
        "INSERT INTO agricultural_plots (farm_id, name, surface_ha, soil_type) VALUES (?, ?, ?, ?)",
        [farmId, name, surfaceHa, soilType || null],
      );
      return sendSuccess(
        res,
        { id: result.insertId, ...req.body },
        "Lote creado con éxito",
        201,
      );
    } catch (error) {
      next(error);
    }
  }

  async registerLabor(req, res, next) {
    const connection = await pool.getConnection();
    try {
      const {
        campaignId,
        laborType,
        laborDate,
        contractorName,
        laborCostUsdHa,
        appliedSurfaceHa,
        supplies,
        notes,
      } = req.body;
      // supplies: [ { stockItemId: 3, dosePerHa: 2.5 }, ... ]

      await connection.beginTransaction();

      // 1. Insertar la labor general
      const [laborResult] = await connection.query(
        `INSERT INTO agricultural_labors 
       (campaign_id, labor_type, labor_date, contractor_name, labor_cost_usd_ha, notes) 
       VALUES (?, ?, ?, ?, ?, ?)`,
        [
          campaignId,
          laborType,
          laborDate || new Date(),
          contractorName || null,
          laborCostUsdHa || 0,
          notes || null,
        ],
      );
      const laborId = laborResult.insertId;

      // 2. Procesar y descontar cada insumo del Galpón
      if (Array.isArray(supplies) && supplies.length > 0) {
        for (const item of supplies) {
          const totalQty = Number(
            (item.dosePerHa * appliedSurfaceHa).toFixed(2),
          );

          // Verificar stock disponible antes de restar
          const [stockRows] = await connection.query(
            "SELECT current_quantity, name FROM stock_items WHERE id = ? FOR UPDATE",
            [item.stockItemId],
          );

          if (stockRows.length === 0) {
            throw new Error(`Insumo ID ${item.stockItemId} no encontrado`);
          }

          const currentQty = Number(stockRows[0].current_quantity);
          if (currentQty < totalQty) {
            throw new Error(
              `Stock insuficiente de "${stockRows[0].name}". Disponible: ${currentQty}, Requerido: ${totalQty}`,
            );
          }

          // Registrar detalle del insumo en la labor
          await connection.query(
            `INSERT INTO labor_supplies (labor_id, stock_item_id, dose_per_ha, total_quantity) 
           VALUES (?, ?, ?, ?)`,
            [laborId, item.stockItemId, item.dosePerHa, totalQty],
          );

          // Descontar la cantidad exacta del stock
          await connection.query(
            "UPDATE stock_items SET current_quantity = current_quantity - ? WHERE id = ?",
            [totalQty, item.stockItemId],
          );
        }
      }

      await connection.commit();

      return sendSuccess(
        res,
        {
          laborId,
          campaignId,
          appliedSurfaceHa,
          suppliesCount: supplies?.length || 0,
        },
        "Labor registrada y stock descontado con éxito",
        201,
      );
    } catch (error) {
      await connection.rollback();
      next(error);
    } finally {
      connection.release();
    }
  }

  // 1. Crear campaña para un lote existente o nuevo
  async createCampaign(req, res, next) {
    try {
      const {
        plotId,
        cropType,
        seasonYear,
        status,
        sowingDate,
        targetYieldTnHa,
      } = req.body;
      const [result] = await pool.query(
        `INSERT INTO agricultural_campaigns 
       (plot_id, crop_type, season_year, status, sowing_date, target_yield_tn_ha) 
       VALUES (?, ?, ?, ?, ?, ?)`,
        [
          plotId,
          cropType,
          seasonYear || "2026/2027",
          status || "PLANIFICADO",
          sowingDate || null,
          targetYieldTnHa || null,
        ],
      );
      return sendSuccess(
        res,
        { id: result.insertId, ...req.body },
        "Campaña agrícola creada con éxito",
        201,
      );
    } catch (error) {
      next(error);
    }
  }

  // 2. Reporte Económico de Margen Bruto por Lote/Campaña
  async getGrossMargins(req, res, next) {
    try {
      const { farmId } = req.params;

      const query = `
      SELECT 
        p.id AS plot_id,
        p.name AS plot_name,
        p.surface_ha,
        c.id AS campaign_id,
        c.crop_type,
        c.season_year,
        c.target_yield_tn_ha,
        COALESCE(SUM(l.labor_cost_usd_ha * p.surface_ha), 0) AS total_labor_cost_usd,
        COALESCE(SUM(ls.total_quantity * s.cost_per_unit_usd), 0) AS total_supplies_cost_usd
      FROM agricultural_plots p
      INNER JOIN agricultural_campaigns c ON p.id = c.plot_id
      LEFT JOIN agricultural_labors l ON c.id = l.campaign_id
      LEFT JOIN labor_supplies ls ON l.id = ls.labor_id
      LEFT JOIN stock_items s ON ls.stock_item_id = s.id
      WHERE p.farm_id = ?
      GROUP BY p.id, c.id
      ORDER BY p.id ASC
    `;

      const [rows] = await pool.query(query, [farmId]);

      // Precios de referencia de mercado en USD/tn (Campaña 2026/2027)
      const marketPricesUsd = {
        SOJA_1RA: 310,
        SOJA_2DA: 290,
        MAIZ: 180,
        TRIGO: 215,
        GIRASOL: 340,
        SORGO: 160,
      };

      const analysis = rows.map((r) => {
        const surface = Number(r.surface_ha) || 1;
        const totalCostUsd =
          Number(r.total_labor_cost_usd) + Number(r.total_supplies_cost_usd);
        const costPerHa = totalCostUsd / surface;

        const pricePerTn = marketPricesUsd[r.crop_type] || 250;
        const projectedIncomeHa =
          (Number(r.target_yield_tn_ha) || 0) * pricePerTn;
        const grossMarginHa = projectedIncomeHa - costPerHa;

        return {
          ...r,
          costPerHa: Number(costPerHa.toFixed(2)),
          projectedIncomeHa: Number(projectedIncomeHa.toFixed(2)),
          grossMarginHa: Number(grossMarginHa.toFixed(2)),
          totalGrossMarginUsd: Number((grossMarginHa * surface).toFixed(2)),
        };
      });

      return sendSuccess(
        res,
        analysis,
        "Márgenes brutos calculados con éxito",
        200,
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new AgricultureController();
