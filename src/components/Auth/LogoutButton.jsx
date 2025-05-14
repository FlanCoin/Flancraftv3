// src/components/Auth/LogoutButton.jsx
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("flan_user");
    navigate("/");
    window.location.reload();
  };

  return (
    <button onClick={handleLogout} className="dropdown-link logout-btn">
      <i className="fas fa-sign-out-alt" /> Cerrar sesión
    </button>
  );
}
