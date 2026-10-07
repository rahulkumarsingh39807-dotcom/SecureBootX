const db = require("./database/db");

const vulnerabilities = [
  {
    vulnerability_id: "CVE-2026-001",
    title: "Outdated Windows Security Component",
    severity: "Critical",
    description:
      "A critical security vulnerability was detected in an outdated Windows security component.",
    device_id: "SBX-003",
    status: "Open",
    cvss_score: 9.2,
  },
  {
    vulnerability_id: "CVE-2026-002",
    title: "Unpatched Operating System",
    severity: "High",
    description:
      "The device is running an operating system version with known security vulnerabilities.",
    device_id: "SBX-005",
    status: "Open",
    cvss_score: 8.1,
  },
  {
    vulnerability_id: "CVE-2026-003",
    title: "Weak Authentication Configuration",
    severity: "High",
    description:
      "Weak authentication settings may allow unauthorized access.",
    device_id: "SBX-001",
    status: "Investigating",
    cvss_score: 7.8,
  },
  {
    vulnerability_id: "CVE-2026-004",
    title: "Outdated Network Service",
    severity: "Medium",
    description:
      "An outdated network service was detected on the device.",
    device_id: "SBX-002",
    status: "Open",
    cvss_score: 6.5,
  },
  {
    vulnerability_id: "CVE-2026-005",
    title: "Missing Security Update",
    severity: "Medium",
    description:
      "A recommended security update has not been installed.",
    device_id: "SBX-004",
    status: "Resolved",
    cvss_score: 5.4,
  },
];

db.exec("DELETE FROM vulnerabilities");

const insert = db.prepare(`
  INSERT INTO vulnerabilities (
    vulnerability_id,
    title,
    severity,
    description,
    device_id,
    status,
    cvss_score,
    discovered_at
  )
  VALUES (
    @vulnerability_id,
    @title,
    @severity,
    @description,
    @device_id,
    @status,
    @cvss_score,
    datetime('now')
  )
`);

const seedVulnerabilities = db.transaction((vulnerabilities) => {
  for (const vulnerability of vulnerabilities) {
    insert.run(vulnerability);
  }
});

seedVulnerabilities(vulnerabilities);

console.log("SecureBootX vulnerabilities seeded successfully.");

const allVulnerabilities = db
  .prepare("SELECT * FROM vulnerabilities ORDER BY id DESC")
  .all();

console.table(allVulnerabilities);

db.close();