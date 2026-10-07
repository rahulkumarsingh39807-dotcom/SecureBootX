import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  RefreshCw,
  Users as UsersIcon,
  ShieldCheck,
  UserCheck,
  UserX,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

const API_URL = "http://localhost:5000/api/users";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get<User[]>(API_URL);

      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);

      setError(
        "Unable to load users. Please make sure the SecureBootX backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        user.name?.toLowerCase().includes(searchText) ||
        user.email?.toLowerCase().includes(searchText) ||
        user.role?.toLowerCase().includes(searchText);

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.status === "Inactive"
  ).length;

  const administrators = users.filter(
    (user) => user.role === "Administrator"
  ).length;

  const getRoleClass = (role: string) => {
    switch (role) {
      case "Administrator":
        return "bg-purple-100 text-purple-700";

      case "Security Analyst":
        return "bg-blue-100 text-blue-700";

      case "User":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";

      case "Inactive":
        return "bg-gray-100 text-gray-600";

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
            Users
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage SecureBootX users and access roles
          </p>
        </div>

        <button
          onClick={fetchUsers}
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
                Total Users
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {totalUsers}
              </p>
            </div>

            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <UsersIcon size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Active Users
              </p>

              <p className="text-3xl font-bold text-green-600 mt-2">
                {activeUsers}
              </p>
            </div>

            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <UserCheck size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Inactive Users
              </p>

              <p className="text-3xl font-bold text-gray-600 mt-2">
                {inactiveUsers}
              </p>
            </div>

            <div className="p-3 bg-gray-100 text-gray-600 rounded-lg">
              <UserX size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Administrators
              </p>

              <p className="text-3xl font-bold text-purple-600 mt-2">
                {administrators}
              </p>
            </div>

            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <ShieldCheck size={24} />
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
              placeholder="Search users, email, role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Roles</option>
            <option value="Administrator">Administrator</option>
            <option value="Security Analyst">Security Analyst</option>
            <option value="User">User</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
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
            onClick={fetchUsers}
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
            Loading users from SecureBootX API...
          </p>

        </div>
      )}

      {/* Users Table */}
      {!loading && !error && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          <div className="px-6 py-4 border-b border-gray-200">

            <h2 className="font-semibold text-gray-900">
              User Management
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredUsers.length} of {users.length} users
            </p>

          </div>

          {filteredUsers.length === 0 ? (

            <div className="p-10 text-center">

              <UsersIcon
                size={40}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 text-gray-500">
                No users found.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="bg-gray-50 border-b border-gray-200">

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      User
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Email
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Role
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

                  {filteredUsers.map((user) => (

                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition"
                    >

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <UsersIcon size={20} />
                          </div>

                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>

                        </div>

                      </td>

                      <td className="px-6 py-4">

                        <p className="text-sm text-gray-700">
                          {user.email}
                        </p>

                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRoleClass(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <p className="text-sm text-gray-600">
                          {formatDate(user.created_at)}
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