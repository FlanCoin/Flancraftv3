// ✅ DashboardPage.jsx FINAL — XP por nivel + progreso acumulado
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import RewardList from "./RewardList";
import LogroList from "./LogroList";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../styles/pages/dashboard/_dashboardpage.scss";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [xpData, setXpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const progressRef = useRef(null);
  const xpFlyRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("flan_user");
    if (!stored) return navigate("/");

    const parsed = JSON.parse(stored);
    if (!parsed.uuid || !parsed.loggedIn) return navigate("/");

    const cargarDatos = async () => {
      try {
        const [usuarioRes, monedasRes, xpRes] = await Promise.all([
          fetch(`https://flancraftweb-backend.onrender.com/api/usuarios/${parsed.uuid}`),
          fetch(`https://flancraftweb-backend.onrender.com/api/monedas/${parsed.uuid}`),
          fetch(`https://flancraftweb-backend.onrender.com/api/usuarios/${parsed.uuid}/xp`),
        ]);

        if (!usuarioRes.ok || !monedasRes.ok || !xpRes.ok)
          throw new Error("Error al cargar datos");

        const usuario = await usuarioRes.json();
        const monedas = await monedasRes.json();
        const xp = await xpRes.json();

        setUser({ ...usuario, monedas });
        setXpData(xp);
      } catch (err) {
        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [navigate]);

  const avatarUrl = `https://minotar.net/armor/body/${user?.uid}/200.png`;

  const nivelInfo = xpData?.niveles.find(n => n.nivel === user?.nivel);
  const xpDelNivelActual = nivelInfo?.xp_requerida || 1;
  const porcentajeNivel = (user?.xp_actual / xpDelNivelActual) * 100;

  return (
    <div className="dashboard-wrapper">
      <div className="xp-fly hidden" id="xp-fly" ref={xpFlyRef}></div>

      {loading ? (
        <p className="loading">Cargando perfil...</p>
      ) : error ? (
        <p className="error">Error al cargar perfil: {error}</p>
      ) : (
        <div className="dashboard-content">
          <div className="profile-container">
            <div className="skin-wrapper">
              <div className="avatar-frame">
                <img src={avatarUrl} alt={`Skin de ${user.uid}`} className="skin-render" />
              </div>
            </div>

            <div className="profile-panel">
              <div className="profile-info">
                <h1 className="username fancy-font">{user.uid}</h1>

                <div className="xp-block">
                  <div className="xp-circle-wrapper">
                    <CircularProgressbar
                      value={porcentajeNivel}
                      text={`${user.nivel}`}
                      strokeWidth={10}
                      styles={buildStyles({
                        pathColor: "#22c55e",
                        textColor: "#0f172a",
                        trailColor: "#fef9c3",
                        textSize: "24px",
                      })}
                      ref={progressRef}
                    />
                  </div>
                  <p className="xp-label">
                    {user.xp_actual} / {xpDelNivelActual} XP
                  </p>
                </div>

                {user.monedas && (
                  <>
                    <div className="eco-highlight">
                      <span className="eco-label">ECOS:</span>
                      <span className="eco-value">{user.monedas.ecos}</span>
                      <img src="/assets/eco.png" alt="ECO" className="eco-icon" />
                    </div>

                    <div className="dolares-block">
                      <div className="label">💰 Dólares por servidor:</div>
                      <ul className="dolares-list">
                        {Object.entries(user.monedas.dolares).map(([servidor, cantidad]) => (
                          <li key={servidor}><strong>{servidor}</strong>: {cantidad}$</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="dashboard-sections">
            <RewardList user={user} xpData={xpData} />
            <LogroList user={user} />
          </div>
        </div>
      )}
    </div>
  );
}