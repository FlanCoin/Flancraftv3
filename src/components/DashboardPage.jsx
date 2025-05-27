import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import RewardList from "./RewardList";
import LogroList from "./LogroList";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../styles/pages/dashboard/_dashboardpage.scss";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
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
        const [usuarioRes, monedasRes] = await Promise.all([
          fetch(`https://flancraftweb-backend.onrender.com/api/usuarios/${parsed.uuid}`),
          fetch(`https://flancraftweb-backend.onrender.com/api/monedas/${parsed.uuid}`),
        ]);

        if (!usuarioRes.ok || !monedasRes.ok) throw new Error("Error al cargar datos");

        const usuario = await usuarioRes.json();
        const monedas = await monedasRes.json();

        setUser({ ...usuario, monedas });
      } catch (err) {
        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [navigate]);

  const xpToNextLevel = user?.nivel ? user.nivel * 500 : 100;
  const avatarUrl = `https://minotar.net/armor/body/${user?.uid}/200.png`;

  const getNivelClass = (nivel) => {
    if (nivel >= 50) return "nivel-glow-5";
    if (nivel >= 40) return "nivel-glow-4";
    if (nivel >= 30) return "nivel-glow-3";
    if (nivel >= 20) return "nivel-glow-2";
    if (nivel >= 10) return "nivel-glow-1";
    return "nivel-glow-0";
  };

  const handleXpClaimed = (xp, sourceButton) => {
    if (!user || !progressRef.current || !xpFlyRef.current) return;
    const start = sourceButton.getBoundingClientRect();
    const end = progressRef.current.getBoundingClientRect();
    const fly = xpFlyRef.current;

    fly.classList.remove("hidden");
    fly.style.top = `${start.top + window.scrollY}px`;
    fly.style.left = `${start.left + window.scrollX}px`;

    fly.animate(
      [
        { transform: "translate(0, 0)", opacity: 1 },
        { transform: `translate(${end.left - start.left}px, ${end.top - start.top}px)`, opacity: 0 },
      ],
      { duration: 800, easing: "ease-in-out" }
    );

    setTimeout(() => fly.classList.add("hidden"), 800);

    const oldXp = user.xp_actual;
    const newXp = Math.min(oldXp + xp, xpToNextLevel);
    let current = oldXp;
    let raf = requestAnimationFrame(function animate() {
      current += Math.ceil(xp / 30);
      if (current >= newXp) {
        current = newXp;
        cancelAnimationFrame(raf);

        if (newXp >= xpToNextLevel && user.nivel) {
          const fireworks = document.createElement('div');
          fireworks.className = 'level-up-fireworks';
          document.body.appendChild(fireworks);
          setTimeout(() => fireworks.remove(), 2000);
        }
      } else {
        raf = requestAnimationFrame(animate);
      }
      setUser((prev) => ({ ...prev, xp_actual: current }));
    });
  };

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
                      value={(user.xp_actual / xpToNextLevel) * 100}
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
                  <p className="xp-label">{user.xp_actual} / {xpToNextLevel} XP</p>
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
            <RewardList user={user} />
            <LogroList user={user} onXpClaimed={handleXpClaimed} />
          </div>
        </div>
      )}
    </div>
  );
}
