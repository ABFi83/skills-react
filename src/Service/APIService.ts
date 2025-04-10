import axios from "axios";
import { API_BASE_URL } from "../config";
import { handleError } from "./ErrorHandler";

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
    handleError(error); // Gestione centralizzata degli errori
    return Promise.reject(error);
  }
);

export default api;
