import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Components/Login/Login";
import UserApiService from "./Service/UserApiService";
import { UserResponse } from "./Interfaces/User";
import Main from "./Components/Main/Main";

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<UserResponse | undefined>(undefined);

  const handleLogin = async (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    try {
      const user = await UserApiService.getUser();
      setUser(user);
    } catch (error) {
      console.error("Errore durante il recupero dell'utente:", error);
    }
  };

  return (
    <Router>
      <div className="app-container">
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
