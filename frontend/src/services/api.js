import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Desempaquetador automático de la estructura { success, data, message }
api.interceptors.response.use(
  (response) => response.data?.data ?? response.data,
  (error) => {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      "Error al conectar con la API central";
    return Promise.reject(new Error(errorMsg));
  },
);

export default api;
