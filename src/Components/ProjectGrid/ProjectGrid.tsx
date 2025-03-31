import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
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
      x: (index % columns) * 4,
      y: Math.floor(index / columns),
      w: 4,
      h: 2,
      static: true,
    })),
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        isResizable={false}
        isDraggable={false}
        margin={[10, 10]}
        containerPadding={[0, 0]}
        style={{ flex: 1 }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              padding: "10px",
              width: "100%",
            }}
          >
            {user && !user.isAdmin ? (
              <ProjectCard project={project} />
            ) : project.id !== "ADD" ? (
              <ProjectCardLM project={project} />
            ) : (
              <ProjectCardADD />
            )}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default ProjectGrid;
