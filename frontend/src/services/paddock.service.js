import api from "./api";

export const getPaddockMetrics = async (paddockId) => {
  return await api.get(`/paddocks/${paddockId}/metrics`);
};

export const moveAnimalPaddock = async (animalId, newPaddockId) => {
  return await api.put(`/paddocks/animals/${animalId}/move`, { newPaddockId });
};
