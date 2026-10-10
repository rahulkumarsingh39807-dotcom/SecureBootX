import { useEffect, useMemo, useState } from "react";
import api from "../api";
import {
  Search,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Monitor,
  Eye,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Device {
  id: number;
  device_id: string;
  name: string;
  ip_address: string;
  mac_address: string;
  operating_system: string;
  status: string;
  security_score: number;
  location: string;
  owner: string;
  last_seen: string;
  created_at: string;
}

const API_URL = "http://localhost:5000/api/devices";

export default function Devices() {
  const navigate = useNavigate();

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<Device[]>(API_URL);

      setDevices(response.data);
    } catch (err) {
      console.error("Failed to fetch devices:", err);
      setError(
        "Unable to load devices. Please make sure the SecureBootX backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        device.name?.toLowerCase().includes(searchText) ||
        device.device_id?.toLowerCase().includes(searchText) ||
        device.ip_address?.toLowerCase().includes(searchText) ||
        device.operating_system?.toLowerCase().includes(searchText) ||
        device.owner?.toLowerCase().includes(searchText) ||
        device.location?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || device.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [devices, search, statusFilter]);

  const totalDevices = devices.length;

  const secureDevices = devices.filter(
    (device) => device.status === "Secure"
  ).length;

  const warningDevices = devices.filter(
    (device) => device.status === "Warning"
  ).length;

  const atRiskDevices = devices.filter(
    (device) => device.status === "At Risk"
  ).length;

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Secure":
        return "bg-green-100 text-green-700";

      case "Warning":
        return "bg-yellow-100 text-yellow-700";

      case "At Risk":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getScoreClass = (score: number) => {
    if (score >= 90) {
      return "text-green-600";
    }

    if (score >= 70) {
      return "text-yellow-600";
    }

    return "text-red-600";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Secure":
        return <ShieldCheck size={16} />;

      case "Warning":
        return <ShieldAlert size={16} />;

      case "At Risk":
        return <ShieldX size={16} />;

      default:
        return <Monitor size={16} />;
    }
  };

  const formatLastSeen = (lastSeen: string) => {
    if (!lastSeen) {
      return "Unknown";
    }

    const date = new Date(lastSeen);

    if (Number.isNaN(date.getTime())) {
      return lastSeen;
    }

    return date.toLocaleString();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Devices
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Monitor and manage all connected devices
          </p>
        </div>

        <button
          onClick={fetchDevices}
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
        {/* Total */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Devices
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {totalDevices}
              </p>
            </div>

            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Monitor size={24} />
            </div>
          </div>
        </div>

        {/* Secure */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Secure
              </p>

              <p className="text-3xl font-bold text-green-600 mt-2">
                {secureDevices}
              </p>
            </div>

            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Warning
              </p>

              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {warningDevices}
              </p>
            </div>

            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
              <ShieldAlert size={24} />
            </div>
          </div>
        </div>

        {/* At Risk */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                At Risk
              </p>

              <p className="text-3xl font-bold text-red-600 mt-2">
                {atRiskDevices}
              </p>
            </div>

            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
              <ShieldX size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search devices, IP address, OS, owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Secure">Secure</option>
            <option value="Warning">Warning</option>
            <option value="At Risk">At Risk</option>
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
            onClick={fetchDevices}
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
            Loading devices from SecureBootX API...
          </p>
        </div>
      )}

      {/* Devices Table */}
      {!loading && !error && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Device Inventory
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Showing {filteredDevices.length} of{" "}
                  {devices.length} devices
                </p>
              </div>
            </div>
          </div>

          {filteredDevices.length === 0 ? (
            <div className="p-10 text-center">
              <Monitor
                size={40}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 text-gray-500">
                No devices found.
              </p>

              {search || statusFilter !== "All" ? (
                <p className="text-sm text-gray-400 mt-1">
                  Try changing your search or filter.
                </p>
              ) : (
                <p className="text-sm text-gray-400 mt-1">
                  Add a device to the SecureBootX database.
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Device
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      IP Address
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Operating System
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Security Score
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Location
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Last Seen
                    </th>

                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredDevices.map((device) => (
                    <tr
                      key={device.id}
                      onClick={() =>
                        navigate(`/devices/${device.device_id}`)
                      }
                      className="hover:bg-gray-50 cursor-pointer transition"
                    >
                      {/* Device */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Monitor size={20} />
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {device.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {device.device_id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* IP */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">
                          {device.ip_address || "N/A"}
                        </p>
                      </td>

                      {/* OS */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">
                          {device.operating_system || "N/A"}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(
                            device.status
                          )}`}
                        >
                          {getStatusIcon(device.status)}

                          {device.status}
                        </span>
                      </td>

                      {/* Security Score */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold ${getScoreClass(
                              device.security_score
                            )}`}
                          >
                            {device.security_score}
                          </span>

                          <span className="text-xs text-gray-400">
                            /100
                          </span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">
                          {device.location || "N/A"}
                        </p>
                      </td>

                      {/* Last Seen */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {formatLastSeen(device.last_seen)}
                        </p>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-blue-600">
                          <Eye size={17} />

                          <ChevronRight size={17} />
                        </div>
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