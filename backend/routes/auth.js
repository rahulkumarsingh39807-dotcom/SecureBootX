const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../database/db");

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  try {
    const user = db
      .prepare(
        "SELECT * FROM auth_users WHERE email = ?"
      )
      .get(email.toLowerCase().trim());

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (user.status !== "Active") {
      return res.status(403).json({
        message: "This account is inactive.",
      });
    }

    const passwordValid = bcrypt.compareSync(
      password,
      user.password_hash
    );

    if (!passwordValid) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed.",
      error: error.message,
    });
  }
});

module.exports = router;