import React from "react";
import "./RoleDisplayProps.css"; // File CSS per lo stile
import { RoleRosponse } from "../../Interfaces/Project";

interface RoleDisplayProps {
  roleCode: RoleRosponse;
}

const roleData: Record<string, { description: string; image: string }> = {
  ADMIN: { description: "Amministratore", image: "/images/admin.png" },
  DEV: { description: "Sviluppatore", image: "/dev.jpg" },
  DESIGNER: { description: "Designer", image: "/images/designer.png" },
  TL: { description: "Designer", image: "/tl.png" },
  PM: { description: "Project Manager", image: "/images/pm.png" },
  QA: { description: "Quality Assurance", image: "/images/qa.png" },
};

const RoleDisplay: React.FC<RoleDisplayProps> = ({ roleCode }) => {
  const role = roleData[roleCode.code] || {
    description: "Ruolo Sconosciuto",
    image: "/images/default.png",
  };

  return (
    <div className="role-display">
      <img src={role.image} alt={roleCode.name} className="role-icon" />
      <span className="role-text">{roleCode.name}</span>
    </div>
  );
};

export default RoleDisplay;
