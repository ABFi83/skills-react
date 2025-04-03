import ClientLogo from "../ClientLogo/ClientLogo";
import "./UserProfile.css";
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
  return (
    <div
      className="user-profile"
      style={{ display: "flex", alignItems: "center", gap: "10px" }}
    >
      {clientId && (
        <ClientLogo clientCode={clientId} className="client-logo-small-user" />
      )}
      {viewName ? <span>{username}</span> : ""}
    </div>
  );
}
