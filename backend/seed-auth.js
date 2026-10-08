const bcrypt = require("bcryptjs");
const db = require("./database/db");

const name = "SecureBootX Admin";
const email = "admin@securebootx.com";
const password = "Admin@123";

const passwordHash = bcrypt.hashSync(password, 10);

const existingUser = db
  .prepare("SELECT id FROM auth_users WHERE email = ?")
  .get(email);

if (existingUser) {
  db.prepare(`
    UPDATE auth_users
    SET name = ?,
        password_hash = ?,
        role = ?,
        status = ?
    WHERE email = ?
  `).run(
    name,
    passwordHash,
    "Administrator",
    "Active",
    email
  );

  console.log("Admin account updated successfully.");
} else {
  db.prepare(`
    INSERT INTO auth_users (
      name,
      email,
      password_hash,
      role,
      status
    )
    VALUES (?, ?, ?, ?, ?)
  `).run(
    name,
    email,
    passwordHash,
    "Administrator",
    "Active"
  );

  console.log("Admin account created successfully.");
}

console.log("");
console.log("Login credentials:");
console.log("Email: admin@securebootx.com");
console.log("Password: Admin@123");

db.close();