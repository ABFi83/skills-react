import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProjectGrid from "../ProjectGrid/ProjectGrid";
import ProjectDetails from "../ProjectDetails/ProjectDetails";
import Header from "../Header/Header";
import ProjectApiService from "../../Service/ProjectApiService";
import { Project } from "../../Interfaces/Project";

const Main = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // Redirige a login
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        let data: Project[] = [];
        data = await ProjectApiService.getUserProjects();

        setProjects(data);
      } catch (err) {
        setError("Errore nel caricamento dei progetti.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []); // Aggiungi una dipendenza vuota per eseguire solo al primo render

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <Routes>
        <Route path="/*" element={<ProjectGrid projects={projects} />} />
      </Routes>
    </div>
  );
};

export default Main;
