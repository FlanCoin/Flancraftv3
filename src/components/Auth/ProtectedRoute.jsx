import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <div className="text-center p-8">Cargando sesión...</div>;
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return children;
}
