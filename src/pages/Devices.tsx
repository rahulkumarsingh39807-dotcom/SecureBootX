import {
  Monitor,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  MoreVertical,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Device = {
  id: string;
  name: string;
  ip: string;
  os: string;
  status: "Secure" | "Warning" | "Critical";
  score: number;
  lastSeen: string;
};

const devices: Device[] = [
  {
    id: "DEV-001",
    name: "Office-PC-01",
    ip: "192.168.1.21",
    os: "Windows 11",
    status: "Secure",
    score: 96,
    lastSeen: "2 min ago",
  },
  {
    id: "DEV-002",
    name: "Admin-Laptop",
    ip: "192.168.1.35",
    os: "Windows 11",
    status: "Warning",
    score: 72,
    lastSeen: "5 min ago",
  },
  {
    id: "DEV-003",
    name: "Security-Server",
    ip: "192.168.1.10",
    os: "Ubuntu 24.04",
    status: "Secure",
    score: 98,
    lastSeen: "1 min ago",
  },
  {
    id: "DEV-004",
    name: "Finance-PC",
    ip: "192.168.1.44",
    os: "Windows 10",
    status: "Critical",
    score: 41,
    lastSeen: "8 min ago",
  },
  {
    id: "DEV-005",
    name: "HR-Laptop",
    ip: "192.168.1.51",
    os: "Windows 11",
    status: "Secure",
    score: 91,
    lastSeen: "3 min ago",
  },
  {
    id: "DEV-006",
    name: "Dev-Workstation",
    ip: "192.168.1.63",
    os: "Ubuntu 22.04",
    status: "Warning",
    score: 68,
    lastSeen: "12 min ago",
  },
];

function Devices() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const filteredDevices = devices.filter((device) => {

    const matchesSearch =
      device.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      device.id
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      device.ip
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      device.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-content">

      {/* Heading */}

      <div className="page-heading">

        <div>
          <h1>Devices</h1>

          <p>
            Monitor and manage devices connected
            to your organization.
          </p>
        </div>

        <button className="primary-button">
          + Add Device
        </button>

      </div>


      {/* Device statistics */}

      <div className="device-stats">

        <DeviceStat
          title="Total Devices"
          value="128"
          icon={<Monitor size={20} />}
        />

        <DeviceStat
          title="Secure"
          value="104"
          icon={<ShieldCheck size={20} />}
        />

        <DeviceStat
          title="Warning"
          value="18"
          icon={<ShieldAlert size={20} />}
        />

        <DeviceStat
          title="Critical"
          value="6"
          icon={<ShieldAlert size={20} />}
        />

      </div>


      {/* Device table */}

      <div className="panel devices-panel">

        {/* Filters */}

        <div className="devices-toolbar">

          <div className="device-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search devices..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <div className="filter-group">

            <Filter size={16} />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="All">
                All Status
              </option>

              <option value="Secure">
                Secure
              </option>

              <option value="Warning">
                Warning
              </option>

              <option value="Critical">
                Critical
              </option>

            </select>

          </div>

        </div>


        {/* Table */}

        <div className="table-container">

          <table className="devices-table">

            <thead>

              <tr>

                <th>DEVICE</th>
                <th>IP ADDRESS</th>
                <th>OPERATING SYSTEM</th>
                <th>STATUS</th>
                <th>SECURITY SCORE</th>
                <th>LAST SEEN</th>
                <th></th>

              </tr>

            </thead>

            <tbody>

              {filteredDevices.map((device) => (

                <tr key={device.id}>

                  <td>

                    <div
  className="device-name clickable"
  onClick={() =>
    navigate(`/devices/${device.id}`)
  }
>

                      <div className="device-icon">
                        <Monitor size={17} />
                      </div>

                      <div>
                        <strong>
                          {device.name}
                        </strong>

                        <span>
                          {device.id}
                        </span>
                      </div>

                    </div>

                  </td>


                  <td>
                    {device.ip}
                  </td>


                  <td>
                    {device.os}
                  </td>


                  <td>

                    <span
                      className={`device-status ${device.status.toLowerCase()}`}
                    >
                      <span className="status-dot" />
                      {device.status}
                    </span>

                  </td>


                  <td>

                    <div className="score-cell">

                      <div className="score-bar">

                        <div
                          style={{
                            width:
                              `${device.score}%`,
                          }}
                        />

                      </div>

                      <span>
                        {device.score}
                      </span>

                    </div>

                  </td>


                  <td>
                    {device.lastSeen}
                  </td>


                  <td>

                    <button
  className="more-button"
  onClick={() =>
    navigate(`/devices/${device.id}`)
  }
>
  <MoreVertical size={17} />
</button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>


          {filteredDevices.length === 0 && (

            <div className="empty-state">

              <Monitor size={35} />

              <h3>
                No devices found
              </h3>

              <p>
                Try changing your search
                or filter.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}


/* =========================
   Components
========================= */

function DeviceStat({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="device-stat">

      <div className="device-stat-icon">
        {icon}
      </div>

      <div>

        <span>{title}</span>

        <strong>{value}</strong>

      </div>

    </div>
  );
}

export default Devices;