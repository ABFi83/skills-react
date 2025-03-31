import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEdit, FaSave } from "react-icons/fa";
import ProjectApiService from "../../Service/ProjectApiService";
import { getClientLogoUrl } from "../../Service/ClientService";
import "./ProjectDetailsLM.css";
import { Project } from "../../Interfaces/Project";
import ClientSearch from "../ClientSearch/ClienteSearch";

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
        if (!id) navigate(`/projects/${response.id}`);
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

  return (
    <div className="project-details">
      <div className="top-right">
        {isEditing ? (
          <FaSave className="edit-icon" onClick={handleSaveClick} />
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
    </div>
  );
};

export default ProjectDetailsLM;
