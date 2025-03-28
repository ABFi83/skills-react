// Service/errorHandler.js
export const handleError = (error, updateErrorState) => {
  console.log("Errore intercettato:", error); // Log dell'errore
  if (error.response) {
    const status = error.response.status;
    let message = "";
    switch (status) {
      case 401:
        message = "Token non valido. Effettuo il logout...";
        break;
      case 400:
        message = "Richiesta non valida";
        break;
      case 500:
        message = "Errore: " + error.response.data.error; // Messaggio per errore 500
        break;
      default:
        message = `Errore ${status}: ${error.message}`;
        break;
    }
    console.log("Messaggio di errore:", error);
    // Usa la funzione di aggiornamento passata per modificare lo stato
    if (updateErrorState) {
      updateErrorState(message);
    }
  } else if (error.request) {
    if (updateErrorState) {
      updateErrorState("Errore di rete: nessuna risposta dal server.");
    }
  } else {
    if (updateErrorState) {
      updateErrorState(`Errore: ${error.message}`);
    }
  }
};
