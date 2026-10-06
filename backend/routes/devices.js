const express = require("express");

const db = require("../database/db");

const router = express.Router();


/* GET ALL DEVICES */

router.get("/", (req, res) => {

  try {

    const devices = db
      .prepare(
        "SELECT * FROM devices ORDER BY id DESC"
      )
      .all();

    res.json(devices);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch devices",
      error: error.message,
    });

  }

});


/* GET DEVICE BY ID */

router.get("/:id", (req, res) => {

  try {

    const device = db
      .prepare(
        "SELECT * FROM devices WHERE device_id = ?"
      )
      .get(req.params.id);

    if (!device) {

      return res.status(404).json({
        message: "Device not found",
      });

    }

    res.json(device);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch device",
      error: error.message,
    });

  }

});


/* CREATE DEVICE */

router.post("/", (req, res) => {

  const {
    device_id,
    name,
    ip_address,
    mac_address,
    operating_system,
    status,
    security_score,
    location,
    owner,
  } = req.body;

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
        device_id,
        name,
        ip_address,
        mac_address,
        operating_system,
        status || "Secure",
        security_score || 0,
        location,
        owner
      );

    res.status(201).json({
      message: "Device created",
      id: result.lastInsertRowid,
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to create device",
      error: error.message,
    });

  }

});


module.exports = router;