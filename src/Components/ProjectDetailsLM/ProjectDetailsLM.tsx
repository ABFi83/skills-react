import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEdit, FaSave } from "react-icons/fa";
import ProjectApiService from "../../Service/ProjectApiService";
import { getClientLogoUrl } from "../../Service/ClientService";
import "./ProjectDetailsLM.css";
import { Project } from "../../Interfaces/Project";

const ProjectDetailsLM = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState({
    projectName: "",
    description: "",
    clientCode: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!id) return;
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
  const handleSaveClick = () => {
    setProject({ ...project, ...editedProject } as Project);
    setIsEditing(false);
    // Qui puoi chiamare un'API per salvare le modifiche
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  if (!project) return <p>Caricamento...</p>;

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
          {isEditing ? (
            <input
              type="text"
              value={editedProject.projectName}
              onChange={(e) =>
                setEditedProject({
                  ...editedProject,
                  projectName: e.target.value,
                })
              }
            />
          ) : (
            <h3>{project.projectName}</h3>
          )}

          {isEditing ? (
            <textarea
              value={editedProject.description}
              onChange={(e) =>
                setEditedProject({
                  ...editedProject,
                  description: e.target.value,
                })
              }
            />
          ) : (
            <p>{project.description}</p>
          )}
        </div>

        <div className="image-container">
          {project.client && (
            <img
              src={getClientLogoUrl(project.client.code)}
              alt="Client Logo"
              className="client-logo"
            />
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
