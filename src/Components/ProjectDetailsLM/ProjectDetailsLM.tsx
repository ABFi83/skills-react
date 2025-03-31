import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEdit, FaSave } from "react-icons/fa";
import ProjectApiService from "../../Service/ProjectApiService";
import { getClientLogoUrl } from "../../Service/ClientService";
import "./ProjectDetailsLM.css";
import { Project } from "../../Interfaces/Project";

const ProjectDetailsLM = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Usato per la navigazione in caso di creazione del progetto
  const [project, setProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(true); // Impostato su true per essere sempre in modalità edit
  const [editedProject, setEditedProject] = useState({
    projectName: "",
    description: "",
    clientCode: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Effetto per caricare il progetto esistente se id è presente
  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return; // Non fare nulla se non c'è un id (per la creazione)
      try {
        const response = await ProjectApiService.getProjectDetail(id);
        setProject(response);
        setEditedProject({
          projectName: response.projectName,
          description: response.description,
          clientCode: response.client?.code || "",
        });
      } catch (error) {
        console.error("Errore nel caricamento:", error);
      }
    };

    fetchProject();
  }, [id]);

  const handleEditClick = () => setIsEditing(true);

  // Funzione per creare un nuovo progetto
  const handleSaveClick = async () => {
    try {
      if (project || !id) {
        const updatedProject = { ...editedProject };

        let response;

        if (id) {
          // Se c'è un id, aggiornare il progetto
          response = await ProjectApiService.updateProjectDetail(
            id,
            updatedProject
          );
        } else {
          // Se non c'è un id, creare un nuovo progetto
          response = await ProjectApiService.createProject(updatedProject);
        }

        if (file) {
          // Se c'è un file, caricarlo
          await ProjectApiService.uploadProjectFile(response.id, file);
        }

        setProject(response);
        setIsEditing(false);

        // Navigare verso la pagina del progetto (o dashboard) dopo la creazione
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

      // Crea un URL temporaneo per l'anteprima dell'immagine
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
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
          />

          <textarea
            value={editedProject.description}
            onChange={(e) =>
              setEditedProject({
                ...editedProject,
                description: e.target.value,
              })
            }
            placeholder="Descrizione del progetto"
          />
        </div>

        <div className="image-container">
          {/* Mostra l'anteprima dell'immagine se è stata caricata */}
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
