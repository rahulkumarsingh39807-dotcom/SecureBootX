const express = require("express");
const db = require("../database/db");

const router = express.Router();

router.get("/summary", (req, res) => {
  try {
    const totalDevices = db
      .prepare("SELECT COUNT(*) AS count FROM devices")
      .get().count;

    const secureDevices = db
      .prepare(
        "SELECT COUNT(*) AS count FROM devices WHERE status = 'Secure'"
      )
      .get().count;

    const atRiskDevices = db
      .prepare(
        "SELECT COUNT(*) AS count FROM devices WHERE status = 'At Risk'"
      )
      .get().count;

    const warningDevices = db
      .prepare(
        "SELECT COUNT(*) AS count FROM devices WHERE status = 'Warning'"
      )
      .get().count;

    const totalThreats = db
      .prepare("SELECT COUNT(*) AS count FROM threats")
      .get().count;

    const activeThreats = db
      .prepare(
        "SELECT COUNT(*) AS count FROM threats WHERE status = 'Active'"
      )
      .get().count;

    const criticalThreats = db
      .prepare(
        "SELECT COUNT(*) AS count FROM threats WHERE severity = 'Critical'"
      )
      .get().count;

    const totalAlerts = db
      .prepare("SELECT COUNT(*) AS count FROM alerts")
      .get().count;

    const openAlerts = db
      .prepare(
        "SELECT COUNT(*) AS count FROM alerts WHERE status = 'Open'"
      )
      .get().count;

    const criticalAlerts = db
      .prepare(
        "SELECT COUNT(*) AS count FROM alerts WHERE severity = 'Critical'"
      )
      .get().count;

    const totalVulnerabilities = db
      .prepare("SELECT COUNT(*) AS count FROM vulnerabilities")
      .get().count;

    const openVulnerabilities = db
      .prepare(
        "SELECT COUNT(*) AS count FROM vulnerabilities WHERE status = 'Open'"
      )
      .get().count;

    const criticalVulnerabilities = db
      .prepare(
        "SELECT COUNT(*) AS count FROM vulnerabilities WHERE severity = 'Critical'"
      )
      .get().count;

    const totalSecurityEvents = db
      .prepare("SELECT COUNT(*) AS count FROM security_events")
      .get().count;

    const highSecurityEvents = db
      .prepare(
        "SELECT COUNT(*) AS count FROM security_events WHERE severity = 'High'"
      )
      .get().count;

    res.json({
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
    res.status(500).json({
      message: "Failed to fetch dashboard summary",
      error: error.message,
    });
  }
});

module.exports = router;