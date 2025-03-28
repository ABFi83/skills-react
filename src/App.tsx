// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Components/Login/Login";
import UserApiService from "./Service/UserApiService";
import { UserResponse } from "./Interfaces/User";
import Main from "./Components/Main/Main";
import { handleError } from "./Service/errorHandler";
import ErrorBanner from "./Components/ErrorBanner/ErrorBanner";
import api from "./Service/APIService";

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<UserResponse | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Stato per il messaggio di errore
  const [showBanner, setShowBanner] = useState<boolean>(false); // Stato per la visibilità del banner

  // Funzione intermedia per aggiornare lo stato dell'errore
  const updateErrorState = (message: string) => {
    setErrorMessage(message);
    setShowBanner(true);
  };

  const handleLogin = async (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    try {
      const user = await UserApiService.getUser();
      setUser(user);
    } catch (error) {
      console.error("Errore durante il recupero dell'utente:", error);
      handleError(error, updateErrorState); // Passa la funzione intermedia
    }
  };

  const closeBanner = () => {
    setShowBanner(false);
    setErrorMessage(null); // Pulisce il messaggio
  };

  // Configura l'interceptor API per catturare errori globali
  useEffect(() => {
    const apiInterceptor = (error: any) => {
      handleError(error, updateErrorState); // Passa la funzione intermedia
      return Promise.reject(error);
    };

    // Assicurati che il tuo apiService utilizzi questo interceptor
    api.interceptors.response.use(undefined, apiInterceptor);

    return () => {
      // Cleanup interceptor (se usi axios)
      // api.interceptors.response.eject(apiInterceptor);
    };
  }, []);

  return (
    <Router>
      <div className="app-container">
        {showBanner && errorMessage && (
          <ErrorBanner message={errorMessage} onClose={closeBanner} />
        )}
        <Routes>
          {!token ? (
            <Route path="*" element={<Login onLogin={handleLogin} />} />
          ) : (
            <Route
              path="*"
              element={<Main userId={user?.id || ""} user={user} />}
            />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
