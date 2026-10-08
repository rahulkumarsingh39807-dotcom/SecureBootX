import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Monitor,
  ShieldAlert,
  Activity,
  Bell,
  Search,
  LayoutDashboard,
  FileWarning,
  Settings,
  Users,
  FileText,
  Menu,
  LogOut,
} from "lucide-react";

import "../App.css";

function AppLayout() {
  const navigate = useNavigate();

  const storedUser =
    localStorage.getItem("securebootx_user") ||
    sessionStorage.getItem("securebootx_user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const handleLogout = () => {
    localStorage.removeItem("securebootx_user");
    sessionStorage.removeItem("securebootx_user");

    navigate("/login", { replace: true });
  };

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

        {/* User Profile + Logout */}
        <div className="sidebar-bottom">

          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>

          <div className="profile-info">
            <strong>
              {user?.name || "Admin User"}
            </strong>

            <span>
              {user?.role || "Security Admin"}
            </span>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={19} />
          </button>

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
              {user?.name?.charAt(0).toUpperCase() || "A"}
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