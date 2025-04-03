import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEdit, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import ProjectApiService from "../../Service/ProjectApiService";
import { getClients } from "../../Service/ClientService";
import "./ProjectDetailsLM.css";
import {
  Project,
  RoleResponse,
  ProjectRequest,
} from "../../Interfaces/Project";
import UserProfile from "../UserProfile/UserProfile";
import RoleDisplay from "../RoleDispayProps/RoleDisplayProps";
import SearchDropdown from "../SearchDropdown/SearchDropdown";
import { getSkills } from "../../Service/SkillService";
import { UserResponse } from "../../Interfaces/User";
import UserApiService from "../../Service/UserApiService";
import { getRoles } from "../../Service/RoleApiService";
import {
  getEvaluationsByDate,
  getEvaluationDates,
} from "../../Service/EvaluationService"; // Import the updated service
import { EvaluationLM } from "../../Interfaces/Evalutation";
import ClientLogo from "../ClientLogo/ClientLogo";

const ProjectDetailsLM = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false); // Impostato su false per la modalità read-only di default
  const [editedProject, setEditedProject] = useState<ProjectRequest>({
    projectName: "",
    description: "",
    clientCode: "",
    clientName: "",
    users: [],
    skills: [],
  });
  const [activeTab, setActiveTab] = useState("tab1"); // Stato per la tab attiva
  const [isSkillSearchVisible, setIsSkillSearchVisible] = useState(false); // Stato per la visibilità di SkillSearch
  const [isUserSearchVisible, setIsUserSearchVisible] = useState(false); // Stato per la visibilità del SearchDropdown per gli utenti
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null); // Stato per l'utente selezionato
  const [selectedRole, setSelectedRole] = useState<RoleResponse | null>(null); // Stato per il ruolo selezionato
  const [clientLogoCode, setClientLogoCode] = useState<string | null>(null);
  const [selectedEvaluationDate, setSelectedEvaluationDate] = useState<
    string | null
  >(null); // Selected evaluation date
  const [evaluationsLM, setEvaluationsLM] = useState<EvaluationLM[] | null>(
    null
  ); // Evaluations for the table
  const [evaluationDates, setEvaluationDates] = useState<string[]>([]); // State for evaluation dates
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
  const [isCreateEvaluationPopupVisible, setIsCreateEvaluationPopupVisible] =
    useState(false);
  const [newEvaluation, setNewEvaluation] = useState({
    evaluationDate: "",
    startDate: "",
    endDate: "",
  });
  const [skillError, setSkillError] = useState<string | null>(null); // Stato per il messaggio di errore
  const [userError, setUserError] = useState<string | null>(null); // Stato per il messaggio di errore utente
  const [evaluationError, setEvaluationError] = useState<string | null>(null); // Stato per il messaggio di errore della valutazione

  // Caricamento del progetto quando l'ID è presente
  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setIsEditing(true);
        return;
      }
      try {
        const response = await ProjectApiService.getProjectDetail(id!);
        setProject(response);
        setEditedProject({
          projectName: response.projectName,
          description: response.description,
          clientCode: response.client?.code || "",
          clientName: response.client?.name || "",
          users: response.users || [],
          skills: response.labelEvaluations || [],
        } as ProjectRequest);
        setClientLogoCode(response.client?.code || null); // Inizializza il codice del logo
        setIsEditing(false);
      } catch (error) {
        console.error("Errore nel caricamento del progetto:", error);
      }
    };

    fetchProject();
  }, [id]);

  // Fetch evaluation dates when the project is loaded
  useEffect(() => {
    const fetchEvaluationDates = async () => {
      if (id) {
        try {
          const dates = await getEvaluationDates(id!);
          setEvaluationDates(dates);

          // Imposta automaticamente la prima data disponibile
          if (dates.length > 0 && !selectedEvaluationDate) {
            setSelectedEvaluationDate(dates[0]);
          }
        } catch (error) {
          console.error(
            "Errore nel caricamento delle date delle valutazioni:",
            error
          );
        }
      }
    };
    fetchEvaluationDates();
  }, [id, selectedEvaluationDate]);

  // Fetch evaluations when a date is selected
  useEffect(() => {
    const fetchEvaluations = async () => {
      if (selectedEvaluationDate) {
        try {
          if (id && selectedEvaluationDate) {
            const response = await getEvaluationsByDate(
              id!,
              selectedEvaluationDate
            );

            // Aggiorna le skill e le valutazioni
            const { evaluation, skill } = response;
            setEvaluationsLM(evaluation);
            setEditedProject((prev) => ({
              ...prev,
              skills: skill.map((s) => ({
                id: s.id,
                label: s.label,
                shortLabel: s.shortLabel,
              })),
            }));
          }
        } catch (error) {
          console.error("Errore nel caricamento delle valutazioni:", error);
        }
      }
    };
    fetchEvaluations();
  }, [id, selectedEvaluationDate]);

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async () => {
    try {
      if (project || !id) {
        const updatedProject = { ...editedProject };
        let response;
        if (id) {
          response = await ProjectApiService.updateProjectDetail(
            id,
            updatedProject
          );
        } else {
          response = await ProjectApiService.createProject(updatedProject);
        }
        setProject(response);
        setIsEditing(false);
        setSkillError(null);
        setUserError(null);
        if (!id) navigate(`/project/${response.id}/LM`);
      }
    } catch (error) {
      console.error("Errore nel salvataggio:", error);
    }
  };

  const handleDeleteProject = async () => {
    if (id) {
      try {
        await ProjectApiService.deleteProject(id); // Chiama l'API di eliminazione
        navigate("/main"); // Reindirizza alla lista dei progetti
      } catch (error) {
        console.error("Errore durante l'eliminazione del progetto:", error);
      }
    }
  };

  // Callback per gestire la selezione del cliente
  const handleClientSelect = (clientCode: string) => {
    setEditedProject({
      ...editedProject,
      clientCode: clientCode,
    });
    setClientLogoCode(clientCode); // Aggiorna il codice del logo
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSkillSelect = (selectedSkill: any) => {
    const newSkill = {
      id: selectedSkill.id,
      label: selectedSkill.name,
      shortLabel: selectedSkill.shortLabel,
    };

    // Controlla se la skill è già presente
    const isDuplicate = editedProject.skills.some(
      (skill) => skill.id === newSkill.id
    );

    if (isDuplicate) {
      setSkillError("Elemento già presente"); // Imposta il messaggio di errore
      return; // Non aggiungere la skill se è un duplicato
    }

    // Aggiungi la skill se non è un duplicato
    setEditedProject({
      ...editedProject,
      skills: [...editedProject.skills, newSkill],
    });

    setSkillError(null); // Resetta il messaggio di errore
    setIsSkillSearchVisible(false); // Nascondi il componente SkillSearch dopo la selezione
  };

  const handleDeleteSkill = (index: number) => {
    const updatedSkills = editedProject.skills.filter(
      (_, skillIndex) => skillIndex !== index
    );
    setEditedProject({
      ...editedProject,
      skills: updatedSkills,
    });
  };

  const handleUserSelect = (user: any) => {
    setUserError(null); // Resetta il messaggio di errore
    setSelectedUser(user); // Memorizza l'utente selezionato
    if (selectedRole) {
      // Aggiungi l'utente solo se il ruolo è già stato selezionato
      addUserToProject(user, selectedRole);
    }
  };

  const handleRoleSelect = (role: any) => {
    setSelectedRole(role); // Memorizza il ruolo selezionato
    if (selectedUser) {
      // Aggiungi l'utente solo se l'utente è già stato selezionato
      addUserToProject(selectedUser, role);
    }
  };

  const addUserToProject = (user: any, role: RoleResponse) => {
    const newUser: UserResponse = {
      id: user.id,
      isAdmin: false,
      username: user.username,
      code: user.code,
      role: role,
    };

    // Controlla se l'utente è già presente
    const isDuplicate = editedProject.users.some(
      (existingUser) => existingUser.id === newUser.id
    );

    if (isDuplicate) {
      setUserError("Utente già presente"); // Imposta il messaggio di errore
      return; // Non aggiungere l'utente se è un duplicato
    }

    // Aggiungi l'utente se non è un duplicato
    setEditedProject({
      ...editedProject,
      users: [...editedProject.users, newUser],
    });

    setUserError(null); // Resetta il messaggio di errore
    setSelectedUser(null);
    setSelectedRole(null);
    setIsUserSearchVisible(false); // Nascondi il dropdown
  };

  const handleDeleteUser = (index: number) => {
    const updatedUsers = editedProject.users.filter(
      (_, userIndex) => userIndex !== index
    );

    // Verifica che almeno un utente con ruolo "LM" rimanga
    const hasLMUser = updatedUsers.some((user) => user.role?.code === "LM");

    if (!hasLMUser) {
      setUserError("Deve essere presente almeno un utente con ruolo LM"); // Imposta il messaggio di errore
      return; // Non eliminare l'utente
    }

    setEditedProject({
      ...editedProject,
      users: updatedUsers,
    });

    setUserError(null); // Resetta il messaggio di errore
  };

  const fetchUsers = async (query: string): Promise<any[]> => {
    try {
      const users = await UserApiService.getUsers(query);
      console.log("Utenti trovati:", users);
      return users;
    } catch (error) {
      console.error("Errore durante il recupero degli utenti:", error);
      return [];
    }
  };

  const close = () => {
    setIsEditing(false);
    setIsUserSearchVisible(false);
    setIsSkillSearchVisible(false);
    setSkillError(null);
    setUserError(null);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Aggiunge uno zero iniziale se necessario
    const month = String(date.getMonth() + 1).padStart(2, "0"); // I mesi partono da 0, quindi aggiungi 1
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleCreateEvaluation = async () => {
    const { evaluationDate, startDate, endDate } = newEvaluation;

    // Controllo che tutte le date siano obbligatorie
    if (!evaluationDate || !startDate || !endDate) {
      setEvaluationError("Tutte le date sono obbligatorie.");
      return; // Interrompi l'esecuzione se c'è un errore
    }

    const formattedDate = formatDate(evaluationDate);
    // Controllo che la evaluationDate non sia già presente
    if (evaluationDates.includes(formattedDate)) {
      setEvaluationError("La data di valutazione è già presente.");
      return; // Interrompi l'esecuzione se c'è un errore
    }

    // Controllo che la endDate sia successiva alla startDate
    if (new Date(endDate) <= new Date(startDate)) {
      setEvaluationError(
        "La data di fine deve essere successiva alla data di inizio."
      );
      return; // Interrompi l'esecuzione se c'è un errore
    }

    try {
      await ProjectApiService.createEvaluation(id!, newEvaluation);
      setEvaluationDates((prevDates) => [...prevDates, formattedDate]);
      setIsCreateEvaluationPopupVisible(false);
      setNewEvaluation({ evaluationDate: "", startDate: "", endDate: "" });
      setEvaluationError(null); // Resetta il messaggio di errore
    } catch (error) {
      console.error("Errore durante la creazione della valutazione:", error);
    }
  };

  return (
    <div className="project-details-lm">
      <div className="top-right">
        {isEditing ? (
          <>
            <FaSave className="edit-icon" onClick={handleSaveClick} />
            <FaTimes
              className="read-only-icon"
              onClick={() => close()}
              title="Imposta modalità sola lettura"
            />
          </>
        ) : (
          <>
            <FaEdit className="edit-icon" onClick={handleEditClick} />
            <FaTrash
              className="delete-icon"
              onClick={() => setIsDeletePopupVisible(true)}
              title="Elimina progetto"
            />
          </>
        )}
      </div>

      <div className="container">
        <div className="left">
          <div className="left-section">
            <input
              type="text"
              value={editedProject.projectName}
              onChange={(e) =>
                setEditedProject({
                  ...editedProject,
                  projectName: e.target.value,
                })
              }
              placeholder="Nome del progetto"
              readOnly={!isEditing}
              disabled={!isEditing}
            />
          </div>

          <div className="left-section">
            <textarea
              value={editedProject.description}
              onChange={(e) =>
                setEditedProject({
                  ...editedProject,
                  description: e.target.value,
                })
              }
              placeholder="Descrizione del progetto"
              readOnly={!isEditing}
              disabled={!isEditing}
            />
          </div>

          <div className="left-section client-search-container">
            <SearchDropdown
              readOnly={!isEditing}
              placeholder="Cerca cliente"
              fetchItems={getClients}
              onItemSelect={(client) => handleClientSelect(client.code)}
              initialValue={editedProject.clientName}
            />
            {clientLogoCode && (
              <ClientLogo
                className="client-logo-small-lm"
                clientCode={clientLogoCode}
              />
            )}
            {id && (
              <button
                className="create-evaluation-button"
                onClick={() => setIsCreateEvaluationPopupVisible(true)}
              >
                Create Evaluation
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "tab1" ? "active" : ""}`}
            onClick={() => handleTabClick("tab1")}
          >
            Evaluations
          </button>
          <button
            className={`tab-button ${activeTab === "tab2" ? "active" : ""}`}
            onClick={() => handleTabClick("tab2")}
          >
            Skills & Users
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "tab1" && (
            <div className="tab1-content">
              <div className="table-container">
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Skill</th>
                        {Array.from({ length: 10 }, (_, index) => (
                          <th key={index + 1}>{index + 1}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {editedProject.skills.map((skill, skillIndex) => (
                        <tr key={skill.id}>
                          <td>{skill.label}</td>
                          {Array.from({ length: 10 }, (_, colIndex) => {
                            const evaluationsForCell = evaluationsLM?.filter(
                              (evaluation) =>
                                evaluation.skillId == skill.id &&
                                evaluation.score == colIndex + 1
                            );
                            return (
                              <td key={colIndex}>
                                <div className="user-profile-container">
                                  {evaluationsForCell?.map(
                                    (evaluation, evalIndex) => (
                                      <UserProfile
                                        key={evalIndex}
                                        username={evaluation.user.username}
                                        clientId={evaluation.user.code}
                                        viewName={false}
                                      />
                                    )
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="evaluation-dropdown-container">
                  <label htmlFor="evaluation-select" className="dropdown-label">
                    Select Rating:
                  </label>
                  <select
                    id="evaluation-select"
                    className="evaluation-dropdown"
                    onChange={(e) => setSelectedEvaluationDate(e.target.value)}
                    value={selectedEvaluationDate || ""}
                  >
                    <option value="" disabled>
                      Seleziona una data
                    </option>
                    {evaluationDates.map((date) => (
                      <option key={date} value={date}>
                        {date}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tab2" && !isEditing && (
            <div className="tab2-content">
              <div className="sections-container">
                {/* Skills Section */}
                <div className="skills-section">
                  <h3>Skills</h3>
                  <div className="list">
                    {editedProject.skills.map((label, index) => (
                      <div key={index} className="list-item">
                        {label.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Users Section */}
                <div className="users-section">
                  <h3>Users</h3>
                  <div className="list">
                    {editedProject.users.map((user, index) => (
                      <div key={index} className="list-item">
                        <UserProfile
                          username={user.username}
                          clientId={user.code}
                        />
                        {user.role && <RoleDisplay roleCode={user.role} />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {activeTab === "tab2" && isEditing && (
        <div className="tab2-content">
          <div className="skills-section">
            <div className="table-header">
              <h3>Skills</h3>
              {id && (
                <button
                  className={`add-button ${
                    isSkillSearchVisible ? "active" : ""
                  }`}
                  onClick={() => {
                    setSkillError(null);
                    setIsSkillSearchVisible(!isSkillSearchVisible);
                  }}
                >
                  {isSkillSearchVisible ? "-" : "+"}
                </button>
              )}
            </div>
            <div
              className={`skills-container ${
                isSkillSearchVisible ? "dropdown-visible" : ""
              }`}
            >
              <div className="list">
                {editedProject.skills.map((label, index) => (
                  <div key={index} className="list-item">
                    {label.label}
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteSkill(index)}
                    >
                      -
                    </button>
                  </div>
                ))}
              </div>

              {isSkillSearchVisible && (
                <div className="skill-search-dropdown">
                  <SearchDropdown
                    placeholder="Cerca skill"
                    fetchItems={getSkills}
                    onItemSelect={handleSkillSelect}
                    initialValue=""
                  />
                  {skillError && <p className="error-message">{skillError}</p>}
                </div>
              )}
            </div>
          </div>

          <div className="users-section">
            <div className="table-header">
              <h3>Users</h3>
              {id && (
                <button
                  className={`add-button ${
                    isUserSearchVisible ? "active" : ""
                  }`}
                  onClick={() => {
                    setUserError(null);
                    setIsUserSearchVisible(!isUserSearchVisible);
                  }}
                >
                  {isUserSearchVisible ? "-" : "+"}
                </button>
              )}
            </div>
            <div>
              {userError && <p className="error-message">{userError}</p>}
            </div>
            <div
              className={`users-container ${
                isUserSearchVisible ? "dropdown-visible" : ""
              }`}
            >
              <div className="list">
                {editedProject.users.map((user, index) => (
                  <div key={index} className="list-item">
                    <UserProfile
                      username={user.username}
                      clientId={user.code}
                    />
                    {user.role && <RoleDisplay roleCode={user.role} />}
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteUser(index)}
                    >
                      -
                    </button>
                  </div>
                ))}
              </div>

              {isUserSearchVisible && (
                <div className="dropdowns-container">
                  <div className="user-search-dropdown">
                    <SearchDropdown
                      placeholder="Cerca utente"
                      fetchItems={fetchUsers}
                      onItemSelect={handleUserSelect}
                      initialValue=""
                    />
                  </div>
                  <div className="role-search-dropdown">
                    <SearchDropdown
                      placeholder="Cerca ruolo"
                      fetchItems={getRoles}
                      onItemSelect={handleRoleSelect}
                      initialValue=""
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isDeletePopupVisible && (
        <div className="delete-popup">
          <div className="popup-content">
            <p>"Are you sure you want to delete this project?"</p>
            <button className="confirm-button" onClick={handleDeleteProject}>
              Yes, delete
            </button>
            <button
              className="cancel-button"
              onClick={() => setIsDeletePopupVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isCreateEvaluationPopupVisible && id && (
        <div className="create-evaluation-popup">
          <div className="popup-content">
            <h3>Create Evaluation</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateEvaluation();
              }}
            >
              <div className="form-group">
                <label htmlFor="evaluationDate">Evaluation Date</label>
                <input
                  type="date"
                  id="evaluationDate"
                  value={newEvaluation.evaluationDate}
                  onChange={(e) =>
                    setNewEvaluation({
                      ...newEvaluation,
                      evaluationDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={newEvaluation.startDate}
                  onChange={(e) =>
                    setNewEvaluation({
                      ...newEvaluation,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={newEvaluation.endDate}
                  onChange={(e) =>
                    setNewEvaluation({
                      ...newEvaluation,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
              {evaluationError && (
                <p className="error-message">{evaluationError}</p>
              )}
              <div className="popup-actions">
                <button type="submit" className="confirm-button">
                  Create
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setIsCreateEvaluationPopupVisible(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsLM;
