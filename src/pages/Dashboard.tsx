import { useEffect, useState } from "react";
import axios from "axios";
import {
  Monitor,
  ShieldAlert,
  AlertTriangle,
  Bug,
  Activity,
} from "lucide-react";

interface DashboardData {
  devices: {
    total: number;
    secure: number;
    warning: number;
    atRisk: number;
  };
  threats: {
    total: number;
    active: number;
    critical: number;
  };
  alerts: {
    total: number;
    open: number;
    critical: number;
  };
  vulnerabilities: {
    total: number;
    open: number;
    critical: number;
  };
  securityEvents: {
    total: number;
    high: number;
  };
}

interface AlertData {
  id: number;
  title: string;
  severity: string;
  device_id: string;
  status: string;
  created_at: string;
}

interface EventData {
  id: number;
  event_type: string;
  description: string;
  device_id: string;
  severity: string;
  created_at: string;
}

function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [summaryResponse, alertsResponse, eventsResponse] =
          await Promise.all([
            axios.get(
              "http://localhost:5000/api/dashboard/summary"
            ),
            axios.get(
              "http://localhost:5000/api/alerts"
            ),
            axios.get(
              "http://localhost:5000/api/security-events"
            ),
          ]);

        setData(summaryResponse.data);
        setAlerts(alertsResponse.data.slice(0, 4));
        setEvents(eventsResponse.data.slice(0, 4));
      } catch (error) {
        console.error(
          "Failed to load dashboard data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="page-content">
        <div className="page-heading">
          <div>
            <h1>Security Overview</h1>
            <p>Loading security data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page-content">
        <div className="page-heading">
          <div>
            <h1>Security Overview</h1>
            <p>
              Unable to load dashboard data. Make sure the backend
              is running.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const deviceTotal = data.devices.total || 1;

  const securePercentage = Math.round(
    (data.devices.secure / deviceTotal) * 100
  );

  const warningPercentage = Math.round(
    (data.devices.warning / deviceTotal) * 100
  );

  const atRiskPercentage = Math.round(
    (data.devices.atRisk / deviceTotal) * 100
  );

  const securityScore = Math.round(
    (data.devices.secure / deviceTotal) * 100
  );

  return (
    <div className="page-content">

      {/* Page heading */}
      <div className="page-heading">
        <div>
          <h1>Security Overview</h1>
          <p>
            Monitor your organization's security posture.
          </p>
        </div>
      </div>

      {/* Security status */}
      <section className="security-status">

        <div>
          <span className="status-label">
            SYSTEM SECURITY STATUS
          </span>

          <h2>
            {securityScore >= 80
              ? "Good"
              : securityScore >= 60
              ? "Warning"
              : "Critical"}
          </h2>

          <p>
            Your environment is being actively monitored.
          </p>
        </div>

        <div className="security-score">

          <div className="score-circle">
            <span>{securityScore}</span>
            <small>/100</small>
          </div>

          <div>
            <strong>Security Score</strong>
            <p>Based on current device security</p>
          </div>

        </div>

      </section>

      {/* Statistics */}
      <section className="stats-grid">

        <StatCard
          title="Total Devices"
          value={String(data.devices.total)}
          change={`${data.devices.secure} secure`}
          icon={<Monitor size={22} />}
          type="blue"
        />

        <StatCard
          title="Active Threats"
          value={String(data.threats.active)}
          change={`${data.threats.total} total threats`}
          icon={<ShieldAlert size={22} />}
          type="red"
        />

        <StatCard
          title="Critical Alerts"
          value={String(data.alerts.critical)}
          change={`${data.alerts.open} open alerts`}
          icon={<AlertTriangle size={22} />}
          type="orange"
        />

        <StatCard
          title="Vulnerabilities"
          value={String(data.vulnerabilities.open)}
          change={`${data.vulnerabilities.total} total`}
          icon={<Bug size={22} />}
          type="purple"
        />

      </section>

      {/* Main dashboard panels */}
      <section className="dashboard-grid">

        {/* Threat activity */}
        <div className="panel">

          <div className="panel-header">

            <div>
              <h3>Threat Activity</h3>
              <p>
                Current threat severity overview
              </p>
            </div>

          </div>

          <div className="chart">

            <div className="chart-bars">

              <ChartBar
                height={
                  data.threats.total > 0
                    ? "85%"
                    : "10%"
                }
                day="Threats"
              />

              <ChartBar
                height={
                  data.alerts.total > 0
                    ? "70%"
                    : "10%"
                }
                day="Alerts"
              />

              <ChartBar
                height={
                  data.vulnerabilities.total > 0
                    ? "60%"
                    : "10%"
                }
                day="Vulns"
              />

              <ChartBar
                height={
                  data.securityEvents.total > 0
                    ? "90%"
                    : "10%"
                }
                day="Events"
              />

            </div>

          </div>

        </div>

        {/* Recent alerts */}
        <div className="panel">

          <div className="panel-header">

            <div>
              <h3>Recent Alerts</h3>
              <p>Latest security notifications</p>
            </div>

            <a href="/alerts">View all</a>

          </div>

          {alerts.map((alert) => (
            <AlertItem
              key={alert.id}
              level={alert.severity.toLowerCase()}
              title={alert.title}
              device={alert.device_id}
              time={formatTime(alert.created_at)}
            />
          ))}

        </div>

      </section>

      {/* Bottom panels */}
      <section className="dashboard-grid">

        <div className="panel">

          <div className="panel-header">

            <div>
              <h3>Device Security</h3>
              <p>Current device health</p>
            </div>

            <a href="/devices">View devices</a>

          </div>

          <StatusRow
            name="Secure"
            count={String(data.devices.secure)}
            percentage={`${securePercentage}%`}
            type="secure"
          />

          <StatusRow
            name="Warning"
            count={String(data.devices.warning)}
            percentage={`${warningPercentage}%`}
            type="warning"
          />

          <StatusRow
            name="At Risk"
            count={String(data.devices.atRisk)}
            percentage={`${atRiskPercentage}%`}
            type="critical"
          />

        </div>

        <div className="panel">

          <div className="panel-header">

            <div>
              <h3>Recent Events</h3>
              <p>Latest system activity</p>
            </div>

            <a href="/security-events">
              View all
            </a>

          </div>

          {events.map((event) => (
            <Event
              key={event.id}
              title={event.event_type}
              time={formatTime(event.created_at)}
            />
          ))}

        </div>

      </section>

    </div>
  );
}


/* =========================
   Helper Functions
========================= */

function formatTime(date: string) {
  const eventDate = new Date(date);

  return eventDate.toLocaleString();
}


/* =========================
   Components
========================= */

function StatCard({
  title,
  value,
  change,
  icon,
  type,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  type: string;
}) {
  return (
    <div className="stat-card">

      <div className={`stat-icon ${type}`}>
        {icon}
      </div>

      <div className="stat-info">

        <span>{title}</span>

        <strong>{value}</strong>

        <small>
          {change}
        </small>

      </div>

    </div>
  );
}


function ChartBar({
  height,
  day,
}: {
  height: string;
  day: string;
}) {
  return (
    <div className="bar-container">

      <div
        className="bar"
        style={{ height }}
      />

      <span>{day}</span>

    </div>
  );
}


function AlertItem({
  level,
  title,
  device,
  time,
}: {
  level: string;
  title: string;
  device: string;
  time: string;
}) {
  return (
    <div className="alert-item">

      <div className={`alert-indicator ${level}`} />

      <div className="alert-content">

        <strong>{title}</strong>

        <span>
          {device} • {time}
        </span>

      </div>

      <span className={`severity ${level}`}>
        {level}
      </span>

    </div>
  );
}


function StatusRow({
  name,
  count,
  percentage,
  type,
}: {
  name: string;
  count: string;
  percentage: string;
  type: string;
}) {
  return (
    <div className="status-row">

      <div className="status-name">

        <span
          className={`status-dot ${type}`}
        />

        {name}

      </div>

      <strong>{count}</strong>

      <span>{percentage}</span>

    </div>
  );
}


function Event({
  title,
  time,
}: {
  title: string;
  time: string;
}) {
  return (
    <div className="event-row">

      <div className="event-icon">
        <Activity size={16} />
      </div>

      <div>
        <strong>{title}</strong>
        <span>{time}</span>
      </div>

    </div>
  );
}

export default Dashboard;