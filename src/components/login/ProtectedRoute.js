import { Navigate } from "react-router-dom";
import { getUserType } from "../../utils/auth";

export default function ProtectedRoute({ allowed, children }) {
  const role = getUserType();

  if (!role) return <Navigate to="/login" replace />;
  if (!allowed.includes(role)) return <Navigate to="/" replace />;

  return children;
}
