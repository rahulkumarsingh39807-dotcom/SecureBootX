import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Monitor,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Wifi,
  Cpu,
  HardDrive,
  User,
  MapPin,
  RefreshCw,
} from "lucide-react";

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

export default function DeviceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDevice = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get<Device>(
        `http://localhost:5000/api/devices/${id}`
      );

      setDevice(response.data);
    } catch (err) {
      console.error("Failed to fetch device:", err);
      setDevice(null);
      setError("Device not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDevice();
    }
  }, [id]);

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
        return <ShieldCheck size={20} />;

      case "Warning":
        return <ShieldAlert size={20} />;

      case "At Risk":
        return <ShieldX size={20} />;

      default:
        return <Monitor size={20} />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return "Unknown";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <RefreshCw
            size={32}
            className="mx-auto text-blue-600 animate-spin"
          />

          <p className="mt-3 text-gray-500">
            Loading device details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate("/devices")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Devices
        </button>

        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <ShieldX
            size={45}
            className="mx-auto text-red-500"
          />

          <h2 className="text-xl font-semibold text-gray-900 mt-4">
            Device Not Found
          </h2>

          <p className="text-gray-500 mt-2">
            The device with ID <strong>{id}</strong> could not
            be found.
          </p>

          <button
            onClick={fetchDevice}
            className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate("/devices")}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
      >
        <ArrowLeft size={18} />
        Back to Devices
      </button>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
              <Monitor size={32} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {device.name}
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Device ID: {device.device_id}
              </p>
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${getStatusClass(
              device.status
            )}`}
          >
            {getStatusIcon(device.status)}
            {device.status}
          </div>
        </div>
      </div>

      {/* Security Score */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Security Score
            </h2>

            <p className="text-sm text-gray-500">
              Overall device security health
            </p>
          </div>

          <span
            className={`text-3xl font-bold ${getScoreClass(
              device.security_score
            )}`}
          >
            {device.security_score}/100
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full ${
              device.security_score >= 90
                ? "bg-green-500"
                : device.security_score >= 70
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{
              width: `${device.security_score}%`,
            }}
          />
        </div>
      </div>

      {/* Device Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Information */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <Wifi className="text-blue-600" size={22} />

            <h2 className="text-lg font-semibold text-gray-900">
              Network Information
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">
                IP Address
              </p>

              <p className="font-medium text-gray-900 mt-1">
                {device.ip_address || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                MAC Address
              </p>

              <p className="font-medium text-gray-900 mt-1">
                {device.mac_address || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Last Seen
              </p>

              <p className="font-medium text-gray-900 mt-1">
                {formatDate(device.last_seen)}
              </p>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <Cpu className="text-purple-600" size={22} />

            <h2 className="text-lg font-semibold text-gray-900">
              System Information
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">
                Operating System
              </p>

              <p className="font-medium text-gray-900 mt-1">
                {device.operating_system || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Device ID
              </p>

              <p className="font-medium text-gray-900 mt-1">
                {device.device_id}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Created
              </p>

              <p className="font-medium text-gray-900 mt-1">
                {formatDate(device.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Ownership */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <User className="text-green-600" size={22} />

            <h2 className="text-lg font-semibold text-gray-900">
              Ownership
            </h2>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Owner
            </p>

            <p className="font-medium text-gray-900 mt-1">
              {device.owner || "N/A"}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <MapPin className="text-red-600" size={22} />

            <h2 className="text-lg font-semibold text-gray-900">
              Location
            </h2>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Device Location
            </p>

            <p className="font-medium text-gray-900 mt-1">
              {device.location || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Device Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Device Actions
        </h2>

        <div className="flex flex-wrap gap-3">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={fetchDevice}
          >
            Refresh Device
          </button>

          <button
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            onClick={() => navigate("/devices")}
          >
            Back to Devices
          </button>
        </div>
      </div>
    </div>
  );
}