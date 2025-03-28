import { useEffect, useState } from "react";
import { getClientLogoUrl } from "../../Service/ClientService";

interface UserProfileProps {
  username: string;
  clientId: string;
  viewName?: boolean;
}

export default function UserProfile({
  username,
  clientId,
  viewName = true,
}: UserProfileProps) {
  const [logoUrl, setLogoUrl] = useState<string>("");

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = getClientLogoUrl(clientId);
        setLogoUrl(response);
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };
    fetchLogo();
  }, [clientId]);

  return (
    <div
      className="user-profile"
      style={{ display: "flex", alignItems: "center", gap: "10px" }}
    >
      {logoUrl && (
        <img
          src={logoUrl}
          alt="User Logo"
          style={{ width: "30px", height: "30px", borderRadius: "50%" }}
        />
      )}
      {viewName ? <span>{username}</span> : ""}
    </div>
  );
}
