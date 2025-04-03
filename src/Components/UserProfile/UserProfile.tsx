import ClientLogo from "../ClientLogo/ClientLogo";

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
      {clientId && <ClientLogo clientCode={clientId} />}
      {viewName ? <span>{username}</span> : ""}
    </div>
  );
}
