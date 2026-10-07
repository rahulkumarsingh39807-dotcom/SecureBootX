const db = require("./database/db");

const alerts = [
  {
    title: "Critical Ransomware Activity",
    severity: "Critical",
    description: "Potential ransomware behavior detected on Dev-Workstation.",
    device_id: "SBX-005",
    status: "Open",
  },
  {
    title: "Malware Detected",
    severity: "High",
    description: "Suspicious malware activity detected on Finance-PC.",
    device_id: "SBX-003",
    status: "Open",
  },
  {
    title: "Multiple Failed Login Attempts",
    severity: "High",
    description: "Multiple unsuccessful authentication attempts detected.",
    device_id: "SBX-001",
    status: "Investigating",
  },
  {
    title: "Possible Phishing Attempt",
    severity: "Medium",
    description: "A suspicious phishing-related activity was detected.",
    device_id: "SBX-002",
    status: "Investigating",
  },
  {
    title: "Unauthorized Access Attempt",
    severity: "Medium",
    description: "Unauthorized access attempt detected on Security-Server.",
    device_id: "SBX-004",
    status: "Resolved",
  },
];

db.exec("DELETE FROM alerts");

const insert = db.prepare(`
  INSERT INTO alerts (
    title,
    severity,
    description,
    device_id,
    status,
    created_at
  )
  VALUES (
    @title,
    @severity,
    @description,
    @device_id,
    @status,
    datetime('now')
  )
`);

const seedAlerts = db.transaction((alerts) => {
  for (const alert of alerts) {
    insert.run(alert);
  }
});

seedAlerts(alerts);

console.log("SecureBootX alerts seeded successfully.");

const allAlerts = db
  .prepare("SELECT * FROM alerts ORDER BY id DESC")
  .all();

console.table(allAlerts);

db.close();