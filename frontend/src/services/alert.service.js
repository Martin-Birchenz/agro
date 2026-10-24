import api from "./api";

export const getZootechnicalAlerts = async () => {
  return await api.get("/alerts");
};
