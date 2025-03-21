import { useParams } from "react-router-dom";
import PolygonalLevelIndicator from "../PoligonLevel/PoligonLevel";
import { Project } from "../../Interfaces/Project";
import "./ProjectDetail.css";
import { useEffect, useState } from "react";
import { Evaluation } from "../../Interfaces/Evalutation";
import ProjectApiService from "../../Service/ProjectApiService";

const ProjectDetails = () => {
  const { id } = useParams(); // ID del progetto dalla rotta
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [labelPoligon, setLabelPoligon] = useState<string>();
  const [labelsPoligon, setLabelsPoligon] = useState<string[]>();
  const [levelsPoligon, setLevelsPoligon] = useState<number[]>();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!id) {
          setError("Errore durante il caricamento del progetto");
          return;
        }
        const response = await ProjectApiService.getProjectDetail(id);
        setProject(response);
        setLabelsPoligon(response.labelEvaluations.map((v) => v.shortLabel));
        setLabelPoligon(response.evaluations[0].label);
        setLevelsPoligon(response.evaluations[0].values.map((v) => v.value));
      } catch (error) {
        setError("Errore durante il caricamento del progetto");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return <p>Caricamento...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!project) {
    return <p>Progetto non trovato</p>;
  }

  const handleHeaderClick = (evaluation: Evaluation) => {
    // Logica per aggiornare i dati selezionati
    setLabelPoligon(evaluation.label);
    setLevelsPoligon(evaluation.values.map((v) => v.value));
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
                <td key={indice}>{l.values[labelIndice]?.value ?? "-"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectDetails;
