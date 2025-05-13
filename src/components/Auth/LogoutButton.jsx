import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("flan_user");
    navigate("/login");
  };

  return (
    <button className="dropdown-link logout-button" onClick={handleLogout}>
      <i className="fas fa-sign-out-alt" /> Cerrar sesión
    </button>
  );
}
