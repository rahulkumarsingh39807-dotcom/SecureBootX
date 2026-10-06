const express = require("express");
const db = require("../database/db");

const router = express.Router();

router.get("/", (req, res) => {

  const threats = db
    .prepare("SELECT * FROM threats ORDER BY id DESC")
    .all();

  res.json(threats);

});

module.exports = router;