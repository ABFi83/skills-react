import { Link } from "react-router-dom";
import { Project } from "../../Interfaces/Project";
import "./ProjectCard.css";
import RatingIndicator from "../RatingIndicator/RatingIndicator";
import RoleDisplay from "../RoleDispayProps/RoleDisplayProps";
import { useProject } from "../../Context/ProjectContext";
import ClientLogo from "../ClientLogo/ClientLogo";

interface ProjectInterface {
  project: Project;
}

const ProjectCard = ({ project }: ProjectInterface) => {
  const { setProjects } = useProject();

  const handleProjectClick = () => {
    setProjects((prevProjects) => {
      const projectExists = prevProjects.some((p) => p.id === project.id);

      if (projectExists) {
        return prevProjects.map((p) => (p.id === project.id ? project : p));
      } else {
        return [...prevProjects, project];
      }
    });
  };

  return (
    <Link
      to={`/project/${project.id}`}
      className="project-card-link"
      onClick={handleProjectClick}
    >
      <div className="project-card">
        <div className="project-details">
          <div className="project-header">
            <h4>{project.projectName}</h4>
            {project.client?.code && (
              <ClientLogo
                clientCode={project.client.code}
                className="client-logo-small"
              />
            )}
          </div>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              gap: "32%",
            }}
          >
            <RoleDisplay roleCode={project.role} />
            {project.evaluations && project.evaluations.length > 0 && (
              <RatingIndicator value={project.evaluations[0].ratingAverage} />
            )}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
