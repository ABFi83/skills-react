import { toast } from "react-toastify";

export const handleError = (error: any) => {
  if (error.response) {
    // Gestione degli errori HTTP
    switch (error.response.status) {
      case 401:
        console.error("Errore 401: Token non valido. Effettuo il logout...");
        localStorage.removeItem("token");
        window.location.href = "/";
        break;
      case 500:
        console.error("Errore 500: Errore interno del server.");
        toast.error("Errore interno del server. Riprova più tardi.");
        break;
      default:
        console.error(
          `Errore ${error.response.status}: ${error.response.statusText}`
        );
        toast.error(`Errore: ${error.response.statusText}`);
        break;
    }
  } else if (error.request) {
    // Nessuna risposta dal server
    console.error("Errore di rete o nessuna risposta dal server.");
    toast.error("Errore di rete. Controlla la tua connessione.");
  } else {
    // Errore generico
    console.error("Errore:", error.message);
    toast.error("Si è verificato un errore. Riprova.");
  }

  // Rilancia l'errore per consentire ulteriori gestioni, se necessario
  throw error;
};
