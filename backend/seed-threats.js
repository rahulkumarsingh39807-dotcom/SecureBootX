const db = require("./database/db");

const threats = [
  {
    threat_type: "Malware",
    severity: "High",
    description: "Suspicious malware activity detected on the device.",
    device_id: "SBX-003",
    status: "Active",
  },
  {
    threat_type: "Phishing",
    severity: "Medium",
    description: "Possible phishing attempt detected.",
    device_id: "SBX-002",
    status: "Investigating",
  },
  {
    threat_type: "Ransomware",
    severity: "Critical",
    description: "Potential ransomware behavior detected.",
    device_id: "SBX-005",
    status: "Active",
  },
  {
    threat_type: "Brute Force",
    severity: "High",
    description: "Multiple failed authentication attempts detected.",
    device_id: "SBX-001",
    status: "Resolved",
  },
  {
    threat_type: "Unauthorized Access",
    severity: "Medium",
    description: "Unauthorized access attempt detected.",
    device_id: "SBX-004",
    status: "Investigating",
  },
];

db.exec("DELETE FROM threats");

const insert = db.prepare(`
  INSERT INTO threats (
    threat_type,
    severity,
    description,
    device_id,
    status,
    detected_at
  )
  VALUES (
    @threat_type,
    @severity,
    @description,
    @device_id,
    @status,
    datetime('now')
  )
`);

const seedThreats = db.transaction((threats) => {
  for (const threat of threats) {
    insert.run(threat);
  }
});

seedThreats(threats);

console.log("SecureBootX threats seeded successfully.");

const allThreats = db
  .prepare("SELECT * FROM threats ORDER BY id DESC")
  .all();

console.table(allThreats);

db.close();