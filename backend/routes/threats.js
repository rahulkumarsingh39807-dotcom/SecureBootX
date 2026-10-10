const authenticateToken = require("../middleware/auth");
const express = require("express");
const db = require("../database/db");

const router = express.Router();
router.use(authenticateToken);

router.get("/", (req, res) => {

  const threats = db
    .prepare("SELECT * FROM threats ORDER BY id DESC")
    .all();

  res.json(threats);

});

module.exports = router;