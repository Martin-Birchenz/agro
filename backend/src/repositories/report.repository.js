import pool from "../config/db.js";

class ReportRepository {
  // Resumen zootécnico global de todos los potreros y animales activos
  async getHerdSummary() {
    const query = `
      SELECT 
        p.id AS paddock_id,
        p.name AS paddock_name,
        p.surface_ha,
        p.available_forage_kg_ha,
        COUNT(a.id) AS total_animals,
        COALESCE(AVG(w.weight), 0) AS avg_weight,
        COALESCE(AVG(w.gdpv_real), 0) AS avg_gdpv,
        COALESCE(SUM(c.ev_coefficient), 0) AS total_ev
      FROM paddocks p
      LEFT JOIN animals a ON a.paddock_id = p.id AND a.is_active = 1
      LEFT JOIN animal_categories c ON a.category_id = c.id
      LEFT JOIN (
        SELECT w1.animal_id, w1.weight, w1.gdpv_real
        FROM weighings w1
        WHERE w1.id = (
          SELECT w2.id FROM weighings w2 
          WHERE w2.animal_id = w1.animal_id 
          ORDER BY w2.weighed_at DESC LIMIT 1
        )
      ) w ON a.id = w.animal_id
      GROUP BY p.id, p.name, p.surface_ha, p.available_forage_kg_ha
      ORDER BY p.id ASC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }

  // Obtener todos los registros históricos planos para exportación a CSV
  async getHistoricalDataForExport(paddockId = null) {
    let query = `
      SELECT 
        w.client_transaction_id AS transaccion,
        a.rfid_tag AS caravana_rfid,
        COALESCE(a.visual_tag, 'S/D') AS caravana_visual,
        c.name AS categoria,
        COALESCE(p.name, 'Sin Asignar') AS potrero,
        w.weight AS peso_kg,
        DATE_FORMAT(w.weighed_at, '%Y-%m-%d %H:%i:%s') AS fecha_pesaje,
        COALESCE(w.days_elapsed, 0) AS dias_transcurridos,
        COALESCE(w.weight_gain, 0) AS ganancia_kg,
        COALESCE(w.gdpv_real, 0) AS gdpv_g_dia,
        COALESCE(w.days_to_target_real, 0) AS dias_a_faena,
        w.device_id AS dispositivo
      FROM weighings w
      INNER JOIN animals a ON w.animal_id = a.id
      INNER JOIN animal_categories c ON a.category_id = c.id
      LEFT JOIN paddocks p ON a.paddock_id = p.id
    `;
    const params = [];

    if (paddockId) {
      query += ` WHERE a.paddock_id = ? `;
      params.push(paddockId);
    }

    query += ` ORDER BY w.weighed_at DESC `;

    const [rows] = await pool.execute(query, params);
    return rows;
  }
}

export default new ReportRepository();
