const db = require("./database/db");

const securityEvents = [
  {
    event_type: "Login Attempt",
    description: "Successful administrator login detected.",
    device_id: "SBX-001",
    severity: "Low",
  },
  {
    event_type: "Malware Detection",
    description: "Suspicious malware activity detected on Finance-PC.",
    device_id: "SBX-003",
    severity: "High",
  },
  {
    event_type: "Ransomware Detection",
    description: "Potential ransomware behavior detected on Dev-Workstation.",
    device_id: "SBX-005",
    severity: "Critical",
  },
  {
    event_type: "Failed Login",
    description: "Multiple failed authentication attempts detected.",
    device_id: "SBX-001",
    severity: "High",
  },
  {
    event_type: "System Update",
    description: "Security updates successfully installed.",
    device_id: "SBX-002",
    severity: "Low",
  },
  {
    event_type: "Unauthorized Access",
    description: "Unauthorized access attempt detected on Security-Server.",
    device_id: "SBX-004",
    severity: "High",
  },
  {
    event_type: "Configuration Change",
    description: "Security configuration settings were modified.",
    device_id: "SBX-005",
    severity: "Medium",
  },
  {
    event_type: "Network Anomaly",
    description: "Unusual network traffic pattern detected.",
    device_id: "SBX-003",
    severity: "Medium",
  },
];

db.exec("DELETE FROM security_events");

const insert = db.prepare(`
  INSERT INTO security_events (
    event_type,
    description,
    device_id,
    severity,
    created_at
  )
  VALUES (
    @event_type,
    @description,
    @device_id,
    @severity,
    datetime('now')
  )
`);

const seedSecurityEvents = db.transaction((events) => {
  for (const event of events) {
    insert.run(event);
  }
});

seedSecurityEvents(securityEvents);

console.log("SecureBootX security events seeded successfully.");

const allEvents = db
  .prepare("SELECT * FROM security_events ORDER BY id DESC")
  .all();

console.table(allEvents);

db.close();