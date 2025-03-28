// components/ErrorBanner.tsx
import React from "react";
import "./ErrorBanner.css"; // Aggiungi gli stili per il banner

interface ErrorBannerProps {
  message: string;
  onClose: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onClose }) => {
  return (
    <div className="error-banner">
      <div className="error-message">{message}</div>
      <button className="close-button" onClick={onClose}>
        X
      </button>
    </div>
  );
};

export default ErrorBanner;
