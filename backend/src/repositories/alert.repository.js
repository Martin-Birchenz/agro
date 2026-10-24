import pool from "../config/db.js";

class AlertRepository {
  async getHerdStatusSummary() {
    const query = `
      SELECT 
        a.id AS animal_id,
        a.rfid_tag,
        a.target_sale_weight,
        a.target_gdpv,
        p.id AS paddock_id,
        p.name AS paddock_name,
        c.name AS category_name,
        w.weight AS current_weight,
        w.gdpv_real,
        w.days_to_target_real,
        w.weighed_at AS last_weighed_at
      FROM animals a
      LEFT JOIN paddocks p ON a.paddock_id = p.id
      INNER JOIN animal_categories c ON a.category_id = c.id
      INNER JOIN (
        SELECT w1.animal_id, w1.weight, w1.gdpv_real, w1.days_to_target_real, w1.weighed_at
        FROM weighings w1
        WHERE w1.id = (
          SELECT w2.id FROM weighings w2 
          WHERE w2.animal_id = w1.animal_id 
          ORDER BY w2.weighed_at DESC LIMIT 1
        )
      ) w ON a.id = w.animal_id
      WHERE a.is_active = 1
      ORDER BY w.days_to_target_real ASC, w.weight DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }
}

export default new AlertRepository();
