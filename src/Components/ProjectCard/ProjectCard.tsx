import { Link } from "react-router-dom";
import { Project } from "../../Interfaces/Project";
import { User } from "../../Interfaces/User";
import "./ProjectCard.css";
import PolygonalLevelIndicator from "../PoligonLevel/PoligonLevel";
import DataExtractorService from "../../Service/DataExtractorService";
import RatingIndicator from "../RatingIndicator/RatingIndicator";
import RoleDisplay from "../RoleDispayProps/RoleDisplayProps";
interface UserInterface {
  user: User;
}
interface ProjectInterface {
  project: Project;
}
const ProjectCard = ({ project }: ProjectInterface) => {
  const { labels, values } = DataExtractorService({
    labelsData: project.labelEvaluations,
    valuesData: project.evaluations ? project.evaluations[0].values : [],
  });

  return (
    <Link to={`/project/${project.id}`} className="project-card-link">
      <div className="project-card">
        <div className="project-details">
          <h3>{project.projectName}</h3>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              gap: "32%", // Imposta lo spazio tra gli elementi
            }}
          >
            <RoleDisplay roleCode={project.role} />
            <RatingIndicator value={project.evaluations[0].ratingAverage} />
          </p>
        </div>
        <div className="polygon-container">
          <PolygonalLevelIndicator
            levels={values}
            labels={labels}
            label={undefined}
          />
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
