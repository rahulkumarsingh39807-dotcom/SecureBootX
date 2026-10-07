const db = require("./database/db");

const devices = [
  {
    device_id: "SBX-001",
    name: "Admin-Laptop",
    ip_address: "192.168.1.10",
    mac_address: "AA:BB:CC:DD:EE:01",
    operating_system: "Windows 11",
    status: "Secure",
    security_score: 96,
    location: "Head Office",
    owner: "Administrator",
  },
  {
    device_id: "SBX-002",
    name: "HR-Workstation",
    ip_address: "192.168.1.11",
    mac_address: "AA:BB:CC:DD:EE:02",
    operating_system: "Windows 11",
    status: "Secure",
    security_score: 91,
    location: "HR Department",
    owner: "HR Team",
  },
  {
    device_id: "SBX-003",
    name: "Finance-PC",
    ip_address: "192.168.1.12",
    mac_address: "AA:BB:CC:DD:EE:03",
    operating_system: "Windows 10",
    status: "At Risk",
    security_score: 68,
    location: "Finance Department",
    owner: "Finance Team",
  },
  {
    device_id: "SBX-004",
    name: "Security-Server",
    ip_address: "192.168.1.20",
    mac_address: "AA:BB:CC:DD:EE:04",
    operating_system: "Ubuntu Server",
    status: "Secure",
    security_score: 98,
    location: "Server Room",
    owner: "Security Team",
  },
  {
    device_id: "SBX-005",
    name: "Dev-Workstation",
    ip_address: "192.168.1.15",
    mac_address: "AA:BB:CC:DD:EE:05",
    operating_system: "Windows 11",
    status: "Warning",
    security_score: 74,
    location: "Development Lab",
    owner: "Development Team",
  },
];

const insert = db.prepare(`
  INSERT OR IGNORE INTO devices (
    device_id,
    name,
    ip_address,
    mac_address,
    operating_system,
    status,
    security_score,
    location,
    owner,
    last_seen
  )
  VALUES (
    @device_id,
    @name,
    @ip_address,
    @mac_address,
    @operating_system,
    @status,
    @security_score,
    @location,
    @owner,
    datetime('now')
  )
`);

const seedDevices = db.transaction((devices) => {
  for (const device of devices) {
    insert.run(device);
  }
});

seedDevices(devices);

console.log("SecureBootX devices seeded successfully.");

const allDevices = db
  .prepare("SELECT * FROM devices ORDER BY id")
  .all();

console.table(allDevices);

db.close();