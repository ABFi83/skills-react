import { Link } from "react-router-dom";
import { Project } from "../../Interfaces/Project";
import { User } from "../../Interfaces/User";
import "./ProjectCard.css";
import PolygonalLevelIndicator from "../PoligonLevel/PoligonLevel";
interface UserInterface {
  user: User;
}
interface ProjectInterface {
  project: Project;
}
const ProjectCard = ({ user, project }: UserInterface & ProjectInterface) => {
  return (
    <div className="project-card">
      <div className="project-details">
        <h3>{project.projectName}</h3>
        <p>Evaluation: {project.evaluation}</p>
        <p>Role: {project.role}</p>
        <Link
          to={`/project/${project.id}`}
          style={{
            color: "#007bff",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          View Details
        </Link>
      </div>
      <PolygonalLevelIndicator
        levels={[10, 5, 10, 2, 3, 5, 1]}
        labels={["A", "B", "C", "C", "C", "C", "C"]}
      />
    </div>
  );
};

export default ProjectCard;
