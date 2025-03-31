import React, { createContext, useContext, useState, useEffect } from "react";
import UserApiService from "../Service/UserApiService";
import { UserResponse } from "../Interfaces/User";

// Cambia il tipo di login per accettare username e password
interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    if (token) {
      UserApiService.getUser()
        .then(setUser)
        .catch(() => logout());
    }
  }, [token]);

  // Modifica la funzione login per accettare username e password
  const login = async (username: string, password: string) => {
    try {
      const token = await UserApiService.login(username, password);
      localStorage.setItem("token", token);
      setToken(token);

      const user = await UserApiService.getUser();
      setUser(user);
    } catch (error) {
      throw new Error("Login fallito");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
