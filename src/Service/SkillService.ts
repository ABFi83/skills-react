import api from "./APIService";

export const getSkills = async (searchQuery: string) => {
  try {
    const response = await api.get("/skills", {
      params: {
        search: searchQuery, // Aggiungi il parametro di ricerca (o altri parametri necessari)
      },
    });
    return response.data; // Restituisce i dati delle skill
  } catch (error) {
    console.error("Errore durante il recupero delle skill:", error);
    throw error;
  }
};
