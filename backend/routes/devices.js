
const express = require("express");
const db = require("../database/db");
const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

// Require a valid JWT for all device endpoints.
router.use(authenticateToken);

/* GET ALL DEVICES */
// Any authenticated user can view devices.
router.get("/", (req, res) => {
  try {
    const devices = db
      .prepare("SELECT * FROM devices ORDER BY id DESC")
      .all();

    return res.json(devices);
  } catch (error) {
    console.error("Get devices error:", error);

    return res.status(500).json({
      message: "Failed to fetch devices.",
    });
  }
});

/* GET DEVICE BY ID */
// Uses the device_id column, as in your original code.
router.get("/:id", (req, res) => {
  try {
    const device = db
      .prepare("SELECT * FROM devices WHERE device_id = ?")
      .get(req.params.id);

    if (!device) {
      return res.status(404).json({
        message: "Device not found.",
      });
    }

    return res.json(device);
  } catch (error) {
    console.error("Get device error:", error);

    return res.status(500).json({
      message: "Failed to fetch device.",
    });
  }
});

/* CREATE DEVICE */
// Only Administrators can create devices.
router.post("/", authorizeRole("Administrator"), (req, res) => {
  const {
    device_id,
    name,
    ip_address,
    mac_address,
    operating_system,
    status = "Secure",
    security_score = 0,
    location,
    owner,
  } = req.body;

  // Required-field validation.
  if (
    typeof device_id !== "string" ||
    !device_id.trim() ||
    typeof name !== "string" ||
    !name.trim()
  ) {
    return res.status(400).json({
      message: "Device ID and device name are required.",
    });
  }

  // Validate device status.
  const validStatuses = ["Secure", "Warning", "At Risk"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid device status.",
    });
  }

  // Validate security score.
  if (
    !Number.isInteger(security_score) ||
    security_score < 0 ||
    security_score > 100
  ) {
    return res.status(400).json({
      message: "Security score must be an integer from 0 to 100.",
    });
  }

  try {
    const result = db
      .prepare(`
        INSERT INTO devices (
          device_id,
          name,
          ip_address,
          mac_address,
          operating_system,
          status,
          security_score,
          location,
          owner,
          last_seen
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `)
      .run(
        device_id.trim(),
        name.trim(),
        ip_address || null,
        mac_address || null,
        operating_system || null,
        status,
        security_score,
        location || null,
        owner || null
      );

    return res.status(201).json({
      message: "Device created successfully.",
      id: result.lastInsertRowid,
    });
  } catch (error) {
    console.error("Create device error:", error);

    // SQLite unique-constraint violations, such as duplicate device IDs.
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        message: "A device with this ID already exists.",
      });
    }

    return res.status(500).json({
      message: "Failed to create device.",
    });
  }
});

module.exports = router;
