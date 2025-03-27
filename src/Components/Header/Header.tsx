import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { UserResponse } from "../../Interfaces/User";
import UserProfile from "../UserProfile/UserProfile";

interface UserInterface {
  user?: UserResponse;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: UserInterface) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-title">SKILL</div>
      </div>
      <div className="header-right">
        <div className="header-user" />
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
