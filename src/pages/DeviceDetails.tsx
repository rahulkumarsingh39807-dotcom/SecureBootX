import {
  ArrowLeft,
  Monitor,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Wifi,
  Cpu,
  HardDrive,
  Clock,
  RefreshCw,
  Scan,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

const deviceData: Record<string, any> = {
  "DEV-001": {
    name: "Office-PC-01",
    ip: "192.168.1.21",
    os: "Windows 11",
    status: "Secure",
    score: 96,
    lastSeen: "2 min ago",
    mac: "00:1B:44:11:3A:B7",
    location: "Head Office",
    owner: "Admin User",
    processor: "Intel Core i7",
    memory: "16 GB",
    storage: "512 GB SSD",
  },

  "DEV-002": {
    name: "Admin-Laptop",
    ip: "192.168.1.35",
    os: "Windows 11",
    status: "Warning",
    score: 72,
    lastSeen: "5 min ago",
    mac: "00:1B:44:22:4B:C8",
    location: "Head Office",
    owner: "Security Admin",
    processor: "Intel Core i5",
    memory: "16 GB",
    storage: "512 GB SSD",
  },

  "DEV-003": {
    name: "Security-Server",
    ip: "192.168.1.10",
    os: "Ubuntu 24.04",
    status: "Secure",
    score: 98,
    lastSeen: "1 min ago",
    mac: "00:1B:44:33:5C:D9",
    location: "Server Room",
    owner: "IT Department",
    processor: "AMD EPYC",
    memory: "64 GB",
    storage: "2 TB SSD",
  },

  "DEV-004": {
    name: "Finance-PC",
    ip: "192.168.1.44",
    os: "Windows 10",
    status: "Critical",
    score: 41,
    lastSeen: "8 min ago",
    mac: "00:1B:44:44:6D:E0",
    location: "Finance Department",
    owner: "Finance User",
    processor: "Intel Core i5",
    memory: "8 GB",
    storage: "256 GB SSD",
  },
};

function DeviceDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const device = deviceData[id || "DEV-001"];

  if (!device) {
    return (
      <div className="page-content">
        <h1>Device Not Found</h1>

        <button
          className="primary-button"
          onClick={() => navigate("/devices")}
        >
          Back to Devices
        </button>
      </div>
    );
  }

  return (
    <div className="page-content">

      {/* Back button */}

      <button
        className="back-button"
        onClick={() => navigate("/devices")}
      >
        <ArrowLeft size={17} />
        Back to Devices
      </button>


      {/* Device heading */}

      <div className="device-details-heading">

        <div className="device-title">

          <div className="large-device-icon">
            <Monitor size={28} />
          </div>

          <div>
            <h1>{device.name}</h1>

            <p>
              {device.id} • {device.ip}
            </p>
          </div>

        </div>

        <span
          className={`device-status ${device.status.toLowerCase()}`}
        >
          <span className="status-dot" />
          {device.status}
        </span>

      </div>


      {/* Overview cards */}

      <div className="device-overview-grid">

        <div className="detail-card">

          <div className="detail-card-icon">
            <ShieldCheck size={20} />
          </div>

          <span>Security Score</span>

          <strong>{device.score}/100</strong>

          <div className="large-score-bar">
            <div
              style={{
                width: `${device.score}%`,
              }}
            />
          </div>

        </div>


        <div className="detail-card">

          <div className="detail-card-icon">
            <Activity size={20} />
          </div>

          <span>Threats Detected</span>

          <strong>
            {device.status === "Critical" ? "4" : "0"}
          </strong>

          <small>
            Last 24 hours
          </small>

        </div>


        <div className="detail-card">

          <div className="detail-card-icon">
            <Wifi size={20} />
          </div>

          <span>Connection</span>

          <strong>Online</strong>

          <small>
            Last seen {device.lastSeen}
          </small>

        </div>

      </div>


      {/* Information */}

      <div className="device-details-grid">

        <div className="panel">

          <div className="panel-header">

            <div>
              <h3>Device Information</h3>
              <p>Hardware and network details</p>
            </div>

          </div>


          <InfoRow
            label="Device ID"
            value={id || ""}
          />

          <InfoRow
            label="IP Address"
            value={device.ip}
          />

          <InfoRow
            label="MAC Address"
            value={device.mac}
          />

          <InfoRow
            label="Operating System"
            value={device.os}
          />

          <InfoRow
            label="Location"
            value={device.location}
          />

          <InfoRow
            label="Owner"
            value={device.owner}
          />

        </div>


        <div className="panel">

          <div className="panel-header">

            <div>
              <h3>System Resources</h3>
              <p>Current hardware configuration</p>
            </div>

          </div>


          <ResourceRow
            icon={<Cpu size={17} />}
            label="Processor"
            value={device.processor}
          />

          <ResourceRow
            icon={<Monitor size={17} />}
            label="Memory"
            value={device.memory}
          />

          <ResourceRow
            icon={<HardDrive size={17} />}
            label="Storage"
            value={device.storage}
          />

          <ResourceRow
            icon={<Clock size={17} />}
            label="Last Seen"
            value={device.lastSeen}
          />

        </div>

      </div>


      {/* Security events */}

      <div className="panel">

        <div className="panel-header">

          <div>
            <h3>Recent Security Events</h3>
            <p>Latest activity detected on this device</p>
          </div>

          <button className="secondary-button">
            View All
          </button>

        </div>


        <SecurityEvent
          icon={<ShieldCheck size={17} />}
          title="Security scan completed"
          description="No malicious files detected"
          time="2 minutes ago"
          type="secure"
        />

        <SecurityEvent
          icon={<Activity size={17} />}
          title="System activity recorded"
          description="Normal device activity detected"
          time="18 minutes ago"
          type="normal"
        />

        <SecurityEvent
          icon={<RefreshCw size={17} />}
          title="Security definitions updated"
          description="Threat intelligence database updated"
          time="1 hour ago"
          type="normal"
        />

      </div>


      {/* Actions */}

      <div className="device-actions">

        <button className="secondary-button">
          <Scan size={17} />
          Run Security Scan
        </button>

        <button className="secondary-button">
          <RefreshCw size={17} />
          Refresh Status
        </button>

        <button className="danger-button">
          <ShieldAlert size={17} />
          Isolate Device
        </button>

      </div>

    </div>
  );
}


/* =========================
   Components
========================= */

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="info-row">

      <span>{label}</span>

      <strong>{value}</strong>

    </div>
  );
}


function ResourceRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="resource-row">

      <div className="resource-icon">
        {icon}
      </div>

      <span>{label}</span>

      <strong>{value}</strong>

    </div>
  );
}


function SecurityEvent({
  icon,
  title,
  description,
  time,
  type,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  type: string;
}) {
  return (
    <div className="security-event">

      <div className={`event-status ${type}`}>
        {icon}
      </div>

      <div className="security-event-content">

        <strong>{title}</strong>

        <span>{description}</span>

      </div>

      <time>{time}</time>

    </div>
  );
}

export default DeviceDetails;