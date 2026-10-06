import { Users as UsersIcon } from "lucide-react";

function Users() {
  return (
    <div style={{ padding: "40px", color: "white" }}>
      <UsersIcon size={35} />
      <h1>Users</h1>
      <p>Manage SecureBootX users and roles.</p>
    </div>
  );
}

export default Users;