import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import ProjectApiService from "../../Service/ProjectApiService";
import { getClientLogoUrl, getClients } from "../../Service/ClientService";
import "./ProjectDetailsLM.css";
import {
  Label,
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
import { EvaluationLM, Evaluation } from "../../Interfaces/Evalutation";
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
        } catch (error) {
          console.error(
            "Errore nel caricamento delle date delle valutazioni:",
            error
          );
        }
      }
    };
    fetchEvaluationDates();
  }, [id]);

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
          console.log("Aggiornamento progetto:", updatedProject);
          response = await ProjectApiService.updateProjectDetail(
            id,
            updatedProject
          );
        } else {
          response = await ProjectApiService.createProject(updatedProject);
        }
        setProject(response);
        setIsEditing(false);
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

  const handleAddSkill = () => {
    setIsSkillSearchVisible(true); // Mostra il componente SkillSearch
  };

  const handleSkillSelect = (selectedSkill: any) => {
    const newSkill = {
      id: selectedSkill.id,
      label: selectedSkill.name,
      shortLabel: selectedSkill.shortLabel,
    };
    setEditedProject({
      ...editedProject,
      skills: [...editedProject.skills, newSkill],
    });
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
    console.log("Skill eliminata:", updatedSkills);
  };

  const handleUserSelect = (user: any) => {
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
    setEditedProject({
      ...editedProject,
      users: [...editedProject.users, newUser],
    });
    // Resetta gli stati temporanei
    setSelectedUser(null);
    setSelectedRole(null);
    setIsUserSearchVisible(false); // Nascondi il dropdown
  };

  const handleDeleteUser = (index: number) => {
    const updatedUsers = editedProject.users.filter(
      (_, userIndex) => userIndex !== index
    );
    setEditedProject({
      ...editedProject,
      users: updatedUsers,
    });
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
  };

  const handleCreateEvaluation = async () => {
    try {
      const response = await ProjectApiService.createEvaluation(
        id!,
        newEvaluation
      );
      console.log("Valutazione creata:", response);

      setEvaluationDates((prevDates) => [
        ...prevDates,
        newEvaluation.evaluationDate,
      ]);

      // Chiudi il popup e resetta i campi
      setIsCreateEvaluationPopupVisible(false);
      setNewEvaluation({ evaluationDate: "", startDate: "", endDate: "" });
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
                Crea Valutazione
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
                    Seleziona Valutazione:
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

              <div className="users-section">
                <div className="table-header">
                  <h3>Users</h3>
                </div>
                <div
                  className={`users-container ${
                    isUserSearchVisible ? "dropdown-visible" : ""
                  }`}
                >
                  {/* Lista degli utenti */}
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
                <button className="add-button" onClick={() => handleAddSkill()}>
                  +
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
                </div>
              )}
            </div>
          </div>

          <div className="users-section">
            <div className="table-header">
              <h3>Users</h3>
              {id && (
                <button
                  className="add-button"
                  onClick={() => {
                    setIsUserSearchVisible(true);
                  }}
                >
                  +
                </button>
              )}
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
            <p>Sei sicuro di voler eliminare questo progetto?</p>
            <button className="confirm-button" onClick={handleDeleteProject}>
              Sì, elimina
            </button>
            <button
              className="cancel-button"
              onClick={() => setIsDeletePopupVisible(false)}
            >
              Annulla
            </button>
          </div>
        </div>
      )}

      {isCreateEvaluationPopupVisible && id && (
        <div className="create-evaluation-popup">
          <div className="popup-content">
            <h3>Crea Valutazione</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateEvaluation();
              }}
            >
              <div className="form-group">
                <label htmlFor="evaluationDate">Data Valutazione</label>
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
                <label htmlFor="startDate">Data Inizio</label>
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
                <label htmlFor="endDate">Data Fine</label>
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
              <div className="popup-actions">
                <button type="submit" className="confirm-button">
                  Crea
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setIsCreateEvaluationPopupVisible(false)}
                >
                  Annulla
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
