import api from "./api";

// Módulo 01 & 11: Requerimientos Nutricionales y Carga
export const calculateNutritionDemand = async (payload) => {
  return await api.post("/zootechnics/nutrition-demand", payload);
};

// Módulo 02: Cuadrado de Pearson
export const calculatePearsonRation = async (payload) => {
  return await api.post("/zootechnics/ration-pearson", payload);
};

// Módulo 03: Carga Animal y Receptividad Forrajera
export const calculateCarryingCapacity = async (payload) => {
  return await api.post("/zootechnics/carrying-capacity", payload);
};

// Módulo 04: Asignación Forrajera y Franja Diaria
export const calculateGrazingStrip = async (payload) => {
  return await api.post("/zootechnics/grazing-strip", payload);
};

// Módulo 05: Conversión Alimenticia
export const calculateFeedConversion = async (payload) => {
  return await api.post("/zootechnics/feed-conversion", payload);
};

// Módulo 07: Dosificación Antiparasitaria y Retiro
export const calculateAntiparasiticDosing = async (payload) => {
  return await api.post("/zootechnics/antiparasitic-dosing", payload);
};

// Módulo 08: Calendario Sanitario Anual
export const calculateSanitaryCalendar = async (payload) => {
  return await api.post("/zootechnics/sanitary-calendar", payload);
};

// Módulo 09: Balance Hídrico y Estrés Térmico
export const calculateWaterBalance = async (payload) => {
  return await api.post("/zootechnics/water-balance", payload);
};

// Módulo 10: Condición Corporal y Preñez Proyectada
export const calculateBodyCondition = async (payload) => {
  return await api.post("/zootechnics/body-condition", payload);
};

// Módulo 12: Suplementación Estratégica
export const calculateStrategicSupplementation = async (payload) => {
  return await api.post("/zootechnics/strategic-supplementation", payload);
};

// Módulo 13: Planificación de Destete y Recría
export const calculateWeaningPlan = async (payload) => {
  return await api.post("/zootechnics/weaning-plan", payload);
};

// Módulo 14: Ficha de Rodeo y Balance de Stock
export const calculateHerdStockBalance = async (payload) => {
  return await api.post("/zootechnics/herd-stock-balance", payload);
};

// Módulo 15: Costo Directo y Punto de Equilibrio
export const calculateDirectCosts = async (payload) => {
  return await api.post("/zootechnics/direct-costs", payload);
};

// Módulo 16: Compra-Venta y Margen de Invernada
export const calculateBuySellMargin = async (payload) => {
  return await api.post("/zootechnics/buy-sell-margin", payload);
};
