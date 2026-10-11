
const express = require("express");
const db = require("../database/db");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// Require authentication for all vulnerability routes
router.use(authenticateToken);

// GET /api/vulnerabilities
// Fetch all vulnerabilities
router.get("/", (req, res) => {
  try {
    const vulnerabilities = db
      .prepare("SELECT * FROM vulnerabilities ORDER BY id DESC")
      .all();

    return res.status(200).json(vulnerabilities);
  } catch (error) {
    console.error("Get vulnerabilities error:", error);

    return res.status(500).json({
      message: "Failed to fetch vulnerabilities.",
    });
  }
});

// GET /api/vulnerabilities/:id
// Fetch one vulnerability by vulnerability_id
router.get("/:id", (req, res) => {
  try {
    const vulnerability = db
      .prepare(
        "SELECT * FROM vulnerabilities WHERE vulnerability_id = ?"
      )
      .get(req.params.id);

    if (!vulnerability) {
      return res.status(404).json({
        message: "Vulnerability not found.",
      });
    }

    return res.status(200).json(vulnerability);
  } catch (error) {
    console.error("Get vulnerability error:", error);

    return res.status(500).json({
      message: "Failed to fetch vulnerability.",
    });
  }
});

module.exports = router;