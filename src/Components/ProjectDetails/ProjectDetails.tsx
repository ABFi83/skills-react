import { useNavigate, useParams } from "react-router-dom";
import PolygonalLevelIndicator from "../PoligonLevel/PoligonLevel";
import { Project, Label } from "../../Interfaces/Project";
import { useEffect, useState } from "react";
import { Evaluation } from "../../Interfaces/Evalutation";
import ProjectApiService from "../../Service/ProjectApiService";
import RatingIndicator from "../RatingIndicator/RatingIndicator";
import RoleDisplay from "../RoleDispayProps/RoleDisplayProps";
import { FaDoorOpen, FaInfoCircle, FaVirus } from "react-icons/fa"; // Importa icone
import PopupDetail from "../PopupDetail/PopupDetail"; // Importa il componente Popup
import "./ProjectDetail.css";
import { Tooltip } from "react-tooltip";
import { FaBook } from "react-icons/fa";
import ConfirmationPopup from "../ConfirmationPopup/ConfirmationPopup";
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

  const [missingValues, setMissingValues] = useState<{
    [key: string]: boolean;
  }>({});
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [evaluationToSave, setEvaluationToSave] = useState<Evaluation | null>(
    null
  );

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

        const firstClosedEvaluation = response.evaluations.find(
          (evaluation) => evaluation.close
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
    if (evaluation.close) {
      setEvaluation(evaluation.ratingAverage);
      setLabelPoligon(evaluation.label);
      setLevelsPoligon(evaluation.values.map((v) => v.value));
    }
  };
  const handleHeaderSaveClick = (evaluation: Evaluation) => {
    const missing: { [key: string]: boolean } = {};

    // Inizializza missing con tutti i campi a true
    project.labelEvaluations.forEach((value, index) => {
      missing[index] = true; // Impostiamo tutti i valori come mancanti
    });

    let allValuesPresent = true;

    // Verifica ogni valore in evaluation.values
    evaluation.values.forEach((value, index) => {
      if (
        value.value !== undefined &&
        value.value !== null &&
        !isNaN(value.value)
      ) {
        missing[index] = false;
      }
    });
    Object.values(missing).forEach((m) => {
      if (m) {
        allValuesPresent = false; // Se uno è ancora true, significa che un valore è mancante
      }
    });
    // Salva le informazioni sui valori mancanti
    setMissingValues(missing);

    // Se tutti i valori sono presenti, mostra il popup di conferma
    if (allValuesPresent) {
      setEvaluationToSave(evaluation);
      setIsConfirmPopupOpen(true);
    }
  };

  const confirmSave = async () => {
    if (evaluationToSave) {
      try {
        const response = await ProjectApiService.saveValuesEvalutation(
          evaluationToSave,
          id
        );
        if (response) {
          navigate(0);
        } else {
          console.error("Errore nel salvataggio dei valori");
        }
      } catch (error) {
        console.error("Errore nella chiamata API:", error);
      } finally {
        setIsConfirmPopupOpen(false);
      }
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
      updatedEvaluations[evalIndex].values[labelIndex] = {
        id: "0",
        skill: project.labelEvaluations[labelIndex].id,
        value: newValue,
      };

      return { ...prevProject, evaluations: updatedEvaluations };
    });

    setMissingValues((prev) => ({ ...prev, [labelIndex]: false }));
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
      <ConfirmationPopup
        isOpen={isConfirmPopupOpen}
        onConfirm={confirmSave}
        onCancel={() => setIsConfirmPopupOpen(false)}
        message="Vuoi salvare la valutazione?"
      />

      <table>
        <thead>
          <tr>
            <th>Skill</th>
            {project.evaluations.map((l) => (
              <th key={l.label} onClick={() => handleHeaderClick(l)}>
                {!l.close && (
                  <>
                    <FaVirus
                      data-tooltip-id="tooltip"
                      data-tooltip-content={`Evaluation opened by ${formatDate(
                        l.startDate
                      )} al ${formatDate(l.endDate)}`}
                      style={{
                        marginRight: "5px",
                        color: "blue",
                        cursor: "pointer",
                      }}
                    />
                    <Tooltip id="tooltip" place="top" />
                  </>
                )}

                {l.label}
                {!l.close && (
                  <>
                    <FaBook
                      size={15}
                      color="blue"
                      data-tooltip-id="tooltipSave"
                      data-tooltip-content="Save"
                      onClick={() => handleHeaderSaveClick(l)}
                      style={{ marginLeft: "10px", cursor: "pointer" }}
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
                <td
                  key={indice}
                  style={{ textAlign: "center", padding: "12px" }}
                >
                  {!l.close ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <input
                        type="number"
                        value={l.values[labelIndice]?.value ?? ""}
                        onChange={(e) =>
                          handleValueChange(e, indice, labelIndice)
                        }
                        style={{
                          width: "80%",
                          padding: "8px",
                          fontSize: "14px",
                          textAlign: "center",
                          borderRadius: "5px",
                          border: missingValues[labelIndice]
                            ? "2px solid red"
                            : "1px solid #ccc",
                          outline: "none",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {l.values[labelIndice]?.improve === 1 && (
                        <img
                          src="/increase.png"
                          alt="Arrow Up"
                          height="30px"
                          width="30px"
                        />
                      )}
                      {l.values[labelIndice]?.improve === 0 && (
                        <img
                          src="/equal.png"
                          alt="Horizontal Line"
                          height="30px"
                          width="30px"
                        />
                      )}
                      {l.values[labelIndice]?.improve === -1 && (
                        <img
                          src="/decrease.png"
                          alt="Arrow Down"
                          height="30px"
                          width="30px"
                        />
                      )}
                      <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                        {l.values[labelIndice]?.value ?? "-"}
                      </span>
                    </div>
                  )}
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
