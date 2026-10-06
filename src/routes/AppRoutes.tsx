import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Devices from "../pages/Devices";
import Threats from "../pages/Threats";
import Alerts from "../pages/Alerts";
import Vulnerabilities from "../pages/Vulnerabilities";
import SecurityEvents from "../pages/SecurityEvents";
import Users from "../pages/Users";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import DeviceDetails from "../pages/DeviceDetails";

import AppLayout from "../layouts/AppLayout";

function AppRoutes() {

  return (
    <Routes>

      {/* Default */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      {/* Login */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* Application */}

      <Route
        element={<AppLayout />}
      >

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/devices"
          element={<Devices />}
        />

        <Route
  path="/devices/:id"
  element={<DeviceDetails />}
/>

        <Route
          path="/threats"
          element={<Threats />}
        />

        <Route
          path="/alerts"
          element={<Alerts />}
        />

        <Route
          path="/vulnerabilities"
          element={<Vulnerabilities />}
        />

        <Route
          path="/security-events"
          element={<SecurityEvents />}
        />

        <Route
          path="/users"
          element={<Users />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Route>

      {/* Unknown URL */}

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>
  );
}




export default AppRoutes;