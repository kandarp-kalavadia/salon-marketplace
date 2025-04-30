import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ExtendedUserProfile } from "../context/AuthContextProvider";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  console.log("ProtectedRoute called");

  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/unauthorized" replace />;
  }

  const roles = (user.profile as ExtendedUserProfile).roles;

  if (!roles || !allowedRoles.some((role) => roles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
