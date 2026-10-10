import { useEffect, useMemo, useState } from "react";
import api from "../api";
import {
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Search,
  ShieldAlert,
} from "lucide-react";

interface SecurityEvent {
  id: number;
  event_type: string;
  description: string;
  device_id: string;
  severity: string;
  created_at: string;
}

function SecurityEvents() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<SecurityEvent[]>(
        "/security-events"
      );

      setEvents(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load security events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.event_type
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        event.description
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        event.device_id
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesSeverity =
        severityFilter === "All" ||
        event.severity === severityFilter;

      return matchesSearch && matchesSeverity;
    });
  }, [events, search, severityFilter]);

  const totalEvents = events.length;

  const criticalEvents = events.filter(
    (event) => event.severity === "Critical"
  ).length;

  const highEvents = events.filter(
    (event) => event.severity === "High"
  ).length;

  const mediumEvents = events.filter(
    (event) => event.severity === "Medium"
  ).length;

  const lowEvents = events.filter(
    (event) => event.severity === "Low"
  ).length;

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "severity-critical";
      case "High":
        return "severity-high";
      case "Medium":
        return "severity-medium";
      case "Low":
        return "severity-low";
      default:
        return "";
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Security Events</h1>
          <p>Monitor security-related activity across your devices.</p>
        </div>

        <button
          className="refresh-button"
          onClick={fetchEvents}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <ShieldAlert size={24} />
          <div>
            <span>Total Events</span>
            <strong>{totalEvents}</strong>
          </div>
        </div>

        <div className="stat-card">
          <AlertTriangle size={24} />
          <div>
            <span>Critical</span>
            <strong>{criticalEvents}</strong>
          </div>
        </div>

        <div className="stat-card">
          <AlertTriangle size={24} />
          <div>
            <span>High</span>
            <strong>{highEvents}</strong>
          </div>
        </div>

        <div className="stat-card">
          <AlertTriangle size={24} />
          <div>
            <span>Medium</span>
            <strong>{mediumEvents}</strong>
          </div>
        </div>

        <div className="stat-card">
          <CheckCircle size={24} />
          <div>
            <span>Low</span>
            <strong>{lowEvents}</strong>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search events, descriptions, or devices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {loading ? (
          <div className="loading-state">
            Loading security events...
          </div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : filteredEvents.length === 0 ? (
          <div className="empty-state">
            No security events found.
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Event Type</th>
                  <th>Description</th>
                  <th>Device</th>
                  <th>Severity</th>
                  <th>Date & Time</th>
                </tr>
              </thead>

              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <strong>{event.event_type}</strong>
                    </td>

                    <td>{event.description}</td>

                    <td>
                      <span className="device-badge">
                        {event.device_id}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`severity-badge ${getSeverityClass(
                          event.severity
                        )}`}
                      >
                        {event.severity}
                      </span>
                    </td>

                    <td>
                      {new Date(event.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SecurityEvents;