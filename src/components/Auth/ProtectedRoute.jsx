import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const uid = localStorage.getItem("flan_uid");

  if (!uid) return <Navigate to="/login" />;
  return children;
}
