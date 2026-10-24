import api from "./api";

// Módulo 02: Cuadrado de Pearson
export const calculatePearsonRation = async (payload) => {
  return await api.post("/zootechnics/ration-pearson", payload);
};

// Módulo 05: Conversión Alimenticia
export const calculateFeedConversion = async (payload) => {
  return await api.post("/zootechnics/feed-conversion", payload);
};

// Módulo 09: Balance Hídrico y Estrés Térmico
export const calculateWaterBalance = async (payload) => {
  return await api.post("/zootechnics/water-balance", payload);
};

// Módulo 16: Compra-Venta y Margen de Invernada
export const calculateBuySellMargin = async (payload) => {
  return await api.post("/zootechnics/buy-sell-margin", payload);
};
