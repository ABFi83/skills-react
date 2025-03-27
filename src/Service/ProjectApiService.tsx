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
};

export default ProjectApiService;
