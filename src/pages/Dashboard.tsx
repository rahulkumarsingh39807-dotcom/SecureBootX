import {
  Monitor,
  ShieldAlert,
  AlertTriangle,
  Bug,
  Activity,
} from "lucide-react";

function Dashboard() {
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

          <h2>Good</h2>

          <p>
            Your environment is being actively monitored.
          </p>
        </div>

        <div className="security-score">

          <div className="score-circle">
            <span>87</span>
            <small>/100</small>
          </div>

          <div>
            <strong>Security Score</strong>
            <p>+4.2% this week</p>
          </div>

        </div>

      </section>

      {/* Statistics */}
      <section className="stats-grid">

        <StatCard
          title="Total Devices"
          value="128"
          change="+8.2%"
          icon={<Monitor size={22} />}
          type="blue"
        />

        <StatCard
          title="Active Threats"
          value="7"
          change="-12.5%"
          icon={<ShieldAlert size={22} />}
          type="red"
        />

        <StatCard
          title="Critical Alerts"
          value="12"
          change="+3.1%"
          icon={<AlertTriangle size={22} />}
          type="orange"
        />

        <StatCard
          title="Vulnerabilities"
          value="24"
          change="-5.4%"
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
              <p>Security events over the last 7 days</p>
            </div>

            <select>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>

          </div>

          <div className="chart">

            <div className="chart-bars">

              <ChartBar height="45%" day="Mon" />
              <ChartBar height="70%" day="Tue" />
              <ChartBar height="55%" day="Wed" />
              <ChartBar height="85%" day="Thu" />
              <ChartBar height="65%" day="Fri" />
              <ChartBar height="40%" day="Sat" />
              <ChartBar height="30%" day="Sun" />

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

          <AlertItem
            level="critical"
            title="Unauthorized login detected"
            device="DEV-021"
            time="2 min ago"
          />

          <AlertItem
            level="high"
            title="Malware detected"
            device="DEV-045"
            time="18 min ago"
          />

          <AlertItem
            level="medium"
            title="Outdated software detected"
            device="DEV-012"
            time="42 min ago"
          />

          <AlertItem
            level="low"
            title="New device connected"
            device="DEV-078"
            time="1 hr ago"
          />

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
            count="104"
            percentage="81%"
            type="secure"
          />

          <StatusRow
            name="Warning"
            count="18"
            percentage="14%"
            type="warning"
          />

          <StatusRow
            name="Critical"
            count="6"
            percentage="5%"
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

          <Event
            title="Malware scan completed"
            time="10:42 AM"
          />

          <Event
            title="Firewall configuration updated"
            time="10:31 AM"
          />

          <Event
            title="New device registered"
            time="10:18 AM"
          />

          <Event
            title="Failed login attempt"
            time="09:54 AM"
          />

        </div>

      </section>

    </div>
  );
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
          {change} from last week
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