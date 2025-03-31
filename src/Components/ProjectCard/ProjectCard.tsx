import { Link } from "react-router-dom";
import { Project } from "../../Interfaces/Project";
import "./ProjectCard.css";
import PolygonalLevelIndicator from "../PoligonLevel/PoligonLevel";
import DataExtractorService from "../../Service/DataExtractorService";
import RatingIndicator from "../RatingIndicator/RatingIndicator";
import RoleDisplay from "../RoleDispayProps/RoleDisplayProps";
import { useProject } from "../../Context/ProjectContext"; // Importa il contesto

interface ProjectInterface {
  project: Project;
}

const ProjectCard = ({ project }: ProjectInterface) => {
  const { setProjects } = useProject(); // Usa il contesto per aggiornare il progetto selezionato

  const { labels, values } = DataExtractorService({
    labelsData: project.labelEvaluations,
    valuesData: project.evaluations ? project.evaluations[0].values : [],
  });

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
          <h3>{project.projectName}</h3>
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
