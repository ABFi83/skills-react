import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./Components/Login/Login";
import Main from "./Components/Main/Main";

import { AuthProvider } from "./Context/AuthContext";
import ProjectDetails from "./Components/ProjectDetails/ProjectDetails"; // Importa il componente dei dettagli del progetto
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import { ProjectProvider } from "./Context/ProjectContext";
import ProjectDetailsLM from "./Components/ProjectDetailsLM/ProjectDetailsLM";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <ProjectProvider>
      <AuthProvider>
        <Router>
          <div className="app-container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<PrivateRoute />}>
                <Route path="/main/*" element={<Main />} />
                <Route path="/project/:id" element={<ProjectDetails />} />
                <Route path="/project/:id/lm" element={<ProjectDetailsLM />} />
                <Route path="/project/new" element={<ProjectDetailsLM />} />
              </Route>
              <Route path="*" element={<Login />} />
            </Routes>
          </div>
        </Router>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthProvider>
    </ProjectProvider>
  );
}

export default App;
