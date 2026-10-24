import pool from "../config/db.js";

class PaddockRepository {
  async getPaddockWithHerd(paddockId) {
    const paddockQuery = `
      SELECT id, field_id, name, surface_ha, available_forage_kg_ha, grazing_efficiency_percent
      FROM paddocks
      WHERE id = ?
      LIMIT 1
    `;
    const [paddockRows] = await pool.execute(paddockQuery, [paddockId]);
    if (paddockRows.length === 0) return null;

    // Obtener los animales activos asignados a este potrero y su pesaje más reciente
    const animalsQuery = `
      SELECT 
        a.id AS animal_id,
        a.rfid_tag,
        c.name AS category_name,
        c.ev_coefficient,
        c.category_factor,
        w.weight AS latest_weight
      FROM animals a
      INNER JOIN animal_categories c ON a.category_id = c.id
      INNER JOIN (
        SELECT animal_id, weight
        FROM weighings w1
        WHERE id = (
          SELECT id FROM weighings w2 
          WHERE w2.animal_id = w1.animal_id 
          ORDER BY weighed_at DESC LIMIT 1
        )
      ) w ON a.id = w.animal_id
      WHERE a.paddock_id = ? AND a.is_active = 1
    `;
    const [animalRows] = await pool.execute(animalsQuery, [paddockId]);

    return {
      paddock: paddockRows[0],
      herd: animalRows,
    };
  }
}

export default new PaddockRepository();
