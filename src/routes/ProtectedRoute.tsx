import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const user =
    localStorage.getItem("securebootx_user") ||
    sessionStorage.getItem("securebootx_user");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;