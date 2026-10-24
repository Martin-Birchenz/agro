import api from "./api";

export const getPaddockMetrics = async (paddockId) => {
  return await api.get(`/paddocks/${paddockId}/metrics`);
};
