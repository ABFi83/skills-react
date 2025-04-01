import api from "./APIService";

export const getRoles = async (searchQuery: string) => {
  try {
    const response = await api.get("/roles", {
      params: {
        search: searchQuery, // Aggiungi il parametro di ricerca
      },
    });
    return response.data; // Restituisce i dati dei ruoli
  } catch (error) {
    console.error("Errore durante il recupero dei ruoli:", error);
    throw error;
  }
};
