import { Value } from "./Project";

export interface Evaluation {
  id: string;
  label: string; //01/01/2024
  values: Value[];
  ratingAverage: number;
}
