import { API_BASE_URL } from "../config";
import { UserResponse } from "../Interfaces/User";
import api from "./APIService";

const UserApiService = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error("Login failed"); // Puoi gestire questo errore in modo più specifico se vuoi
    }
    const data = await response.json();
    return data.token;
  },
  getUser: async () => {
    try {
      const response = await api.get<UserResponse>(`/user`);
      return response.data;
    } catch (error) {
      console.error("Errore nella chiamata API:", error);
      throw error;
    }
  },
  getUsers: async (searchQuery: string) => {
    try {
      const response = await api.get("/users", {
        params: {
          search: searchQuery, // Aggiungi il parametro di ricerca
        },
      });
      return response.data; // Restituisce i dati degli utenti
    } catch (error) {
      console.error("Errore durante il recupero degli utenti:", error);
      throw error;
    }
  },
};

export default UserApiService;
