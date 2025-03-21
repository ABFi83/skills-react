import axios from "axios";

// Definisci l'interfaccia per un progetto
import { Project } from "../Interfaces/Project";
import { API_BASE_URL } from "../config";

const ProjectApiService = {
  getProjectDetail: async (projectId: string): Promise<Project> => {
    try {
      const response = await axios.get<Project>(
        `${API_BASE_URL}/project/${projectId}`
      );
      return response.data;
    } catch (error) {
      console.error("Errore nella chiamata API:", error);
      throw error;
    }
  },
};

export default ProjectApiService;
