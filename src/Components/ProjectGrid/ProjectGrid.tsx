import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import ProjectCard from "../ProjectCard/ProjectCard";
import { Project } from "../../Interfaces/Project";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface ProjectGridProps {
  projects: Project[]; // Array di oggetti Project
}

const ProjectGrid = ({ projects }: ProjectGridProps) => {
  const columns = 3;

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
              display: "flex", // Mantiene il layout flessibile
              justifyContent: "flex-start", // Allinea il contenuto a sinistra
              alignItems: "flex-start", // Allinea verticalmente a sinistra
              padding: "10px", // Spaziatura attorno al ProjectCard
              width: "100%", // Assicura che occupi tutta la larghezza disponibile
            }}
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default ProjectGrid;
