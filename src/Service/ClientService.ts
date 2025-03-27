// src/services/clientService.ts
import { API_BASE_URL } from "../config";

export const getClientLogoUrl = (clientCode: string): string => {
  return `${API_BASE_URL}/logo/${clientCode}`;
};
