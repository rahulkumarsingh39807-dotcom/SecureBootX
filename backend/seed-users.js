const db = require("./database/db");

const users = [
  {
    name: "Rahul Kumar",
    email: "rahul@securebootx.com",
    role: "Administrator",
    status: "Active",
  },
  {
    name: "Security Team",
    email: "security@securebootx.com",
    role: "Security Analyst",
    status: "Active",
  },
  {
    name: "HR Team",
    email: "hr@securebootx.com",
    role: "User",
    status: "Active",
  },
  {
    name: "Finance Team",
    email: "finance@securebootx.com",
    role: "User",
    status: "Active",
  },
  {
    name: "Development Team",
    email: "dev@securebootx.com",
    role: "Security Analyst",
    status: "Inactive",
  },
];

db.exec("DELETE FROM users");

const insert = db.prepare(`
  INSERT INTO users (
    name,
    email,
    role,
    status,
    created_at
  )
  VALUES (
    @name,
    @email,
    @role,
    @status,
    datetime('now')
  )
`);

const seedUsers = db.transaction((users) => {
  for (const user of users) {
    insert.run(user);
  }
});

seedUsers(users);

console.log("SecureBootX users seeded successfully.");

const allUsers = db
  .prepare("SELECT * FROM users ORDER BY id DESC")
  .all();

console.table(allUsers);

db.close();