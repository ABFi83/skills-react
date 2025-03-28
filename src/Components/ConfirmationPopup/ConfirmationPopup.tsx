import React from "react";

import "./ConfirmationPopup.css"; // Aggiungi il CSS per lo stile del popup

interface ConfirmationPopupProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
}) => {
  if (!isOpen) return null; // Non renderizzare nulla se il popup è chiuso

  return (
    <div className="confirmation-popup-overlay">
      <div className="confirmation-popup">
        <p className="confirmation-message">{message}</p>{" "}
        {/* Applicato il CSS per il testo in grassetto */}
        <div className="confirmation-buttons">
          <button onClick={onConfirm} className="confirm-button">
            Conferma
          </button>
          <button onClick={onCancel} className="cancel-button">
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
