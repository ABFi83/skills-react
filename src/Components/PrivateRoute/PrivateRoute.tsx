import React from "react";
import { Route, Navigate, Outlet } from "react-router-dom";

import Header from "../Header/Header";
import { useAuth } from "../../Context/AuthContext";

// Componente per proteggere le rotte
const PrivateRoute = () => {
  const { token } = useAuth();

  // Se l'utente non è autenticato (manca il token), viene reindirizzato alla pagina di login
  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      {/* Qui inserisci il tuo header, che sarà visibile per tutte le rotte protette */}
      <Header onLogout={() => {}} />
      <Outlet /> {/* Renderizza le rotte figlie */}
    </div>
  );
};

export default PrivateRoute;
