import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaSave, FaTimes } from "react-icons/fa";
import ProjectApiService from "../../Service/ProjectApiService";
import { getClientLogoUrl, getClients } from "../../Service/ClientService";
import "./ProjectDetailsLM.css";
import { Project, RoleResponse } from "../../Interfaces/Project";
import UserProfile from "../UserProfile/UserProfile";
import RoleDisplay from "../RoleDispayProps/RoleDisplayProps";
import SearchDropdown from "../SearchDropdown/SearchDropdown";
import { getSkills } from "../../Service/SkillService";
import { UserResponse } from "../../Interfaces/User";
import UserApiService from "../../Service/UserApiService";
import { getRoles } from "../../Service/RoleApiService";

const ProjectDetailsLM = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false); // Impostato su false per la modalità read-only di default
  const [editedProject, setEditedProject] = useState({
    projectName: "",
    description: "",
    clientCode: "",
    clientName: "",
  });
  const [activeTab, setActiveTab] = useState("tab1"); // Stato per la tab attiva
  const [isSkillSearchVisible, setIsSkillSearchVisible] = useState(false); // Stato per la visibilità di SkillSearch
  const [isUserSearchVisible, setIsUserSearchVisible] = useState(false); // Stato per la visibilità del SearchDropdown per gli utenti
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null); // Stato per l'utente selezionato
  const [selectedRole, setSelectedRole] = useState<RoleResponse | null>(null); // Stato per il ruolo selezionato
  const [clientLogoCode, setClientLogoCode] = useState<string | null>(null);

  // Caricamento del progetto quando l'ID è presente
  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setIsEditing(true);
        return;
      }
      try {
        const response = await ProjectApiService.getProjectDetail(id);
        setProject(response);
        setEditedProject({
          projectName: response.projectName,
          description: response.description,
          clientCode: response.client?.code || "",
          clientName: response.client?.name || "",
        });
        setClientLogoCode(response.client?.code || null); // Inizializza il codice del logo
        setIsEditing(false);
      } catch (error) {
        console.error("Errore nel caricamento del progetto:", error);
      }
    };

    fetchProject();
  }, [id]);

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
    if (project) {
      console.log("Skill selezionata:", selectedSkill);
      const newSkill = {
        id: selectedSkill.id,
        label: selectedSkill.name,
        shortLabel: selectedSkill.shortLabel,
      };
      setProject({
        ...project,
        labelEvaluations: [...project.labelEvaluations, newSkill],
      });
    }
    setIsSkillSearchVisible(false); // Nascondi il componente SkillSearch dopo la selezione
  };

  const handleDeleteSkill = (index: number) => {
    if (project) {
      const updatedSkills = project.labelEvaluations.filter(
        (_, skillIndex) => skillIndex !== index
      );
      setProject({ ...project, labelEvaluations: updatedSkills });
    }
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
    if (project) {
      console.log("Aggiunta utente:", user, "con ruolo:", role);
      const newUser: UserResponse = {
        id: user.id,
        isAdmin: false,
        username: user.username,
        code: user.code,
        role: role,
      };
      setProject({
        ...project,
        users: [...project.users, newUser],
      });
      // Resetta gli stati temporanei
      setSelectedUser(null);
      setSelectedRole(null);
      setIsUserSearchVisible(false); // Nascondi il dropdown
    }
  };

  const handleDeleteUser = (index: number) => {
    if (project) {
      const updatedUsers = project.users.filter(
        (_, userIndex) => userIndex !== index
      );
      setProject({ ...project, users: updatedUsers });
    }
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

  return (
    <div className="project-details">
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
          <FaEdit className="edit-icon" onClick={handleEditClick} />
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
              <img
                src={getClientLogoUrl(clientLogoCode)}
                alt="Client Logo"
                className="client-logo-small"
              />
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
            Andamento
          </button>
          <button
            className={`tab-button ${activeTab === "tab2" ? "active" : ""}`}
            onClick={() => handleTabClick("tab2")}
          >
            Skill e Utenti
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "tab1" && (
            <div className="tab1-content">
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
                  {/* Genera una riga per ogni skill */}
                  {project?.labelEvaluations.map((label, index) => (
                    <tr key={index}>
                      <td>{label.label}</td>
                      {/* Genera 10 celle vuote per ogni skill */}
                      {Array.from({ length: 10 }, (_, colIndex) => (
                        <td key={colIndex}></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "tab2" && !isEditing && (
            <div className="tab2-content">
              <div className="skills-section">
                <h3>Lista delle Skill</h3>
                <div className="list">
                  {project?.labelEvaluations.map((label, index) => (
                    <div key={index} className="list-item">
                      {label.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="users-section">
                <div className="table-header">
                  <h3>Lista degli Utenti</h3>
                </div>
                <div
                  className={`users-container ${
                    isUserSearchVisible ? "dropdown-visible" : ""
                  }`}
                >
                  {/* Lista degli utenti */}
                  <div className="list">
                    {project?.users.map((user, index) => (
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
              <h3>Lista delle Skill</h3>
              <button className="add-button" onClick={() => handleAddSkill()}>
                +
              </button>
            </div>
            <div
              className={`skills-container ${
                isSkillSearchVisible ? "dropdown-visible" : ""
              }`}
            >
              <div className="list">
                {project?.labelEvaluations.map((label, index) => (
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

              {/* Mostra il componente SearchDropdown accanto alla lista */}
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
              <h3>Lista degli Utenti</h3>
              <button
                className="add-button"
                onClick={() => {
                  setIsUserSearchVisible(true);
                }}
              >
                +
              </button>
            </div>
            <div
              className={`users-container ${
                isUserSearchVisible ? "dropdown-visible" : ""
              }`}
            >
              {/* Lista degli utenti */}
              <div className="list">
                {project?.users.map((user, index) => (
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

              {/* Dropdowns per utenti e ruoli */}
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
    </div>
  );
};

export default ProjectDetailsLM;
