import { Link } from "react-router-dom";
import { Project } from "../../Interfaces/Project";
import { User } from "../../Interfaces/User";
import "./ProjectCard.css";
import PolygonalLevelIndicator from "../PoligonLevel/PoligonLevel";
import DataExtractorService from "../../Service/DataExtractorService";
interface UserInterface {
  user: User;
}
interface ProjectInterface {
  project: Project;
}
const ProjectCard = ({ user, project }: UserInterface & ProjectInterface) => {
  const { labels, values } = DataExtractorService({
    labelsData: project.labelEvaluations,
    valuesData: project.evaluations ? project.evaluations[0].values : [],
  });

  return (
    <div className="project-card">
      <div className="project-details">
        <h3>{project.projectName}</h3>
        <p>Evaluation: {project.evaluations[0].ratingAverage}</p>

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
        levels={values}
        labels={labels}
        label={project.evaluations ? project.evaluations[0].label : undefined}
      />
    </div>
  );
};

export default ProjectCard;
