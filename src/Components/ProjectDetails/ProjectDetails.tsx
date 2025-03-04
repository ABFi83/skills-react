import { useParams } from "react-router-dom";
import PolygonalLevelIndicator from "../PoligonLevel/PoligonLevel";
import { Project } from "../../Interfaces/Project";
import "./ProjectDetail.css";
import DataExtractorService from "../../Service/DataExtractorService";
import { useEffect, useState } from "react";
import { Evaluation } from "../../Interfaces/Evalutation";

const ProjectDetails = () => {
  const { id } = useParams(); // Leggi l'ID del progetto dalla rotta

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const project: Project = {
    id: "1",
    projectName: "Test1",
    ratingAverage: 6,
    role: "DEV",
    evaluations: [
      {
        id: "1",
        label: "01/01/2024",
        values: [
          { id: "1", skill: "1", value: 10 },
          { id: "2", skill: "2", value: 3 },
          { id: "3", skill: "3", value: 6 },
        ],
      },
      {
        id: "2",
        label: "01/02/2024",
        values: [
          { id: "1", skill: "1", value: 10 },
          { id: "2", skill: "2", value: 12 },
          { id: "3", skill: "3", value: 12 },
        ],
      },
      {
        id: "3",
        label: "01/03/2024",
        values: [
          { id: "1", skill: "1", value: 2 },
          { id: "2", skill: "2", value: 3 },
          { id: "3", skill: "3", value: 1 },
        ],
      },
    ],
    labelEvaluations: [
      { id: "1", label: "Java", shortLabel: "J" },
      { id: "2", label: "React", shortLabel: "Re" },
      { id: "3", label: "C#", shortLabel: "C" },
    ],
  };

  const [labelPoligon, setLabelPoligon] = useState<string>();
  const [labelsPoligon, setLabelsPoligon] = useState<string[]>();
  const [levelsPoligon, setLevelsPoligon] = useState<number[]>();

  useEffect(() => {
    if (project.evaluations && project.evaluations.length > 0) {
      // Check if evaluations exist
      // setLabelPoligon(project.evaluations[0].label);
      // setLevelsPoligon(values);
      // setLabelsPoligon(labels);
    }
  }, [project]); // Add project as a dependency

  const handleHeaderClick = (evaluation: Evaluation) => {
    // Here you can implement your logic, e.g., filtering, sorting, etc.
    //setLabelPoligon(evaluation.label);
    //setLevelsPoligon(evaluation.values);
  };

  return (
    <div>
      <div className="container">
        <div className="left">
          <p>{project.projectName}</p>
        </div>
        <div className="right">
          <PolygonalLevelIndicator
            levels={levelsPoligon ?? []}
            labels={labelsPoligon}
            label={labelPoligon}
          />
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Skill</th>
            {project.evaluations.map((l) => (
              <th key={l.label} onClick={() => handleHeaderClick(l)}>
                {l.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {project.labelEvaluations.map((label, labelIndice) => (
            <tr key={labelIndice}>
              <th>{label.label}</th>
              {project.evaluations.map((l, indice) => (
                <td>{l.values[labelIndice].value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectDetails;
