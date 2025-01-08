import "./Header.css";
import { User } from "../../Interfaces/User"; // Assicurati che il percorso sia corretto

// Definizione dei tipi delle props
interface HeaderProps {
  user: User; // Usa l'interfaccia User come tipo
}

// Componente funzionale
export default function Header({ user }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-left">
        {/* Scritta "SKILL" a sinistra */}
        <div className="header-title">SKILL</div>
      </div>
      <div className="header-right">
        <div className="header-user">Benvenuto {user.username}</div>
        <div className="header-logo">
          <img src="logo192.png" alt="Logo" />
        </div>
      </div>
    </header>
  );
}
