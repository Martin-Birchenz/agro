import api from "./api";

export const getHerdSummary = async () => {
  return await api.get("/reports/summary");
};

export const downloadPesajesCsvUrl = (paddockId = null) => {
  const base = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  return paddockId
    ? `${base}/reports/export/csv?paddockId=${paddockId}`
    : `${base}/reports/export/csv`;
};
