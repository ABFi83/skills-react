import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Components/Login/Login";
import Main from "./Components/Main/Main";
import ErrorBanner from "./Components/ErrorBanner/ErrorBanner";
import { AuthProvider } from "./Context/AuthContext";
import ProjectDetails from "./Components/ProjectDetails/ProjectDetails"; // Importa il componente dei dettagli del progetto
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";

function App() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);

  const updateErrorState = (message: string) => {
    setErrorMessage(message);
    setShowBanner(true);
  };

  const closeBanner = () => {
    setShowBanner(false);
    setErrorMessage(null);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          {showBanner && errorMessage && (
            <ErrorBanner message={errorMessage} onClose={closeBanner} />
          )}
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Proteggi la rotta principale e la rotta del progetto */}
            <Route element={<PrivateRoute />}>
              {/* Aggiungi Header fuori dalla rotta */}
              <Route path="/main" element={<Main />} />
              <Route path="/project/:id" element={<ProjectDetails />} />
            </Route>

            {/* Rotta di fallback per gli utenti non autenticati */}
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
