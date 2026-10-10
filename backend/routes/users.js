
const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../database/db");

const router = express.Router();

const VALID_ROLES = [
  "User",
  "Security Analyst",
  "Administrator",
];

const VALID_STATUSES = ["Active", "Inactive"];

// Normalize and validate email addresses.
function normalizeEmail(email) {
  return typeof email === "string"
    ? email.trim().toLowerCase()
    : "";
}

// GET /api/users - Fetch all users
router.get("/", (req, res) => {
  try {
    const users = db
      .prepare(`
        SELECT
          id,
          name,
          email,
          role,
          status,
          created_at
        FROM users
        ORDER BY id DESC
      `)
      .all();

    return res.json(users);
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      message: "Failed to fetch users.",
    });
  }
});

// GET /api/users/:id - Fetch one user
router.get("/:id", (req, res) => {
  try {
    const user = db
      .prepare(`
        SELECT
          id,
          name,
          email,
          role,
          status,
          created_at
        FROM users
        WHERE id = ?
      `)
      .get(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.json(user);
  } catch (error) {
    console.error("Get user error:", error);

    return res.status(500).json({
      message: "Failed to fetch user.",
    });
  }
});

// POST /api/users - Create a user
router.post("/", (req, res) => {
  const { name, password, role = "User", status = "Active" } =
    req.body;

  const email = normalizeEmail(req.body.email);

  if (
    typeof name !== "string" ||
    !name.trim() ||
    !email ||
    typeof password !== "string" ||
    !password
  ) {
    return res.status(400).json({
      message: "Name, email and password are required.",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters.",
    });
  }

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({
      message: "Invalid user role.",
    });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      message: "Invalid user status.",
    });
  }

  try {
    const existingUser = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);

    if (existingUser) {
      return res.status(409).json({
        message: "A user with this email already exists.",
      });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const result = db
      .prepare(`
        INSERT INTO users
          (name, email, password, role, status)
        VALUES (?, ?, ?, ?, ?)
      `)
      .run(
        name.trim(),
        email,
        passwordHash,
        role,
        status
      );

    const newUser = db
      .prepare(`
        SELECT
          id,
          name,
          email,
          role,
          status,
          created_at
        FROM users
        WHERE id = ?
      `)
      .get(result.lastInsertRowid);

    return res.status(201).json({
      message: "User created successfully.",
      user: newUser,
    });
  } catch (error) {
    console.error("Create user error:", error);

    return res.status(500).json({
      message: "Failed to create user.",
    });
  }
});

// PUT /api/users/:id - Update a user
router.put("/:id", (req, res) => {
  const { name, password, role, status } = req.body;
  const email = normalizeEmail(req.body.email);

  if (
    typeof name !== "string" ||
    !name.trim() ||
    !email ||
    !VALID_ROLES.includes(role) ||
    !VALID_STATUSES.includes(status)
  ) {
    return res.status(400).json({
      message: "Valid name, email, role and status are required.",
    });
  }

  if (
    password !== undefined &&
    password !== "" &&
    (typeof password !== "string" || password.length < 8)
  ) {
    return res.status(400).json({
      message: "New password must be at least 8 characters.",
    });
  }

  try {
    const existingUser = db
      .prepare("SELECT id FROM users WHERE id = ?")
      .get(req.params.id);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const duplicateEmail = db
      .prepare(`
        SELECT id
        FROM users
        WHERE email = ? AND id != ?
      `)
      .get(email, req.params.id);

    if (duplicateEmail) {
      return res.status(409).json({
        message: "Another user already uses this email.",
      });
    }

    if (password) {
      const passwordHash = bcrypt.hashSync(password, 10);

      db.prepare(`
        UPDATE users
        SET name = ?, email = ?, password = ?, role = ?, status = ?
        WHERE id = ?
      `).run(
        name.trim(),
        email,
        passwordHash,
        role,
        status,
        req.params.id
      );
    } else {
      db.prepare(`
        UPDATE users
        SET name = ?, email = ?, role = ?, status = ?
        WHERE id = ?
      `).run(
        name.trim(),
        email,
        role,
        status,
        req.params.id
      );
    }

    const updatedUser = db
      .prepare(`
        SELECT
          id,
          name,
          email,
          role,
          status,
          created_at
        FROM users
        WHERE id = ?
      `)
      .get(req.params.id);

    return res.json({
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);

    return res.status(500).json({
      message: "Failed to update user.",
    });
  }
});

// PATCH /api/users/:id/status - Change user status
router.patch("/:id/status", (req, res) => {
  const { status } = req.body;

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      message: "Status must be Active or Inactive.",
    });
  }

  try {
    const result = db
      .prepare(`
        UPDATE users
        SET status = ?
        WHERE id = ?
      `)
      .run(status, req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.json({
      message: `User ${status.toLowerCase()} successfully.`,
    });
  } catch (error) {
    console.error("Update user status error:", error);

    return res.status(500).json({
      message: "Failed to update user status.",
    });
  }
});

// DELETE /api/users/:id - Delete a user
router.delete("/:id", (req, res) => {
  try {
    const result = db
      .prepare("DELETE FROM users WHERE id = ?")
      .run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      message: "Failed to delete user.",
    });
  }
});

module.exports = router;