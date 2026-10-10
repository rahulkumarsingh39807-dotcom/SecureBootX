const authenticateToken = require("../middleware/auth");
const express = require("express");
const db = require("../database/db");

const router = express.Router();
router.use(authenticateToken);

router.get("/", (req, res) => {

  const alerts = db
    .prepare("SELECT * FROM alerts ORDER BY id DESC")
    .all();

  res.json(alerts);

});

module.exports = router;