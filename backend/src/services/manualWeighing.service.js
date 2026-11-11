import pool from "../config/db.js";

export const processManualWeighing = async (data) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Buscar si el animal ya existe en la base
    const [animals] = await connection.query(
      "SELECT id, rfid_tag, category_id, target_sale_weight, target_gdpv FROM animals WHERE rfid_tag = ? LIMIT 1",
      [data.rfidTag],
    );

    let animalId;
    let targetWeight = data.targetWeightKg;
    let targetGdpv = 0.85; // 850 g/día por defecto

    if (animals.length === 0) {
      // Si no existe, se registra el animal (por defecto Novillito category_id = 2)
      const [newAnimal] = await connection.query(
        `INSERT INTO animals 
         (rfid_tag, category_id, target_sale_weight, target_gdpv, entry_date) 
         VALUES (?, 2, ?, ?, CURDATE())`,
        [data.rfidTag, targetWeight, targetGdpv],
      );
      animalId = newAnimal.insertId;
    } else {
      animalId = animals[0].id;
      if (animals[0].target_sale_weight) {
        targetWeight = Number(animals[0].target_sale_weight);
      }
      if (animals[0].target_gdpv) {
        targetGdpv = Number(animals[0].target_gdpv);
      }
    }

    // 2. Buscar el pesaje anterior más reciente
    const [prevWeighings] = await connection.query(
      `SELECT weight, weighed_at 
       FROM weighings 
       WHERE animal_id = ? AND weighed_at < ? 
       ORDER BY weighed_at DESC 
       LIMIT 1`,
      [animalId, data.weighedAt],
    );

    let gdpvReal = null; // en g/día (Módulo 06)
    let gdpvGap = null; // ΔGDPV en g/día
    let daysElapsed = null;
    let weightGain = null;
    let daysToTargetReal = null;

    if (prevWeighings.length > 0) {
      const prevWeight = Number(prevWeighings[0].weight);
      const prevDate = new Date(prevWeighings[0].weighed_at);
      const currentDate = new Date(data.weighedAt);

      const diffTime = Math.abs(currentDate - prevDate);
      daysElapsed = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
      weightGain = Number((data.weightKg - prevWeight).toFixed(2));

      // Fórmulas oficiales del Módulo 06 (en g/día)
      gdpvReal = Number(((weightGain * 1000) / daysElapsed).toFixed(2));
      gdpvGap = Number((gdpvReal - targetGdpv * 1000).toFixed(2));

      // Proyección a faena real
      if (gdpvReal > 0 && data.weightKg < targetWeight) {
        const kgRemaining = targetWeight - data.weightKg;
        daysToTargetReal = Number((kgRemaining / (gdpvReal / 1000)).toFixed(1));
      }
    }

    // 3. Persistir el nuevo pesaje
    const clientTransactionId = `MANUAL-${Date.now()}-${data.rfidTag}`;

    const [insertResult] = await connection.query(
      `INSERT INTO weighings 
       (client_transaction_id, animal_id, weight, weighed_at, device_id, days_elapsed, weight_gain, gdpv_real, gdpv_gap, days_to_target_real) 
       VALUES (?, ?, ?, ?, 'MANUAL_WEB', ?, ?, ?, ?, ?)`,
      [
        clientTransactionId,
        animalId,
        data.weightKg,
        new Date(data.weighedAt),
        daysElapsed,
        weightGain,
        gdpvReal,
        gdpvGap,
        daysToTargetReal,
      ],
    );

    await connection.commit();

    return {
      weighingId: insertResult.insertId,
      rfidTag: data.rfidTag,
      currentWeightKg: data.weightKg,
      previousWeightKg:
        prevWeighings.length > 0 ? Number(prevWeighings[0].weight) : null,
      daysElapsed,
      weightGainKg: weightGain,
      gdpvRealGramsDay: gdpvReal,
      gdpvRealKgDay:
        gdpvReal !== null ? Number((gdpvReal / 1000).toFixed(3)) : null,
      targetWeightKg: targetWeight,
      daysToTarget: daysToTargetReal,
      weighedAt: data.weighedAt,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
