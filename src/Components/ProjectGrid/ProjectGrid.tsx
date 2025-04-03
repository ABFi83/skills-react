import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./ProjectGrid.css";
import ProjectCard from "../ProjectCard/ProjectCard";
import { Project } from "../../Interfaces/Project";
import ProjectCardLM from "../ProjectCardLM/ProjectCardLM";
import { useAuth } from "../../Context/AuthContext";
import ProjectCardADD from "../ProjectCardADD/ProjectCardADD";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface ProjectGridProps {
  projects: Project[];
}

const ProjectGrid = ({ projects }: ProjectGridProps) => {
  const columns = 3;
  const { user } = useAuth();

  // Verifica se il progetto "ADD" esiste già nella lista
  const addProjectExists = projects.some((project) => project.id === "ADD");

  // Se l'utente è amministratore e il progetto "ADD" non esiste, aggiungilo
  if (user?.isAdmin && !addProjectExists) {
    let add: Project = {
      id: "ADD", // ID unico per il progetto "ADD"
      projectName: "Add New Project",
      description: "",
      evaluations: [],
      labelEvaluations: [],
      users: [],
    };
    projects.push(add); // Aggiungi il progetto "ADD" alla lista
  }

  const layouts = {
    lg: projects.map((project, index) => ({
      i: project.id.toString(),
      x: (index % columns) * (12 / columns), // Divide lo spazio in 3 colonne
      y: Math.floor(index / columns), // Posiziona ogni progetto su una nuova riga ogni 3 elementi
      w: 12 / columns, // Ogni progetto occupa 1/3 della larghezza
      h: 2, // Altezza del progetto
      static: true,
    })),
  };

  return (
    <div className="project-grid-container">
      {projects.map((project) => (
        <div key={project.id} className="project-grid-item">
          {user && !user.isAdmin ? (
            <ProjectCard project={project} />
          ) : project.id !== "ADD" ? (
            <ProjectCardLM project={project} />
          ) : (
            <ProjectCardADD />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectGrid;
