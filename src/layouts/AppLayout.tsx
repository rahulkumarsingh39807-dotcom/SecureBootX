import { Outlet } from "react-router-dom";
import {
  ShieldCheck,
  Monitor,
  AlertTriangle,
  Bug,
  Activity,
  Bell,
  Search,
  LayoutDashboard,
  ShieldAlert,
  FileWarning,
  Settings,
  Users,
  FileText,
  Menu,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import "../App.css";

function AppLayout() {
  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">
            <ShieldCheck size={28} />
          </div>

          <div>
            <h2>SecureBootX</h2>
            <span>Security Platform</span>
          </div>

        </div>

        <nav className="sidebar-nav">

          <p className="nav-title">MAIN</p>

          <SidebarLink
            to="/dashboard"
            icon={<LayoutDashboard size={19} />}
            label="Dashboard"
          />

          <SidebarLink
            to="/devices"
            icon={<Monitor size={19} />}
            label="Devices"
          />

          <SidebarLink
            to="/threats"
            icon={<ShieldAlert size={19} />}
            label="Threats"
          />

          <SidebarLink
            to="/alerts"
            icon={<Bell size={19} />}
            label="Alerts"
          />

          <SidebarLink
            to="/vulnerabilities"
            icon={<FileWarning size={19} />}
            label="Vulnerabilities"
          />

          <p className="nav-title">MANAGEMENT</p>

          <SidebarLink
            to="/security-events"
            icon={<Activity size={19} />}
            label="Security Events"
          />

          <SidebarLink
            to="/users"
            icon={<Users size={19} />}
            label="Users"
          />

          <SidebarLink
            to="/reports"
            icon={<FileText size={19} />}
            label="Reports"
          />

          <SidebarLink
            to="/settings"
            icon={<Settings size={19} />}
            label="Settings"
          />

        </nav>

        <div className="sidebar-bottom">

          <div className="profile-avatar">
            A
          </div>

          <div>
            <strong>Admin User</strong>
            <span>Security Admin</span>
          </div>

        </div>

      </aside>

      {/* Main Area */}

      <main className="main-content">

        <header className="topbar">

          <div className="mobile-menu">
            <Menu />
          </div>

          <div>
            <h1>SecureBootX</h1>
            <p>
              Cybersecurity Monitoring Platform
            </p>
          </div>

          <div className="topbar-actions">

            <div className="search-box">

              <Search size={18} />

              <input
                placeholder="Search..."
              />

            </div>

            <button className="icon-button">

              <Bell size={20} />

              <span className="notification-dot"></span>

            </button>

            <div className="user-avatar">
              A
            </div>

          </div>

        </header>

        {/* Page Content */}

        <Outlet />

      </main>

    </div>
  );
}


function SidebarLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-item ${isActive ? "active" : ""}`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

export default AppLayout;