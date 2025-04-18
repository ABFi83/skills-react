import React, { useState } from "react";
import "./PopupDetail.css";
import { Project } from "../../Interfaces/Project";
import RoleDisplay from "../RoleDispayProps/RoleDisplayProps";
import UserProfile from "../UserProfile/UserProfile";
import ClientLogo from "../ClientLogo/ClientLogo";

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
            <ClientLogo clientCode={project.client.code} />
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
            Skills
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
