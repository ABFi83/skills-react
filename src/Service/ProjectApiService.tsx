// Definisci l'interfaccia per un progetto
import { Project } from "../Interfaces/Project";
import api from "./APIService";

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
};

export default ProjectApiService;
