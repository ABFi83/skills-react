import { useState } from "react";
import UserApiService from "../../Service/UserApiService";
import "./Login.css"; // Aggiungi il CSS per il mini-header

interface LoginProps {
  onLogin: (token: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // Stato per l'errore

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await UserApiService.login(username, password);
      onLogin(token);
      setError(null); // Resetta l'errore se il login è riuscito
    } catch (error) {
      setError("Errore nel login: username o password non corretti.");
      console.error("Errore nel login", error);
    }
  };

  return (
    <div className="login-container">
      <div className="app-header">
        <span className="app-name">SKILL</span>
        <div className="header-logo">
          <img src="logo192.png" alt="Logo" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="input-field"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="input-field"
        />
        {error && <p className="error-message">{error}</p>}{" "}
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
