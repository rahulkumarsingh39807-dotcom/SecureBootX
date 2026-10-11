
const express = require("express");
const db = require("../database/db");
const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

// All threat endpoints require a valid JWT.
router.use(authenticateToken);

// GET /api/threats
// Any authenticated user can view threats.
router.get("/", (req, res) => {
  try {
    const threats = db
      .prepare("SELECT * FROM threats ORDER BY id DESC")
      .all();

    return res.json(threats);
  } catch (error) {
    console.error("Get threats error:", error);

    return res.status(500).json({
      message: "Failed to fetch threats.",
    });
  }
});

// Export middleware for use on future threat modification routes.
// Example:
// router.post("/", authorizeRole("Administrator"), handler);

module.exports = router;

