import axios from "axios";
import { API_BASE_URL } from "../config";

const api = axios.create({
  baseURL: API_BASE_URL, // Cambia con il tuo URL backend
});

// Interceptor per aggiungere il token ad ogni richiesta
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor per gestire errori di risposta
api.interceptors.response.use(
  (response) => response, // Se la risposta è ok, restituiscila così com'è
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 400)
    ) {
      console.error("Errore 401: Token non valido. Effettuo il logout...");
      localStorage.removeItem("token"); // Rimuove il token
      window.location.href = "/"; // Reindirizza alla homepage
    }
    return Promise.reject(error);
  }
);

export default api;
