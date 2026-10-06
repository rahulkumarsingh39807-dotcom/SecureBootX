const express = require("express");
const db = require("../database/db");

const router = express.Router();

router.get("/", (req, res) => {

  const users = db
    .prepare("SELECT * FROM users ORDER BY id DESC")
    .all();

  res.json(users);

});

module.exports = router;