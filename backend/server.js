const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

const db = require("./database/db");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;


/* =========================
   Middleware
========================= */

app.use(cors());

app.use(express.json());


/* =========================
   Initialize Database
========================= */

const schemaPath = path.join(
  __dirname,
  "database",
  "schema.sql"
);

const schema = fs.readFileSync(
  schemaPath,
  "utf8"
);

db.exec(schema);


/* =========================
   Health Check
========================= */

app.get("/", (req, res) => {

  res.json({
    message: "SecureBootX API is running",
    status: "online",
  });

});


/* =========================
   API Routes
========================= */

const devicesRouter =
  require("./routes/devices");

const threatsRouter =
  require("./routes/threats");

const alertsRouter =
  require("./routes/alerts");

const usersRouter =
  require("./routes/users");


app.use(
  "/api/devices",
  devicesRouter
);

app.use(
  "/api/threats",
  threatsRouter
);

app.use(
  "/api/alerts",
  alertsRouter
);

app.use(
  "/api/users",
  usersRouter
);


/* =========================
   404
========================= */

app.use((req, res) => {

  res.status(404).json({
    message: "API endpoint not found",
  });

});


/* =========================
   Start Server
========================= */

app.listen(PORT, () => {

  console.log(
    `SecureBootX API running on http://localhost:${PORT}`
  );

});