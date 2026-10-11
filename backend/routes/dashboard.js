
const express = require("express");
const db = require("../database/db");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// Require authentication for all dashboard routes
router.use(authenticateToken);

// GET /api/dashboard/summary
router.get("/summary", (req, res) => {
  try {
    const count = (sql) => db.prepare(sql).get().count;

    const totalDevices = count(
      "SELECT COUNT(*) AS count FROM devices"
    );

    const secureDevices = count(
      "SELECT COUNT(*) AS count FROM devices WHERE status = 'Secure'"
    );

    const warningDevices = count(
      "SELECT COUNT(*) AS count FROM devices WHERE status = 'Warning'"
    );

    const atRiskDevices = count(
      "SELECT COUNT(*) AS count FROM devices WHERE status = 'At Risk'"
    );

    const totalThreats = count(
      "SELECT COUNT(*) AS count FROM threats"
    );

    const activeThreats = count(
      "SELECT COUNT(*) AS count FROM threats WHERE status = 'Active'"
    );

    const criticalThreats = count(
      "SELECT COUNT(*) AS count FROM threats WHERE severity = 'Critical'"
    );

    const totalAlerts = count(
      "SELECT COUNT(*) AS count FROM alerts"
    );

    const openAlerts = count(
      "SELECT COUNT(*) AS count FROM alerts WHERE status = 'Open'"
    );

    const criticalAlerts = count(
      "SELECT COUNT(*) AS count FROM alerts WHERE severity = 'Critical'"
    );

    const totalVulnerabilities = count(
      "SELECT COUNT(*) AS count FROM vulnerabilities"
    );

    const openVulnerabilities = count(
      "SELECT COUNT(*) AS count FROM vulnerabilities WHERE status = 'Open'"
    );

    const criticalVulnerabilities = count(
      "SELECT COUNT(*) AS count FROM vulnerabilities WHERE severity = 'Critical'"
    );

    const totalSecurityEvents = count(
      "SELECT COUNT(*) AS count FROM security_events"
    );

    const highSecurityEvents = count(
      "SELECT COUNT(*) AS count FROM security_events WHERE severity = 'High'"
    );

    return res.status(200).json({
      devices: {
        total: totalDevices,
        secure: secureDevices,
        warning: warningDevices,
        atRisk: atRiskDevices,
      },
      threats: {
        total: totalThreats,
        active: activeThreats,
        critical: criticalThreats,
      },
      alerts: {
        total: totalAlerts,
        open: openAlerts,
        critical: criticalAlerts,
      },
      vulnerabilities: {
        total: totalVulnerabilities,
        open: openVulnerabilities,
        critical: criticalVulnerabilities,
      },
      securityEvents: {
        total: totalSecurityEvents,
        high: highSecurityEvents,
      },
    });
  } catch (error) {
    console.error("Get dashboard summary error:", error);

    return res.status(500).json({
      message: "Failed to fetch dashboard summary.",
    });
  }
});

module.exports = router;