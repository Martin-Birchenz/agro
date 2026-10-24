import api from "./api";

export const getAnimalFiche = async (rfidTag) => {
  return await api.get(`/weighings/animal/${rfidTag}`);
};

export const syncBatchWeighings = async (payload) => {
  return await api.post("/weighings/batch-sync", payload);
};
