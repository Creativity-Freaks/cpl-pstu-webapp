import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type ProtectedRouteProps = {
  allowRoles?: Array<"admin" | "player">;
  redirectTo?: string;
};

const ProtectedRoute = ({ allowRoles, redirectTo = "/auth" }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) return null; // could render a spinner

  if (!user) return <Navigate to={redirectTo} replace />;

  if (allowRoles && !allowRoles.includes(user.role)) {
    // If authenticated but lacks role, send to home or dashboard
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
