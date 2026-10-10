import { useEffect, useMemo, useState } from "react";
import api from "../api";
import {
  Search,
  RefreshCw,
  Bell,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";

interface Alert {
  id: number;
  title: string;
  severity: string;
  description: string;
  device_id: string;
  status: string;
  created_at: string;
}

const API_URL = "http://localhost:5000/api/alerts";

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<Alert[]>(API_URL);

      setAlerts(response.data);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);

      setError(
        "Unable to load alerts. Please make sure the SecureBootX backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        alert.title?.toLowerCase().includes(searchText) ||
        alert.description?.toLowerCase().includes(searchText) ||
        alert.device_id?.toLowerCase().includes(searchText) ||
        alert.status?.toLowerCase().includes(searchText);

      const matchesSeverity =
        severityFilter === "All" ||
        alert.severity === severityFilter;

      const matchesStatus =
        statusFilter === "All" ||
        alert.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [alerts, search, severityFilter, statusFilter]);

  const totalAlerts = alerts.length;

  const criticalAlerts = alerts.filter(
    (alert) => alert.severity === "Critical"
  ).length;

  const highAlerts = alerts.filter(
    (alert) => alert.severity === "High"
  ).length;

  const openAlerts = alerts.filter(
    (alert) => alert.status === "Open"
  ).length;

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-700";

      case "High":
        return "bg-orange-100 text-orange-700";

      case "Medium":
        return "bg-yellow-100 text-yellow-700";

      case "Low":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <XCircle size={16} />;

      case "High":
        return <ShieldAlert size={16} />;

      case "Medium":
        return <AlertTriangle size={16} />;

      case "Low":
        return <ShieldCheck size={16} />;

      default:
        return <Bell size={16} />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-700";

      case "Investigating":
        return "bg-yellow-100 text-yellow-700";

      case "Resolved":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleString();
  };

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Alerts
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Monitor and manage security alerts
          </p>
        </div>

        <button
          onClick={fetchAlerts}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Alerts
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {totalAlerts}
              </p>
            </div>

            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Bell size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Critical
              </p>

              <p className="text-3xl font-bold text-red-600 mt-2">
                {criticalAlerts}
              </p>
            </div>

            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
              <XCircle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                High Severity
              </p>

              <p className="text-3xl font-bold text-orange-600 mt-2">
                {highAlerts}
              </p>
            </div>

            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <ShieldAlert size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Open Alerts
              </p>

              <p className="text-3xl font-bold text-red-600 mt-2">
                {openAlerts}
              </p>
            </div>

            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

      </div>

      {/* Search + Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">

        <div className="flex flex-col md:flex-row gap-4">

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search alerts, devices, descriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Severity</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="Investigating">Investigating</option>
            <option value="Resolved">Resolved</option>
          </select>

        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">

          <p className="font-medium">
            {error}
          </p>

          <button
            onClick={fetchAlerts}
            className="mt-2 text-sm underline"
          >
            Try again
          </button>

        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center shadow-sm">

          <RefreshCw
            size={30}
            className="mx-auto animate-spin text-blue-600"
          />

          <p className="mt-3 text-gray-500">
            Loading alerts from SecureBootX API...
          </p>

        </div>
      )}

      {/* Alerts Table */}
      {!loading && !error && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          <div className="px-6 py-4 border-b border-gray-200">

            <h2 className="font-semibold text-gray-900">
              Security Alerts
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredAlerts.length} of {alerts.length} alerts
            </p>

          </div>

          {filteredAlerts.length === 0 ? (

            <div className="p-10 text-center">

              <ShieldCheck
                size={40}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 text-gray-500">
                No alerts found.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="bg-gray-50 border-b border-gray-200">

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Alert
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Severity
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Device
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Created
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredAlerts.map((alert) => (

                    <tr
                      key={alert.id}
                      className="hover:bg-gray-50 transition"
                    >

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Bell size={20} />
                          </div>

                          <div>

                            <p className="font-medium text-gray-900">
                              {alert.title}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              {alert.description}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getSeverityClass(
                            alert.severity
                          )}`}
                        >
                          {getSeverityIcon(alert.severity)}

                          {alert.severity}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <span className="font-medium text-gray-700">
                          {alert.device_id}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(
                            alert.status
                          )}`}
                        >
                          {alert.status}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <p className="text-sm text-gray-600">
                          {formatDate(alert.created_at)}
                        </p>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>
      )}

    </div>
  );
}