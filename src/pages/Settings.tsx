import { Settings as SettingsIcon } from "lucide-react";

function Settings() {
  return (
    <div style={{ padding: "40px", color: "white" }}>
      <SettingsIcon size={35} />
      <h1>Settings</h1>
      <p>Configure SecureBootX settings.</p>
    </div>
  );
}

export default Settings;