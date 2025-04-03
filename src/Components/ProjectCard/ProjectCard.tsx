import { Link } from "react-router-dom";
import { Label, Project, Value } from "../../Interfaces/Project";
import "./ProjectCard.css";
import PolygonalLevelIndicator from "../PoligonLevel/PoligonLevel";
import RatingIndicator from "../RatingIndicator/RatingIndicator";
import RoleDisplay from "../RoleDispayProps/RoleDisplayProps";
import { useProject } from "../../Context/ProjectContext";
import { useCallback, useEffect, useState } from "react";

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
