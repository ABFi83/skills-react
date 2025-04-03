import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./Components/Login/Login";
import Main from "./Components/Main/Main";
import ErrorBanner from "./Components/ErrorBanner/ErrorBanner";
import { AuthProvider } from "./Context/AuthContext";
import ProjectDetails from "./Components/ProjectDetails/ProjectDetails"; // Importa il componente dei dettagli del progetto
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import { ProjectProvider } from "./Context/ProjectContext";
import ProjectDetailsLM from "./Components/ProjectDetailsLM/ProjectDetailsLM";

function App() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);

  const closeBanner = () => {
    setShowBanner(false);
    setErrorMessage(null);
  };

  return (
    <ProjectProvider>
      <AuthProvider>
        <Router>
          <div className="app-container">
            {showBanner && errorMessage && (
              <ErrorBanner message={errorMessage} onClose={closeBanner} />
            )}
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
      </AuthProvider>
    </ProjectProvider>
  );
}

export default App;
