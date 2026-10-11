
const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "securebootx.db");

let db;

try {
  db = new Database(dbPath);

  // Wait briefly if another operation is using the database
  db.pragma("busy_timeout = 5000");

  // Enable write-ahead logging
  db.pragma("journal_mode = WAL");

  // Enforce foreign-key constraints
  db.pragma("foreign_keys = ON");

  console.log("SecureBootX SQLite database connected.");
} catch (error) {
  console.error("Database connection failed:", error.message);

  if (db && db.open) {
    db.close();
  }

  throw error;
}

module.exports = db;