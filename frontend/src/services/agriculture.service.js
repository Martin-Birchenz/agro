import api from "./api";

export const getFarmPlots = async (farmId) => {
  const data = await api.get(`/agriculture/farms/${farmId}/plots`);
  return data;
};

export const createPlot = async (payload) => {
  const data = await api.post("/agriculture/plots", payload);
  return data;
};

export const registerLabor = async (payload) => {
  const data = await api.post("/agriculture/labors", payload);
  return data;
};

export const createCampaign = async (payload) => {
  const data = await api.post("/agriculture/campaigns", payload);
  return data;
};

export const getGrossMargins = async (farmId) => {
  const data = await api.get(`/agriculture/farms/${farmId}/gross-margin`);
  return data;
};
