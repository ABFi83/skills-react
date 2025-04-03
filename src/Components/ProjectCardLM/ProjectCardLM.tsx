import { Link } from "react-router-dom";
import { Project } from "../../Interfaces/Project";

import "./ProjectCardLM.css";
import UserProfile from "../UserProfile/UserProfile";
import RatingIndicator from "../RatingIndicator/RatingIndicator";
import { useProject } from "../../Context/ProjectContext";

interface ProjectInterface {
  project: Project;
}
const ProjectCardLM = ({ project }: ProjectInterface) => {
  const { setProjects } = useProject();
  const handleProjectClick = () => {
    setProjects((prevProjects: Project[]) => {
      const projectExists = prevProjects.some(
        (p: Project) => p.id === project.id
      );

      if (projectExists) {
        return prevProjects.map((p: Project) =>
          p.id === project.id ? project : p
        );
      } else {
        return [...prevProjects, project];
      }
    });
  };

  return (
    <Link
      to={`/project/${project.id}/lm`}
      onClick={handleProjectClick}
      className="project-card-link"
    >
      <div className="project-card">
        <div className="project-details">
          <h3>{project.projectName}</h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "8px",
            }}
          >
            {project.users.map((user) => (
              <div
                key={user.id}
                style={{
                  display: "flex", // Allinea UserProfile e RatingIndicator in linea
                  alignItems: "center", // Allinea verticalmente
                  backgroundColor: "#f0f0f0",
                  padding: "5px 10px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  gap: "8px", // Spazio tra UserProfile e RatingIndicator
                }}
              >
                <UserProfile
                  username={user.username}
                  clientId={user.code}
                  viewName={false}
                />
                {user.ratingAverage && (
                  <RatingIndicator value={user.ratingAverage} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCardLM;
