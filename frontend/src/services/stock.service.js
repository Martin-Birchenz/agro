import api from "./api";

export const getFarmStock = async (farmId, category = null) => {
  const query = category ? `?category=${category}` : "";
  const data = await api.get(`/admin/farms/${farmId}/stock${query}`);
  return data;
};

export const createStockItem = async (payload) => {
  const data = await api.post("/admin/stock", payload);
  return data;
};

export const adjustStock = async (stockItemId, deltaQuantity, reason) => {
  const data = await api.patch(`/admin/stock/${stockItemId}/adjust`, {
    deltaQuantity,
    reason,
  });
  return data;
};
