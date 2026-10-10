
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const user =
    localStorage.getItem("securebootx_user") ||
    sessionStorage.getItem("securebootx_user");

  const token =
    localStorage.getItem("securebootx_token") ||
    sessionStorage.getItem("securebootx_token");

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  try {
    JSON.parse(user);
  } catch {
    localStorage.removeItem("securebootx_user");
    sessionStorage.removeItem("securebootx_user");
    localStorage.removeItem("securebootx_token");
    sessionStorage.removeItem("securebootx_token");

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;