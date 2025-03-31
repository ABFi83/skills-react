// Definisci l'interfaccia per un progetto
import { Project } from "../Interfaces/Project";
import api from "./APIService";
import { Evaluation } from "../Interfaces/Evalutation";

const ProjectApiService = {
  getProjectDetail: async (projectId: string): Promise<Project> => {
    try {
      const response = await api.get<Project>(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error("Errore nella chiamata API:", error);
      throw error;
    }
  },

  getUserProjects: async (): Promise<Project[]> => {
    try {
      const response = await api.get<Project[]>(`/projects`);
      return response.data;
    } catch (error) {
      console.error("Errore nella chiamata API:", error);
      throw error;
    }
  },

  saveValuesEvalutation: async (
    evaluation: Evaluation,
    projectId: string | undefined
  ): Promise<Evaluation> => {
    try {
      const response = await api.put<Evaluation>(
        `/projects/${projectId}/values`,
        {
          evaluationId: evaluation.id,
          values: evaluation.values,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Errore nella chiamata API:", error);
      throw error;
    }
  },

  updateProjectDetail: async (id: string, updatedProject: any) => {
    const response = await api.put(`/projects/${id}`, updatedProject);
    return response.data;
  },

  // Funzione per caricare un file
  uploadProjectFile: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/projects/${id}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  async createProject(projectData: {
    projectName: string;
    description: string;
    clientCode: string;
  }) {
    try {
      const response = await api.post("/projects", projectData);
      return response.data;
    } catch (error) {
      throw new Error("Errore nella creazione del progetto");
    }
  },
};

export default ProjectApiService;
