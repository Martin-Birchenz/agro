import pool from "../config/db.js";

// --- ESTABLECIMIENTOS (FARMS) ---
export const getFarmsByClient = async (clientId) => {
  const [rows] = await pool.query(
    "SELECT id, client_id, name, location, total_surface_ha, created_at FROM farms WHERE client_id = ? ORDER BY name ASC",
    [clientId],
  );
  return rows;
};

export const createFarm = async (data) => {
  const [result] = await pool.query(
    "INSERT INTO farms (client_id, name, location, total_surface_ha) VALUES (?, ?, ?, ?)",
    [data.clientId, data.name, data.location || null, data.totalSurfaceHa],
  );
  return { id: result.insertId, ...data };
};

// --- STOCK TRANSVERSAL ---
export const getStockByFarm = async (farmId, category = null) => {
  let query = "SELECT * FROM stock_items WHERE farm_id = ?";
  const params = [farmId];

  if (category) {
    query += " AND category = ?";
    params.push(category);
  }

  query += " ORDER BY name ASC";
  const [rows] = await pool.query(query, params);
  return rows;
};

export const createStockItem = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO stock_items 
     (farm_id, name, category, unit_of_measure, current_quantity, min_quantity_alert, cost_per_unit_usd) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.farmId,
      data.name,
      data.category,
      data.unitOfMeasure,
      data.currentQuantity,
      data.minQuantityAlert,
      data.costPerUnitUsd,
    ],
  );
  return { id: result.insertId, ...data };
};

export const adjustStockQuantity = async (stockItemId, deltaQuantity) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [items] = await connection.query(
      "SELECT current_quantity, name, unit_of_measure FROM stock_items WHERE id = ? FOR UPDATE",
      [stockItemId],
    );

    if (items.length === 0) {
      throw new Error("Insumo no encontrado");
    }

    const item = items[0];
    const newQuantity = Number(item.current_quantity) + Number(deltaQuantity);

    if (newQuantity < 0) {
      throw new Error(
        `Stock insuficiente para ${item.name}. Actual: ${item.current_quantity} ${item.unit_of_measure}`,
      );
    }

    await connection.query(
      "UPDATE stock_items SET current_quantity = ? WHERE id = ?",
      [newQuantity, stockItemId],
    );

    await connection.commit();
    return {
      stockItemId,
      previousQuantity: item.current_quantity,
      newQuantity,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
