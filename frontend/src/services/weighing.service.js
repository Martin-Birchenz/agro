import api from "./api";

export const registerManualWeighing = async (payload) => {
  // Antes estaba "/api/weighings/manual", debe ser:
  const data = await api.post("/weighings/manual", payload);
  return data;
};

export const getAnimalFiche = async (rfidTag) => {
  const data = await api.get(`/weighings/fiche/${rfidTag}`);
  return data;
};

export const getCategories = async () => {
  const data = await api.get("/animals/categories");
  return data;
};

export const registerAnimalManual = async (payload) => {
  const data = await api.post("/animals", payload);
  return data;
};
