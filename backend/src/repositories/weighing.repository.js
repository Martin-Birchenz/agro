import pool from "../config/db.js";

class WeighingRepository {
  async findAnimalByRfid(rfidTag, connection = pool) {
    const query = `
      SELECT id, rfid_tag, category_id, field_id, target_sale_weight, target_gdpv
      FROM animals
      WHERE rfid_tag = ?
      LIMIT 1
    `;
    const [rows] = await connection.execute(query, [rfidTag]);
    return rows[0] || null;
  }

  async createDefaultAnimal(rfidTag, defaultCategoryId = 1, connection = pool) {
    const query = `
      INSERT INTO animals (rfid_tag, category_id, entry_date)
      VALUES (?, ?, CURDATE())
    `;
    const [result] = await connection.execute(query, [
      rfidTag,
      defaultCategoryId,
    ]);
    return result.insertId;
  }

  async getPreviousWeighing(animalId, currentWeighedAt, connection = pool) {
    const query = `
      SELECT id, weight, weighed_at
      FROM weighings
      WHERE animal_id = ? AND weighed_at < ?
      ORDER BY weighed_at DESC
      LIMIT 1
    `;
    const [rows] = await connection.execute(query, [
      animalId,
      new Date(currentWeighedAt),
    ]);
    return rows[0] || null;
  }

  async isTransactionProcessed(transactionId, connection = pool) {
    const query = `
      SELECT id FROM weighings WHERE client_transaction_id = ? LIMIT 1
    `;
    const [rows] = await connection.execute(query, [transactionId]);
    return rows.length > 0;
  }

  async insertWeighing(data, connection = pool) {
    const query = `
      INSERT INTO weighings (
        client_transaction_id, animal_id, weight, weighed_at, device_id,
        days_elapsed, weight_gain, gdpv_real, gdpv_gap,
        days_to_target_real, days_to_target_objective
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      data.clientTransactionId,
      data.animalId,
      data.weight,
      new Date(data.weighedAt),
      data.deviceId,
      data.daysElapsed,
      data.weightGain,
      data.gdpvReal,
      data.gdpvGap,
      data.daysToTargetReal,
      data.daysToTargetObjective,
    ];

    const [result] = await connection.execute(query, params);
    return result.insertId;
  }

  async getAnimalHistory(rfidTag, connection = pool) {
    const animalQuery = `
      SELECT 
        a.id, a.rfid_tag, a.visual_tag, a.sex, a.entry_date,
        a.target_sale_weight, a.target_gdpv,
        c.name AS category_name, c.ev_coefficient
      FROM animals a
      LEFT JOIN animal_categories c ON a.category_id = c.id
      WHERE a.rfid_tag = ?
      LIMIT 1
    `;
    const [animalRows] = await connection.execute(animalQuery, [rfidTag]);
    if (animalRows.length === 0) return null;

    const weighingsQuery = `
      SELECT 
        id, client_transaction_id, weight, weighed_at,
        days_elapsed, weight_gain, gdpv_real, gdpv_gap,
        days_to_target_real, days_to_target_objective
      FROM weighings
      WHERE animal_id = ?
      ORDER BY weighed_at ASC
    `;
    const [weighingsRows] = await connection.execute(weighingsQuery, [
      animalRows[0].id,
    ]);

    return {
      animal: animalRows[0],
      history: weighingsRows,
    };
  }
}

export default new WeighingRepository();
