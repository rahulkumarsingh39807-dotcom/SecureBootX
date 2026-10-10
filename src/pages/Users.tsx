
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent, CSSProperties } from "react";
import api from "../api";
import {
  Search,
  RefreshCw,
  Users as UsersIcon,
  ShieldCheck,
  UserCheck,
  UserX,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

interface UserForm {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
}

const API_URL = "/api/users";

const emptyForm: UserForm = {
  name: "",
  email: "",
  password: "",
  role: "User",
  status: "Active",
};

const styles: Record<string, CSSProperties> = {
  page: {
    padding: 24,
    color: "#e5e7eb",
    display: "flex",
    flexDirection: "column",
    gap: 24,
    minWidth: 0,
  },
  header: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  heading: { margin: 0, fontSize: 28, fontWeight: 700, color: "#f9fafb" },
  subtitle: { margin: "6px 0 0", color: "#9ca3af", fontSize: 14 },
  buttonRow: { display: "flex", flexWrap: "wrap", gap: 10 },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "10px 15px",
    borderRadius: 8,
    border: "1px solid #374151",
    background: "#111827",
    color: "#e5e7eb",
    cursor: "pointer",
    fontSize: 14,
  },
  primaryButton: {
    background: "#2563eb",
    color: "#ffffff",
    border: "1px solid #2563eb",
  },
  dangerButton: {
    background: "#7f1d1d",
    color: "#fecaca",
    border: "1px solid #991b1b",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 16,
  },
  card: {
    background: "#111827",
    border: "1px solid #263244",
    borderRadius: 12,
    padding: 20,
    minWidth: 0,
  },
  cardLabel: { color: "#9ca3af", fontSize: 14, margin: 0 },
  cardValue: {
    color: "#f9fafb",
    fontSize: 30,
    fontWeight: 700,
    margin: "10px 0 0",
  },
  filters: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    padding: 16,
    background: "#111827",
    border: "1px solid #263244",
    borderRadius: 12,
  },
  input: {
    boxSizing: "border-box",
    width: "100%",
    minWidth: 0,
    padding: "11px 12px",
    border: "1px solid #374151",
    borderRadius: 8,
    background: "#0b1220",
    color: "#f9fafb",
    outline: "none",
    fontSize: 14,
  },
  searchInput: { flex: "1 1 220px" },
  select: {
    padding: "11px 12px",
    border: "1px solid #374151",
    borderRadius: 8,
    background: "#0b1220",
    color: "#e5e7eb",
    fontSize: 14,
  },
  tablePanel: {
    background: "#111827",
    border: "1px solid #263244",
    borderRadius: 12,
    overflow: "hidden",
  },
  tableHeader: {
    padding: 20,
    borderBottom: "1px solid #263244",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  tableWrap: { width: "100%", overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: 14,
  },
  th: {
    padding: "13px 18px",
    background: "#0b1220",
    color: "#9ca3af",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "15px 18px",
    borderTop: "1px solid #263244",
    verticalAlign: "middle",
  },
  badge: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  muted: { color: "#9ca3af", fontSize: 13 },
  error: {
    padding: 14,
    background: "#35151b",
    color: "#fecaca",
    border: "1px solid #7f1d1d",
    borderRadius: 8,
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    background: "rgba(0,0,0,0.75)",
    overflowY: "auto",
  },
  modal: {
    width: "100%",
    maxWidth: 520,
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#111827",
    border: "1px solid #374151",
    borderRadius: 14,
    boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottom: "1px solid #263244",
  },
  form: { padding: 20, display: "flex", flexDirection: "column", gap: 16 },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 7,
    color: "#d1d5db",
  },
  iconButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    border: "1px solid transparent",
    borderRadius: 7,
    background: "transparent",
    color: "#cbd5e1",
    cursor: "pointer",
  },
  empty: { padding: 40, textAlign: "center", color: "#9ca3af" },
};

function badgeStyle(value: string): CSSProperties {
  if (value === "Administrator") {
    return { ...styles.badge, background: "#3b1d5e", color: "#d8b4fe" };
  }
  if (value === "Security Analyst") {
    return { ...styles.badge, background: "#172554", color: "#93c5fd" };
  }
  if (value === "Active") {
    return { ...styles.badge, background: "#12372a", color: "#86efac" };
  }
  if (value === "Inactive") {
    return { ...styles.badge, background: "#27272a", color: "#d4d4d8" };
  }
  return { ...styles.badge, background: "#1f2937", color: "#d1d5db" };
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const storedUser =
    localStorage.getItem("securebootx_user") ||
    sessionStorage.getItem("securebootx_user");

  const currentUser = useMemo(() => {
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  }, [storedUser]);

  const isAdministrator = currentUser?.role === "Administrator";

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // api.ts supplies the backend base URL and JWT Authorization header.
      const response = await api.get<User[]>(API_URL);

      if (!Array.isArray(response.data)) {
        throw new Error("Unexpected response from the users API.");
      }

      setUsers(response.data);
    } catch (err: unknown) {
      console.error("Failed to fetch users:", err);

      if (api.isAxiosError(err)) {
        const status = err.response?.status;
        const message = err.response?.data?.message;

        if (status === 401) {
          setError("Authentication required. Please sign in again.");
        } else if (status === 403) {
          setError(message || "Access denied.");
        } else if (status === 404) {
          setError(
            "Users API endpoint not found. Check backend/routes/users.js and server.js."
          );
        } else {
          setError(
            message ||
              "Unable to load users. Check that the backend is running."
          );
        }
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load users."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const activeUsers = users.filter((user) => user.status === "Active").length;
  const inactiveUsers = users.filter((user) => user.status === "Inactive").length;
  const administrators = users.filter(
    (user) => user.role === "Administrator"
  ).length;

  function openAddModal() {
    if (!isAdministrator) return;
    setEditingUser(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  }

  function openEditModal(user: User) {
    if (!isAdministrator) return;
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
    });
    setFormError("");
    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;
    setShowModal(false);
    setEditingUser(null);
    setForm(emptyForm);
    setFormError("");
  }

  async function handleSaveUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isAdministrator) {
      setFormError("Only administrators can manage users.");
      return;
    }

    if (!form.name.trim() || !form.email.trim()) {
      setFormError("Name and email are required.");
      return;
    }

    if (!editingUser && !form.password) {
      setFormError("Password is required for a new user.");
      return;
    }

    if (form.password && form.password.length < 8) {
      setFormError("Password must contain at least 8 characters.");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      const payload: UserForm = {
        ...form,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
      };

      if (editingUser) {
        await api.put(`${API_URL}/${editingUser.id}`, payload);
      } else {
        await api.post(API_URL, payload);
      }

      setShowModal(false);
      setEditingUser(null);
      setForm(emptyForm);
      await fetchUsers();
    } catch (err: unknown) {
      console.error("Failed to save user:", err);

      if (api.isAxiosError(err)) {
        setFormError(
          err.response?.data?.message ||
            "Unable to save user. Check the backend and try again."
        );
      } else {
        setFormError("An unexpected error occurred.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteUser(user: User) {
    if (!isAdministrator) return;

    if (
      !window.confirm(
        `Are you sure you want to delete "${user.name}"? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await api.delete(`${API_URL}/${user.id}`);
      await fetchUsers();
    } catch (err: unknown) {
      console.error("Failed to delete user:", err);
      window.alert(
        api.isAxiosError(err)
          ? err.response?.data?.message || "Unable to delete user."
          : "An unexpected error occurred."
      );
    }
  }

  async function handleToggleStatus(user: User) {
    if (!isAdministrator) return;

    const newStatus = user.status === "Active" ? "Inactive" : "Active";

    if (
      !window.confirm(
        `Are you sure you want to ${newStatus.toLowerCase()} "${user.name}"?`
      )
    ) {
      return;
    }

    try {
      await api.patch(`${API_URL}/${user.id}/status`, {
        status: newStatus,
      });
      await fetchUsers();
    } catch (err: unknown) {
      console.error("Failed to update user status:", err);
      window.alert(
        api.isAxiosError(err)
          ? err.response?.data?.message || "Unable to update user status."
          : "An unexpected error occurred."
      );
    }
  }

  function formatDate(value: string) {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString();
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.heading}>Users</h1>
          <p style={styles.subtitle}>
            Manage SecureBootX users and access roles
          </p>
        </div>

        <div style={styles.buttonRow}>
          <button
            type="button"
            style={styles.button}
            onClick={() => void fetchUsers()}
            disabled={loading}
          >
            <RefreshCw size={16} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          {isAdministrator && (
            <button
              type="button"
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={openAddModal}
            >
              <Plus size={17} />
              Add User
            </button>
          )}
        </div>
      </header>

      <section style={styles.grid}>
        <StatCard
          label="Total Users"
          value={users.length}
          icon={<UsersIcon size={23} />}
          color="#60a5fa"
        />
        <StatCard
          label="Active Users"
          value={activeUsers}
          icon={<UserCheck size={23} />}
          color="#4ade80"
        />
        <StatCard
          label="Inactive Users"
          value={inactiveUsers}
          icon={<UserX size={23} />}
          color="#9ca3af"
        />
        <StatCard
          label="Administrators"
          value={administrators}
          icon={<ShieldCheck size={23} />}
          color="#c084fc"
        />
      </section>

      <section style={styles.filters}>
        <div style={{ ...styles.searchInput, position: "relative" }}>
          <Search
            size={17}
            style={{
              position: "absolute",
              left: 12,
              top: 12,
              color: "#9ca3af",
            }}
          />
          <input
            style={{ ...styles.input, paddingLeft: 38 }}
            type="search"
            placeholder="Search users, email, role..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          aria-label="Filter by role"
          style={styles.select}
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="Administrator">Administrator</option>
          <option value="Security Analyst">Security Analyst</option>
          <option value="User">User</option>
        </select>

        <select
          aria-label="Filter by status"
          style={styles.select}
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </section>

      {error && (
        <div style={styles.error} role="alert">
          <p style={{ margin: 0 }}>{error}</p>
          <button
            type="button"
            style={{
              ...styles.button,
              marginTop: 12,
              background: "transparent",
            }}
            onClick={() => void fetchUsers()}
          >
            Try again
          </button>
        </div>
      )}

      <section style={styles.tablePanel}>
        <div style={styles.tableHeader}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, color: "#f9fafb" }}>
              User Management
            </h2>
            <p style={{ ...styles.subtitle, marginTop: 6 }}>
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        </div>

        {loading ? (
          <div style={styles.empty}>
            <RefreshCw
              size={26}
              style={{ animation: "spin 1s linear infinite" }}
            />
            <p>Loading users from SecureBootX API...</p>
          </div>
        ) : error ? (
          <div style={styles.empty}>
            User data could not be loaded. Resolve the API error above.
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={styles.empty}>
            <UsersIcon size={36} />
            <p>No users found.</p>
          </div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Created</th>
                  {isAdministrator && (
                    <th style={{ ...styles.th, textAlign: "right" }}>
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td style={styles.td}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          minWidth: 150,
                        }}
                      >
                        <div
                          style={{
                            padding: 8,
                            background: "#172554",
                            color: "#93c5fd",
                            borderRadius: 8,
                          }}
                        >
                          <UsersIcon size={18} />
                        </div>
                        <span style={{ fontWeight: 600, color: "#f3f4f6" }}>
                          {user.name}
                        </span>
                      </div>
                    </td>

                    <td style={styles.td}>{user.email}</td>

                    <td style={styles.td}>
                      <span style={badgeStyle(user.role)}>{user.role}</span>
                    </td>

                    <td style={styles.td}>
                      <span style={badgeStyle(user.status)}>
                        {user.status}
                      </span>
                    </td>

                    <td style={{ ...styles.td, whiteSpace: "nowrap" }}>
                      {formatDate(user.created_at)}
                    </td>

                    {isAdministrator && (
                      <td style={styles.td}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 4,
                          }}
                        >
                          <button
                            type="button"
                            style={styles.iconButton}
                            title="Edit user"
                            aria-label={`Edit ${user.name}`}
                            onClick={() => openEditModal(user)}
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            style={styles.iconButton}
                            title={
                              user.status === "Active"
                                ? "Deactivate user"
                                : "Activate user"
                            }
                            aria-label={`Change status for ${user.name}`}
                            onClick={() => void handleToggleStatus(user)}
                          >
                            {user.status === "Active" ? (
                              <UserX size={17} />
                            ) : (
                              <UserCheck size={17} />
                            )}
                          </button>

                          <button
                            type="button"
                            style={{
                              ...styles.iconButton,
                              color: "#f87171",
                            }}
                            title="Delete user"
                            aria-label={`Delete ${user.name}`}
                            onClick={() => void handleDeleteUser(user)}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showModal && isAdministrator && (
        <div
          style={styles.modalBackdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-modal-title"
            style={styles.modal}
          >
            <header style={styles.modalHeader}>
              <div>
                <h2
                  id="user-modal-title"
                  style={{ margin: 0, fontSize: 19, color: "#f9fafb" }}
                >
                  {editingUser ? "Edit User" : "Add User"}
                </h2>
                <p style={styles.subtitle}>
                  {editingUser
                    ? "Update user information and access."
                    : "Create a new SecureBootX user."}
                </p>
              </div>

              <button
                type="button"
                style={styles.iconButton}
                onClick={closeModal}
                disabled={saving}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </header>

            <form style={styles.form} onSubmit={handleSaveUser}>
              {formError && (
                <div style={styles.error} role="alert">
                  {formError}
                </div>
              )}

              <FormField label="Full Name">
                <input
                  style={styles.input}
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Enter full name"
                  autoComplete="name"
                  required
                />
              </FormField>

              <FormField label="Email">
                <input
                  style={styles.input}
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  placeholder="user@example.com"
                  autoComplete="email"
                  required
                />
              </FormField>

              <FormField label={editingUser ? "New Password (optional)" : "Password"}>
                <input
                  style={styles.input}
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                  placeholder={
                    editingUser
                      ? "Leave blank to keep current password"
                      : "At least 8 characters"
                  }
                  autoComplete="new-password"
                  minLength={8}
                  required={!editingUser}
                />
              </FormField>

              <FormField label="Role">
                <select
                  style={styles.input}
                  value={form.role}
                  onChange={(event) =>
                    setForm({ ...form, role: event.target.value })
                  }
                >
                  <option value="User">User</option>
                  <option value="Security Analyst">Security Analyst</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </FormField>

              <FormField label="Status">
                <select
                  style={styles.input}
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </FormField>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  paddingTop: 12,
                  borderTop: "1px solid #263244",
                }}
              >
                <button
                  type="button"
                  style={styles.button}
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{ ...styles.button, ...styles.primaryButton }}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <RefreshCw size={16} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {editingUser ? "Update User" : "Create User"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div style={styles.card}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div>
          <p style={styles.cardLabel}>{label}</p>
          <p style={styles.cardValue}>{value}</p>
        </div>
        <div style={{ color, padding: 12, background: "#1f2937", borderRadius: 10 }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}