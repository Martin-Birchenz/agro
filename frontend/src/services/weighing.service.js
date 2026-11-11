import api from "./api";

export const getAnimalFiche = async (rfidTag) => {
  return await api.get(`/weighings/animal/${rfidTag}`);
};

export const getCategories = async () => {
  return await api.get("/animals/categories");
};

export const registerAnimalManual = async (payload) => {
  return await api.post("/animals", payload);
};

export const registerManualWeighing = async (payload) => {
  // payload: { rfidTag, weightKg, targetWeightKg, notes, weighedAt }
  const response = await api.post("/api/weighings/manual", payload);
  return response.data;
};
