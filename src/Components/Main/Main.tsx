import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { User } from "../../Interfaces/User";
import ProjectGrid from "../ProjectGrid/ProjectGrid";
import { Project } from "../../Interfaces/Project";
import ProjectDetails from "../ProjectDetails/ProjectDetails";

interface UserInterface {
  user: User;
}

const Main = ({ user }: UserInterface) => {
  const projects: Project[] = [
    {
      id: "1",
      projectName: "Test1",
      ratingAverage: 6,
      role: "DEV",
      evaluations: [
        {
          id: "1",
          label: "01/01/2024",
          values: [
            { id: "1", skill: "1", value: 10 },
            { id: "2", skill: "2", value: 3 },
            { id: "3", skill: "3", value: 6 },
          ],
        },
      ],
      labelEvaluations: [
        { id: "1", label: "Java", shortLabel: "J" },
        { id: "1", label: "React", shortLabel: "Re" },
        { id: "1", label: "C#", shortLabel: "C" },
      ],
    },
    {
      id: "2",
      projectName: "Test2",
      ratingAverage: 6,
      role: "DEV",
      evaluations: [
        {
          id: "1",
          label: "01/01/2024",
          values: [
            { id: "1", skill: "1", value: 10 },
            { id: "2", skill: "2", value: 3 },
            { id: "3", skill: "3", value: 6 },
            { id: "4", skill: "4", value: 2 },
            { id: "5", skill: "5", value: 8 },
          ],
        },
      ],
      labelEvaluations: [
        { id: "1", label: "Java", shortLabel: "J" },
        { id: "1", label: "React", shortLabel: "Re" },
        { id: "1", label: "C#", shortLabel: "C" },
        { id: "1", label: "Git", shortLabel: "G" },
        { id: "1", label: "Angular", shortLabel: "A" },
      ],
    },
  ];

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<ProjectGrid user={user} projects={projects} />}
        />
        <Route path="/project/:id" element={<ProjectDetails />} />
      </Routes>
    </Router>
  );
};

export default Main;
