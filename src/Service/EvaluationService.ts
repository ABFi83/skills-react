import { EvaluationLM, EvaluationsLM } from "../Interfaces/Evalutation";
import api from "./APIService";

export const getEvaluationsByDate = async (
  projectId: string,
  evaluationDate: string
): Promise<EvaluationsLM> => {
  try {
    const response = await api.get(`/projects/${projectId}/evaluations`, {
      params: { evaluationDate },
    });
    return response.data;
  } catch (error) {
    console.error("Errore nel recupero delle valutazioni:", error);
    throw error;
  }
};

export const getEvaluationDates = async (
  projectId: string
): Promise<string[]> => {
  try {
    const response = await api.get(`/projects/${projectId}/evaluations-dates`);
    return response.data;
  } catch (error) {
    console.error("Errore nel recupero delle date delle valutazioni:", error);
    throw error;
  }
};
