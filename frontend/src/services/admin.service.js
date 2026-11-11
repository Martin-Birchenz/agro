import api from "./api";

export const getFarmsList = async (clientId = 1) => {
  const data = await api.get(`/admin/farms?clientId=${clientId}`);
  return data;
};

export const getFarmStock = async (farmId) => {
  const data = await api.get(`/admin/farms/${farmId}/stock`);
  return data;
};

export const createStockItem = async (payload) => {
  const data = await api.post("/admin/stock", payload);
  return data;
};

export const adjustStock = async (id, deltaQuantity, reason) => {
  const data = await api.patch(`/admin/stock/${id}/adjust`, {
    deltaQuantity,
    reason,
  });
  return data;
};
