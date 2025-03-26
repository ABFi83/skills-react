import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import ProjectGrid from "../ProjectGrid/ProjectGrid";
import ProjectDetails from "../ProjectDetails/ProjectDetails";
import Header from "../Header/Header";
import ProjectApiService from "../../Service/ProjectApiService";
import { UserResponse } from "../../Interfaces/User";
import { Project } from "../../Interfaces/Project";

interface MainProps {
  userId: string;
  user?: UserResponse;
}

const Main = ({ userId, user }: MainProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await ProjectApiService.getUserProjects();
        setProjects(data);
      } catch (err) {
        setError("Errore nel caricamento dei progetti.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId]);

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<ProjectGrid projects={projects} />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
      </Routes>
    </div>
  );
};

export default Main;
