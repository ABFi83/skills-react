import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext"; // Aggiungi useAuth
import "./Header.css";
import UserProfile from "../UserProfile/UserProfile";
import Breadcrumb from "../Breadcrumb/Breadcrumb";

interface UserInterface {
  onLogout: () => void;
}

export default function Header({ onLogout }: UserInterface) {
  const { user, logout } = useAuth(); // Usa il contesto per ottenere l'utente e la funzione logout
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout(); // Usa la funzione logout dal contesto
    navigate("/"); // Naviga alla pagina di login
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-title">SKILL</div>
        <div className="breadcrumb-container">
          <Breadcrumb />
        </div>
      </div>
      <div className="header-right">
        <div className="header-logo" onClick={toggleMenu}>
          <img src="logo192.png" alt="Logo" />
          {menuOpen && (
            <div className="dropdown-menu">
              <p>Benvenuto,</p>
              {user ? (
                <UserProfile username={user.username} clientId={user.code} />
              ) : (
                <p>Ospite</p>
              )}

              <p
                className="logout-text"
                onClick={handleLogout}
                style={{
                  cursor: "pointer",
                  color: "blue",
                  textDecoration: "underline",
                }}
              >
                Esci
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
