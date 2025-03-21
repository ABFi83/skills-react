import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useEffect, useState } from "react";
import UserApiService from "../../Service/UserApiService"; // Importa il servizio API
import { User } from "../../Interfaces/User";
import { Project } from "../../Interfaces/Project";
import ProjectGrid from "../ProjectGrid/ProjectGrid";
import ProjectDetails from "../ProjectDetails/ProjectDetails";

interface UserInterface {
  user: User;
}

const Main = ({ user }: UserInterface) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await UserApiService.getUserProjects(1); // Chiamata API con l'ID dell'utente
        setProjects(data);
      } catch (err) {
        setError("Errore nel caricamento dei progetti.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user.id]);

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<ProjectGrid user={user} projects={projects} />}
        />
        <Route path="/project/:id" element={<ProjectDetails />} />
      </Routes>
    </Router>
  );
};

export default Main;
