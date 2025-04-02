import axios from "axios";
import { API_BASE_URL } from "../config";
import { handleError } from "./errorHandler";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Errore 401: Token non valido. Effettuo il logout...");
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    handleError(error); // Chiamata alla gestione centralizzata degli errori
    return Promise.reject(error);
  }
);

export default api;
