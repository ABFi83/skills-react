import { Link, useLocation } from "react-router-dom";

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

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
      <Link to="/" style={{ textDecoration: "none", color: "#007bff" }}>
        Home
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1 || index === 0; // Evita che "project" sia cliccabile

        return (
          <span key={to} style={{ display: "flex", alignItems: "center" }}>
            <span style={{ margin: "0 5px" }}>/</span>
            {isLast ? (
              <span style={{ color: "gray", cursor: "default" }}>
                {decodeURIComponent(value)}
              </span>
            ) : (
              <Link
                to={to}
                style={{ textDecoration: "none", color: "#007bff" }}
              >
                {decodeURIComponent(value)}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
