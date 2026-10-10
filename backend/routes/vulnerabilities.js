const authenticateToken = require("../middleware/auth");
const express = require("express");
const db = require("../database/db");

const router = express.Router();
router.use(authenticateToken);

router.get("/", (req, res) => {
  try {
    const vulnerabilities = db
      .prepare(
        "SELECT * FROM vulnerabilities ORDER BY id DESC"
      )
      .all();

    res.json(vulnerabilities);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch vulnerabilities",
      error: error.message,
    });
  }
});

router.get("/:id", (req, res) => {
  try {
    const vulnerability = db
      .prepare(
        "SELECT * FROM vulnerabilities WHERE vulnerability_id = ?"
      )
      .get(req.params.id);

    if (!vulnerability) {
      return res.status(404).json({
        message: "Vulnerability not found",
      });
    }

    res.json(vulnerability);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch vulnerability",
      error: error.message,
    });
  }
});

module.exports = router;