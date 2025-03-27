import React, { useState } from "react";
import "./PopupDetail.css";
import { Project } from "../../Interfaces/Project";
import RoleDisplay from "../RoleDispayProps/RoleDisplayProps";
import { getClientLogoUrl } from "../../Service/ClientService";
import UserProfile from "../UserProfile/UserProfile";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, project }) => {
  const [activeTab, setActiveTab] = useState<"labels" | "users">("users");

  if (!isOpen) return null;

  return (
    <div className="popup">
      <div className="popup-content">
        <span onClick={onClose} className="close-button">
          &times;
        </span>

        <div className="header">
          <h2 className="title">{project.projectName}</h2>
          {project.client?.code && (
            <img
              src={getClientLogoUrl(project.client.code)} // Usa la funzione del service
              alt="Client Logo"
              className="client-logo"
              onError={(e) =>
                (e.currentTarget.src = "/images/default-client.png")
              }
            />
          )}
        </div>

        <p className="description">{project.description}</p>

        <div className="tabs">
          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={activeTab === "labels" ? "active" : ""}
            onClick={() => setActiveTab("labels")}
          >
            Label Evaluations
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "labels" && (
            <div className="list">
              {project.labelEvaluations.map((label, index) => (
                <div key={index} className="list-item">
                  {label.label}
                </div>
              ))}
            </div>
          )}

          {activeTab === "users" && (
            <div className="list">
              {project.users.map((user, index) => (
                <div key={index} className="list-item">
                  <UserProfile username={user.username} clientId={user.code} />
                  {user.role && <RoleDisplay roleCode={user.role} />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
