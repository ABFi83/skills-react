import { Evaluation } from "./Evalutation";

export interface Project {
  id: string;
  projectName: string;
  ratingAverage: number;
  role: string;
  evaluations: Evaluation[];
  labelEvaluations: Label[];
}
export interface Label {
  id: string;
  label: string;
  shortLabel: string;
}

export interface Value {
  id: string;
  skill: string;
  value: number;
}
