
const express = require("express");
const db = require("../database/db");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// Require authentication for all security event routes
router.use(authenticateToken);

// GET /api/security-events
// Fetch all security events
router.get("/", (req, res) => {
  try {
    const events = db
      .prepare("SELECT * FROM security_events ORDER BY id DESC")
      .all();

    return res.status(200).json(events);
  } catch (error) {
    console.error("Get security events error:", error);

    return res.status(500).json({
      message: "Failed to fetch security events.",
    });
  }
});

module.exports = router;