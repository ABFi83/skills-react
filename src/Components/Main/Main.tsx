import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import ProjectGrid from "../ProjectGrid/ProjectGrid";
import ProjectDetails from "../ProjectDetails/ProjectDetails";
import Header from "../Header/Header";
import ProjectApiService from "../../Service/ProjectApiService";
import { User } from "../../Interfaces/User";
import { Project } from "../../Interfaces/Project";

interface MainProps {
  userId: string;
  user?: User;
}

const Main = ({ userId, user }: MainProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await ProjectApiService.getUserProjects(userId);
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
      <Header user={user} />
      {/* Definizione delle rotte interne per i progetti */}
      <Routes>
        {/* La rotta principale per i progetti */}
        <Route path="/" element={<ProjectGrid projects={projects} />} />
        {/* La rotta per i dettagli di un progetto */}
        <Route path="/project/:id" element={<ProjectDetails />} />
      </Routes>
    </div>
  );
};

export default Main;
