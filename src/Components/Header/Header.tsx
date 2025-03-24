import "./Header.css";
import { User } from "../../Interfaces/User"; // Assicurati che il percorso sia corretto

// Definizione dei tipi delle props
interface UserInterface {
  user?: User;
}

// Componente funzionale
export default function Header({ user }: UserInterface) {
  return (
    <header className="header">
      <div className="header-left">
        {/* Scritta "SKILL" a sinistra */}
        <div className="header-title">SKILL</div>
      </div>
      <div className="header-right">
        <div className="header-user">Benvenuto {user ? user.username : ""}</div>
        <div className="header-logo">
          <img src="logo192.png" alt="Logo" />
        </div>
      </div>
    </header>
  );
}
