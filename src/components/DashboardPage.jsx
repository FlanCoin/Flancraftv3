import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RewardList from "./RewardList";
import LogroList from "./LogroList"; // ✅ IMPORTACIÓN CORRECTA
import "../styles/pages/dashboard/_dashboardpage.scss";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("flan_user");
    if (!stored) {
      navigate("/");
      return;
    }

    const parsed = JSON.parse(stored);
    if (!parsed.uuid || !parsed.loggedIn) {
      navigate("/");
      return;
    }

    fetch(`https://flancraftweb-backend.onrender.com/api/usuarios/${parsed.uuid}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setUser(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div className="dashboard-container">
      {loading ? (
        <p className="dashboard-loading">Cargando datos del usuario...</p>
      ) : error ? (
        <p className="dashboard-error">Error al cargar usuario: {error}</p>
      ) : (
        <>
          <h1>Bienvenido, {user.uid}</h1>
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>UUID</h3>
              <p>{user.uuid}</p>
            </div>
            <div className="dashboard-card">
              <h3>Nivel</h3>
              <p>{user.nivel}</p>
            </div>
            <div className="dashboard-card">
              <h3>XP</h3>
              <p>{user.xp_actual} / {user.xp_total || 100}</p>
            </div>
          </div>

          {/* Logros */}
          <LogroList user={user} />

          {/* Recompensas escalables */}
          <RewardList user={user} />
        </>
      )}
    </div>
  );
}
