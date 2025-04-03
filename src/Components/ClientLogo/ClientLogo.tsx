import React from "react";
import { getClientLogoUrl } from "../../Service/ClientService";

interface ClientLogoProps {
  clientCode: string;
  altText?: string;
  className?: string;
}

const ClientLogo: React.FC<ClientLogoProps> = ({
  clientCode,
  altText = "Client Logo",
  className = "client-logo",
}) => {
  return (
    <img
      src={getClientLogoUrl(clientCode)}
      alt={altText}
      className={className}
      onError={(e) => (e.currentTarget.src = "/images/default-client.png")}
    />
  );
};

export default ClientLogo;
