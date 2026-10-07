import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Bug,
} from "lucide-react";

interface Vulnerability {
  id: number;
  vulnerability_id: string;
  title: string;
  severity: string;
  description: string;
  device_id: string;
  status: string;
  cvss_score: number;
  discovered_at: string;
}

const API_URL = "http://localhost:5000/api/vulnerabilities";

export default function Vulnerabilities() {
  const [vulnerabilities, setVulnerabilities] = useState<
    Vulnerability[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchVulnerabilities = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get<Vulnerability[]>(API_URL);

      setVulnerabilities(response.data);
    } catch (err) {
      console.error(
        "Failed to fetch vulnerabilities:",
        err
      );

      setError(
        "Unable to load vulnerabilities. Please make sure the SecureBootX backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVulnerabilities();
  }, []);

  const filteredVulnerabilities = useMemo(() => {
    return vulnerabilities.filter((vulnerability) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        vulnerability.vulnerability_id
          ?.toLowerCase()
          .includes(searchText) ||
        vulnerability.title
          ?.toLowerCase()
          .includes(searchText) ||
        vulnerability.description
          ?.toLowerCase()
          .includes(searchText) ||
        vulnerability.device_id
          ?.toLowerCase()
          .includes(searchText);

      const matchesSeverity =
        severityFilter === "All" ||
        vulnerability.severity === severityFilter;

      const matchesStatus =
        statusFilter === "All" ||
        vulnerability.status === statusFilter;

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesStatus
      );
    });
  }, [
    vulnerabilities,
    search,
    severityFilter,
    statusFilter,
  ]);

  const totalVulnerabilities = vulnerabilities.length;

  const criticalVulnerabilities =
    vulnerabilities.filter(
      (vulnerability) =>
        vulnerability.severity === "Critical"
    ).length;

  const highVulnerabilities =
    vulnerabilities.filter(
      (vulnerability) =>
        vulnerability.severity === "High"
    ).length;

  const openVulnerabilities =
    vulnerabilities.filter(
      (vulnerability) =>
        vulnerability.status === "Open"
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
        return <Bug size={16} />;
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
            Vulnerabilities
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Identify and manage security vulnerabilities
          </p>
        </div>

        <button
          onClick={fetchVulnerabilities}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          <RefreshCw
            size={17}
            className={
              loading ? "animate-spin" : ""
            }
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
                Total Vulnerabilities
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {totalVulnerabilities}
              </p>
            </div>

            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Bug size={24} />
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
                {criticalVulnerabilities}
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
                {highVulnerabilities}
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
                Open
              </p>

              <p className="text-3xl font-bold text-red-600 mt-2">
                {openVulnerabilities}
              </p>
            </div>

            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
              <ShieldAlert size={24} />
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
              placeholder="Search CVE, vulnerability, device..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <select
            value={severityFilter}
            onChange={(e) =>
              setSeverityFilter(e.target.value)
            }
            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">
              All Severity
            </option>

            <option value="Critical">
              Critical
            </option>

            <option value="High">
              High
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="Low">
              Low
            </option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">
              All Status
            </option>

            <option value="Open">
              Open
            </option>

            <option value="Investigating">
              Investigating
            </option>

            <option value="Resolved">
              Resolved
            </option>
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
            onClick={fetchVulnerabilities}
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
            Loading vulnerabilities from SecureBootX API...
          </p>

        </div>
      )}

      {/* Vulnerability Table */}
      {!loading && !error && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          <div className="px-6 py-4 border-b border-gray-200">

            <h2 className="font-semibold text-gray-900">
              Vulnerability Management
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Showing{" "}
              {filteredVulnerabilities.length}{" "}
              of {vulnerabilities.length}{" "}
              vulnerabilities
            </p>

          </div>

          {filteredVulnerabilities.length === 0 ? (

            <div className="p-10 text-center">

              <ShieldCheck
                size={40}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 text-gray-500">
                No vulnerabilities found.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="bg-gray-50 border-b border-gray-200">

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Vulnerability
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Severity
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      CVSS
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Device
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Discovered
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredVulnerabilities.map(
                    (vulnerability) => (

                      <tr
                        key={vulnerability.id}
                        className="hover:bg-gray-50 transition"
                      >

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                              <Bug size={20} />
                            </div>

                            <div>

                              <p className="font-medium text-gray-900">
                                {vulnerability.title}
                              </p>

                              <p className="text-xs text-blue-600 mt-1">
                                {
                                  vulnerability.vulnerability_id
                                }
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                {
                                  vulnerability.description
                                }
                              </p>

                            </div>

                          </div>

                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getSeverityClass(
                              vulnerability.severity
                            )}`}
                          >
                            {getSeverityIcon(
                              vulnerability.severity
                            )}

                            {vulnerability.severity}
                          </span>

                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`font-bold ${
                              vulnerability.cvss_score >=
                              9
                                ? "text-red-600"
                                : vulnerability.cvss_score >=
                                  7
                                ? "text-orange-600"
                                : vulnerability.cvss_score >=
                                  4
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {vulnerability.cvss_score.toFixed(
                              1
                            )}
                          </span>

                          <span className="text-xs text-gray-400">
                            /10
                          </span>

                        </td>

                        <td className="px-6 py-4">

                          <span className="font-medium text-gray-700">
                            {vulnerability.device_id}
                          </span>

                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(
                              vulnerability.status
                            )}`}
                          >
                            {vulnerability.status}
                          </span>

                        </td>

                        <td className="px-6 py-4">

                          <p className="text-sm text-gray-600">
                            {formatDate(
                              vulnerability.discovered_at
                            )}
                          </p>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>
      )}

    </div>
  );
}