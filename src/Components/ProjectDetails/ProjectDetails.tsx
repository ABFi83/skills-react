import { useNavigate, useParams } from "react-router-dom";
import PolygonalLevelIndicator from "../PoligonLevel/PoligonLevel";
import { Project } from "../../Interfaces/Project";
import { useEffect, useState } from "react";
import { Evaluation } from "../../Interfaces/Evalutation";
import ProjectApiService from "../../Service/ProjectApiService";
import RatingIndicator from "../RatingIndicator/RatingIndicator";
import RoleDisplay from "../RoleDispayProps/RoleDisplayProps";
import { FaDoorOpen, FaInfoCircle } from "react-icons/fa"; // Importa icone
import PopupDetail from "../PopupDetail/PopupDetail"; // Importa il componente Popup
import "./ProjectDetail.css";
import { Tooltip } from "react-tooltip";
import { FaBook } from "react-icons/fa";
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
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Stato per il popup

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
        const today = new Date(); // Data odierna

        // Trova la prima valutazione con endDate minore della data odierna
        const firstClosedEvaluation = response.evaluations.find(
          (evaluation) =>
            evaluation.endDate && new Date(evaluation.endDate) < today
        );
        if (firstClosedEvaluation) {
          setEvaluation(firstClosedEvaluation.ratingAverage);
          setLabelPoligon(firstClosedEvaluation.label);
          setLevelsPoligon(firstClosedEvaluation.values.map((v) => v.value));
        }
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
    if (evaluation.endDate && new Date(evaluation.endDate) < new Date()) {
      setEvaluation(evaluation.ratingAverage);
      setLabelPoligon(evaluation.label);
      setLevelsPoligon(evaluation.values.map((v) => v.value));
    }
  };

  const handleHeaderSaveClick = async (evaluation: Evaluation) => {
    try {
      const response = await ProjectApiService.saveValuesEvalutation(
        evaluation,
        id
      );
      console.log(response);
      if (response) {
        navigate(0);
      } else {
        console.error("Errore nel salvataggio dei valori");
      }
    } catch (error) {
      console.error("Errore nella chiamata API:", error);
    }
  };

  const handleValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    evalIndex: number,
    labelIndex: number
  ) => {
    const newValue = parseInt(e.target.value, 10);
    if (isNaN(newValue)) return;

    setProject((prevProject) => {
      if (!prevProject) return null;

      const updatedEvaluations = [...prevProject.evaluations];

      if (!updatedEvaluations[evalIndex].values) {
        updatedEvaluations[evalIndex].values = [];
      }

      // Assicuriamoci che esista l'elemento values[labelIndex]
      if (!updatedEvaluations[evalIndex].values[labelIndex]) {
        updatedEvaluations[evalIndex].values[labelIndex] = {
          id: "0", // Puoi cambiare se necessario
          skill: project.labelEvaluations[labelIndex].id, // Imposta l'id della skill corrispondente
          value: newValue,
        };
      } else {
        updatedEvaluations[evalIndex].values[labelIndex].value = newValue;
        updatedEvaluations[evalIndex].values[labelIndex].skill =
          project.labelEvaluations[labelIndex].id; // Aggiorna la skill se già esistente
      }
      return { ...prevProject, evaluations: updatedEvaluations };
    });
  };

  const formatDate = (dateString: Date | undefined) => {
    if (!dateString) return "Data non disponibile";
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div>
      <div className="container">
        <div className="left">
          <h3>
            {project.projectName}
            <FaInfoCircle
              onClick={togglePopup}
              style={{
                marginLeft: "10px",
                cursor: "pointer",
                color: "blue",
              }}
            />
          </h3>
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
      </div>

      <PopupDetail
        isOpen={isPopupOpen}
        onClose={togglePopup}
        project={project}
      />

      <table>
        <thead>
          <tr>
            <th>Skill</th>
            {project.evaluations.map((l) => (
              <th key={l.label} onClick={() => handleHeaderClick(l)}>
                {l.label}
                {l.endDate && new Date(l.endDate) > new Date() && (
                  <>
                    <FaDoorOpen
                      data-tooltip-id="tooltip"
                      data-tooltip-content={`Valutazione aperta dal ${formatDate(
                        l.startDate
                      )} al ${formatDate(l.endDate)}`}
                      style={{
                        marginLeft: "5px",
                        color: "blue",
                        width: "25px",
                        height: "25px",
                        cursor: "pointer",
                      }}
                    />

                    <Tooltip id="tooltip" place="top" />
                    <FaBook
                      size={20}
                      color="blue"
                      data-tooltip-id="tooltipSave"
                      data-tooltip-content={"Salva"}
                      onClick={() => handleHeaderSaveClick(l)}
                    />
                    <Tooltip id="tooltipSave" place="top" />
                  </>
                )}
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
                    {l.endDate && new Date(l.endDate) > new Date() ? (
                      <input
                        type="number"
                        value={l.values[labelIndice]?.value ?? ""}
                        onChange={(e) =>
                          handleValueChange(e, indice, labelIndice)
                        }
                        style={{
                          width: "50px",
                          padding: "5px",
                          fontSize: "14px",
                          textAlign: "center",
                        }}
                      />
                    ) : (
                      <span>{l.values[labelIndice]?.value ?? "-"}</span>
                    )}
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
