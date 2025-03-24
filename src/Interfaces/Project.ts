import { Evaluation } from "./Evalutation";

export interface Project {
  id: string;
  projectName: string;
  role: RoleRosponse;
  evaluations: Evaluation[];
  labelEvaluations: Label[];
}
export interface Label {
  id: string;
  label: string;
  shortLabel: string;
}

export interface RoleRosponse {
  id: number;
  code: string;
  name: string;
}

export interface Value {
  id: string;
  skill: string;
  value: number;
  improve?: number;
}
