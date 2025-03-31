// src/services/clientService.ts
import { API_BASE_URL } from "../config";
import api from "./APIService";

export const getClientLogoUrl = (clientCode: string): string => {
  return `${API_BASE_URL}/logo/${clientCode}`;
};

export const getClients = async (searchQuery: string) => {
  try {
    const response = await api.get("/clients", {
      params: {
        search: searchQuery, // Aggiungi il parametro di ricerca (o altri parametri necessari)
      },
    });
    return response.data;
  } catch (error) {
    console.error("Errore durante il recupero dei clienti:", error);
    throw error;
  }
};
