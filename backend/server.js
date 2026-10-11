
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const db = require("./database/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Validate JWT configuration before starting the server
if (!process.env.JWT_SECRET) {
  console.error("Startup failed: JWT_SECRET is not configured in .env.");
  process.exit(1);
}

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));

// Initialize database schema
try {
  const schemaPath = path.join(
    __dirname,
    "database",
    "schema.sql"
  );

  const schema = fs.readFileSync(schemaPath, "utf8");
  db.exec(schema);

  console.log("SecureBootX database initialized.");
} catch (error) {
  console.error("Database initialization failed:", error.message);
  process.exit(1);
}

// Health check
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "SecureBootX API is running",
    status: "online",
  });
});

// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/devices", require("./routes/devices"));
app.use("/api/threats", require("./routes/threats"));
app.use("/api/alerts", require("./routes/alerts"));
app.use("/api/users", require("./routes/users"));
app.use("/api/vulnerabilities", require("./routes/vulnerabilities"));
app.use("/api/security-events", require("./routes/security-events"));
app.use("/api/dashboard", require("./routes/dashboard"));

// Handle malformed JSON
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      message: "Invalid JSON request body.",
    });
  }

  return next(error);
});

// API endpoint not found
app.use((req, res) => {
  return res.status(404).json({
    message: "API endpoint not found.",
  });
});

// General error handler
app.use((error, req, res, next) => {
  console.error("Unhandled API error:", error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    message: "An internal server error occurred.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`SecureBootX API running on http://localhost:${PORT}`);
});