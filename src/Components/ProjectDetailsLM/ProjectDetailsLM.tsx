import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaSave, FaTimes } from "react-icons/fa";
import ProjectApiService from "../../Service/ProjectApiService";
import { getClientLogoUrl } from "../../Service/ClientService";
import "./ProjectDetailsLM.css";
import { Project } from "../../Interfaces/Project";
import ClientSearch from "../ClientSearch/ClienteSearch";
import UserProfile from "../UserProfile/UserProfile";
import RoleDisplay from "../RoleDispayProps/RoleDisplayProps";

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
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("tab1"); // Stato per la tab attiva

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
          response = await ProjectApiService.updateProjectDetail(
            id,
            updatedProject
          );
        } else {
          response = await ProjectApiService.createProject(updatedProject);
        }
        if (file) {
          await ProjectApiService.uploadProjectFile(response.id, file);
        }
        setProject(response);
        setIsEditing(false);
        if (!id) navigate(`/project/${response.id}/LM`);
      }
    } catch (error) {
      console.error("Errore nel salvataggio:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  // Callback per gestire la selezione del cliente
  const handleClientSelect = (clientCode: string) => {
    setEditedProject({
      ...editedProject,
      clientCode: clientCode,
    });
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="project-details">
      <div className="top-right">
        {isEditing ? (
          <>
            <FaSave className="edit-icon" onClick={handleSaveClick} />
            <FaTimes
              className="read-only-icon"
              onClick={() => setIsEditing(false)}
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
              readOnly={!isEditing} // Aggiungi la condizione readOnly
              disabled={!isEditing} // Disabilita il campo quando non in modalità edit
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
              readOnly={!isEditing} // Aggiungi la condizione readOnly
              disabled={!isEditing} // Disabilita il campo quando non in modalità edit
            />
          </div>

          <div className="left-section">
            <ClientSearch
              value={editedProject.clientCode}
              name={editedProject.clientName}
              onChange={(value: any) =>
                setEditedProject({ ...editedProject, clientCode: value })
              }
              onClientSelect={handleClientSelect}
              readOnly={!isEditing} // Passa la condizione di readOnly anche al ClientSearch
            />
          </div>
        </div>

        <div className="right">
          <div className="image-container">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Anteprima immagine"
                className="image-preview"
              />
            ) : (
              project?.client && (
                <img
                  src={getClientLogoUrl(project.client.code)}
                  alt="Client Logo"
                  className="client-logo"
                />
              )
            )}
          </div>

          {isEditing && (
            <div className="upload-container">
              <label htmlFor="file-upload" className="upload-btn">
                Carica File
              </label>
              <input
                id="file-upload"
                type="file"
                className="file-input"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
      </div>

      {!isEditing && (
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

            {activeTab === "tab2" && (
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
                  <h3>Lista degli Utenti</h3>
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsLM;
