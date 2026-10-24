import reportRepository from "../repositories/report.repository.js";
import { sendSuccess } from "../middlewares/response.middleware.js";

class ReportController {
  async getHerdSummary(req, res, next) {
    try {
      const summary = await reportRepository.getHerdSummary();
      return sendSuccess(
        res,
        summary,
        "Resumen global de rodeo obtenido con éxito",
        200,
      );
    } catch (error) {
      next(error);
    }
  }

  async exportCsv(req, res, next) {
    try {
      const { paddockId } = req.query;
      const data = await reportRepository.getHistoricalDataForExport(
        paddockId ? Number(paddockId) : null,
      );

      if (!data || data.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No hay registros disponibles para exportar.",
          timestamp: new Date().toISOString(),
        });
      }

      // Generar cabeceras y líneas CSV separadas por coma
      const headers = Object.keys(data[0]).join(",");
      const rows = data.map((row) =>
        Object.values(row)
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(","),
      );
      const csvContent = [headers, ...rows].join("\r\n");

      const filename = `agro_gestion_pesajes_${new Date().toISOString().slice(0, 10)}.csv`;

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`,
      );
      return res.status(200).send("\uFEFF" + csvContent); // BOM para compatibilidad con Excel
    } catch (error) {
      next(error);
    }
  }
}

export default new ReportController();
