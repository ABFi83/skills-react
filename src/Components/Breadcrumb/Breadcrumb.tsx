import { Link, useLocation } from "react-router-dom";
import { useProject } from "../../Context/ProjectContext";

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname
    .split("/")
    .filter((x) => x && x !== "main"); // 🔥 Rimuove "main"
  const { getProjectById } = useProject();

  return (
    <nav
      className="breadcrumb"
      style={{
        fontSize: "14px",
        marginTop: "5px",
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}
    >
      {/* 🔹 Mantiene solo "Home" */}
      <Link to="/main" style={{ textDecoration: "none", color: "#007bff" }}>
        Home
      </Link>

      {pathnames.map((value, index) => {
        if (value === "project") return null; // 🔥 Rimuove "project" dal breadcrumb

        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        let label = decodeURIComponent(value);
        const prevPath = pathnames[index - 1];

        if (prevPath === "project") {
          const project = getProjectById(value);
          if (project) {
            label = project.projectName;
          }
        }

        return (
          <span key={to} style={{ display: "flex", alignItems: "center" }}>
            <span style={{ margin: "0 5px" }}>/</span>
            {isLast ? (
              <span style={{ color: "gray", cursor: "default" }}>{label}</span>
            ) : (
              <Link
                to={to}
                style={{ textDecoration: "none", color: "#007bff" }}
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
