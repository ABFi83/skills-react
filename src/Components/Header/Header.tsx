import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { UserResponse } from "../../Interfaces/User";
import UserProfile from "../UserProfile/UserProfile";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import UserApiService from "../../Service/UserApiService";

interface UserInterface {
  user?: UserResponse;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: UserInterface) {
  const [currentUser, setCurrentUser] = useState<UserResponse | undefined>(
    user
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      UserApiService.getUser()
        .then((res) => res)
        .then((data) => setCurrentUser(data))
        .catch((error) =>
          console.error("Errore nel recupero dell'utente:", error)
        );
    }
  }, [currentUser]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    onLogout();
    setCurrentUser(undefined);
    navigate("/");
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
        <div className="header-user" />
        <div className="header-logo" onClick={toggleMenu}>
          <img src="logo192.png" alt="Logo" />
          {menuOpen && (
            <div className="dropdown-menu">
              <p>Benvenuto,</p>
              {currentUser ? (
                <UserProfile
                  username={currentUser.username}
                  clientId={currentUser.code}
                />
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
