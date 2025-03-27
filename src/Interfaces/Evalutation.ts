import { Value } from "./Project";

export interface Evaluation {
  id: string;
  label: string; //01/01/2024
  values: Value[];
  startDate: Date;
  endDate: Date;
  ratingAverage: number;
}
export interface ValueRequest {
  evaluationId?: number;
  values: Value[];
}
