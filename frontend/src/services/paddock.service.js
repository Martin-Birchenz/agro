import api from "./api";

export const getPaddocksList = async () => {
  return await api.get("/paddocks");
};

export const getPaddockMetrics = async (paddockId) => {
  return await api.get(`/paddocks/${paddockId}/metrics`);
};

export const createPaddock = async (payload) => {
  return await api.post("/paddocks", payload);
};

export const moveAnimalPaddock = async (animalId, newPaddockId) => {
  return await api.put(`/paddocks/animals/${animalId}/move`, { newPaddockId });
};
