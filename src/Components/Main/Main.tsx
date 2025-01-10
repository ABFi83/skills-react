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
    { id: "1", projectName: "Test1", evaluation: 6, role: "DEV" },
    { id: "2", projectName: "Test2", evaluation: 6, role: "DEV" },
    { id: "3", projectName: "Test3", evaluation: 6, role: "DEV" },
    { id: "4", projectName: "Test4", evaluation: 6, role: "DEV" },
    { id: "5", projectName: "Test5", evaluation: 6, role: "DEV" },
    { id: "6", projectName: "Test7", evaluation: 6, role: "DEV" },
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
