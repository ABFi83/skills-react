import { useParams } from "react-router-dom";
import PolygonalLevelIndicator from "../PoligonLevel/PoligonLevel";
import { Project } from "../../Interfaces/Project";
import "./ProjectDetail.css";
import { useEffect, useState } from "react";
import { Evaluation } from "../../Interfaces/Evalutation";
import ProjectApiService from "../../Service/ProjectApiService";
import RatingIndicator from "../RatingIndicator/RatingIndicator";
import RoleDisplay from "../RoleDispayProps/RoleDisplayProps";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { FaArrowLeft } from "react-icons/fa";

const ProjectDetails = () => {
  const { id } = useParams(); // ID del progetto dalla rotta
  const [project, setProject] = useState<Project | null>(null);
  const [evaluation, setEvaluation] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [labelPoligon, setLabelPoligon] = useState<string>();
  const [labelsPoligon, setLabelsPoligon] = useState<string[]>();
  const [levelsPoligon, setLevelsPoligon] = useState<number[]>();

  const navigate = useNavigate();

  useEffect(() => {
    function compareEvaluations(evaluations: Evaluation[]) {
      for (let i = evaluations.length - 1; i > 0; i--) {
        const previousEvaluation = evaluations[i];
        const currentEvaluation = evaluations[i - 1];
        currentEvaluation.values.forEach((currentValue, index) => {
          const previousValue = previousEvaluation.values[index];
          if (currentValue.value < previousValue.value) {
            currentValue.improve = -1;
          } else if (currentValue.value === previousValue.value) {
            currentValue.improve = 0;
          } else {
            currentValue.improve = 1;
          }
        });
      }
    }

    const fetchProject = async () => {
      try {
        if (!id) {
          setError("Errore durante il caricamento del progetto");
          return;
        }
        const response = await ProjectApiService.getProjectDetail(id);
        compareEvaluations(response.evaluations);
        setProject(response);
        setLabelsPoligon(response.labelEvaluations.map((v) => v.shortLabel));
        setEvaluation(response.evaluations[0].ratingAverage);
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
    setEvaluation(evaluation.ratingAverage);
    setLabelPoligon(evaluation.label);
    setLevelsPoligon(evaluation.values.map((v) => v.value));
  };

  const handleBackClick = () => {
    navigate("/"); // Naviga verso la lista dei progetti
  };
  return (
    <div>
      <div className="container">
        <div className="left">
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
            <RatingIndicator value={evaluation} />
          </p>
        </div>
        <div className="right">
          <PolygonalLevelIndicator
            levels={levelsPoligon ?? []}
            labels={labelsPoligon}
            label={labelPoligon}
          />
        </div>
        <div>
          <FaArrowLeft
            onClick={handleBackClick}
            style={{ marginRight: "8px", color: "blue" }}
          />{" "}
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
                <td key={indice}>
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginLeft: "20px",
                      marginRight: "10px",
                    }}
                  >
                    <span>{l.values[labelIndice]?.value ?? "-"}</span>
                    <span>
                      {l.values[labelIndice]?.improve === 1 && (
                        <img
                          src="/increase.png"
                          alt="Arrow Up"
                          height="35px"
                          width="35px"
                          style={{ verticalAlign: "middle" }}
                        />
                      )}
                      {l.values[labelIndice]?.improve === 0 && (
                        <img
                          src="/equal.png"
                          alt="Horizontal Line"
                          height="35px"
                          width="35px"
                          style={{ verticalAlign: "middle" }}
                        />
                      )}
                      {l.values[labelIndice]?.improve === -1 && (
                        <img
                          src="/decrease.png"
                          alt="Arrow Down"
                          height="35px"
                          width="35px"
                          style={{ verticalAlign: "middle" }}
                        />
                      )}
                      {l.values[labelIndice]?.improve === undefined && "-"}
                    </span>
                  </p>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectDetails;
