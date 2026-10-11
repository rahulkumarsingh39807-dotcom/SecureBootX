
const express = require("express");
const db = require("../database/db");
const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

// Require a valid JWT for all alert endpoints.
router.use(authenticateToken);

// GET /api/alerts
// Any authenticated user can view alerts.
router.get("/", (req, res) => {
  try {
    const alerts = db
      .prepare("SELECT * FROM alerts ORDER BY id DESC")
      .all();

    return res.json(alerts);
  } catch (error) {
    console.error("Get alerts error:", error);

    return res.status(500).json({
      message: "Failed to fetch alerts.",
    });
  }
});

module.exports = router;

