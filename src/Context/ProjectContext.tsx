import React, { createContext, useState, useEffect, useContext } from "react";
import { Project } from "../Interfaces/Project"; // Assicurati che il tipo Project sia importato

// Definizione del tipo per il contesto
interface ProjectContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  getProjectById: (id: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error(
      "useProject deve essere usato all'interno di ProjectProvider"
    );
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const getInitialProjects = (): Project[] => {
    const savedProjects = localStorage.getItem("projects");
    return savedProjects ? JSON.parse(savedProjects) : [];
  };

  const [projects, setProjects] = useState<Project[]>(getInitialProjects);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const getProjectById = (id: string): Project | undefined => {
    return projects.find((project) => Number(project.id) === Number(id));
  };

  return (
    <ProjectContext.Provider value={{ projects, setProjects, getProjectById }}>
      {children}
    </ProjectContext.Provider>
  );
};
