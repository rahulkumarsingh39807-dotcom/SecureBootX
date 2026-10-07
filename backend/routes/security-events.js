const express = require("express");
const db = require("../database/db");

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const events = db
      .prepare(
        "SELECT * FROM security_events ORDER BY id DESC"
      )
      .all();

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch security events",
      error: error.message,
    });
  }
});

module.exports = router;