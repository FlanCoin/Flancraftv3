import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import RewardList from "./RewardList";
import LogroList from "./LogroList";
import { BarChart2, Swords } from "lucide-react";
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
      .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then(setUser)
      .catch((err) => setError(err.message || "Error"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const xpToNextLevel = user?.nivel ? user.nivel * 500 : 100;
  const avatarUrl = `https://minotar.net/armor/body/${user?.uid}/200.png`;

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
        {
          transform: `translate(${end.left - start.left}px, ${end.top - start.top}px)`,
          opacity: 0,
        },
      ],
      {
        duration: 800,
        easing: "ease-in-out",
      }
    );

    setTimeout(() => {
      fly.classList.add("hidden");
    }, 800);

    const oldXp = user.xp_actual;
    const newXp = Math.min(user.xp_actual + xp, xpToNextLevel);

    let current = oldXp;
    const animate = () => {
      current += Math.ceil(xp / 30);
      if (current >= newXp) {
        current = newXp;
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(animate);
      }
      setUser((prev) => ({ ...prev, xp_actual: current }));
    };
    let raf = requestAnimationFrame(animate);
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
          {/* SKIN + PANEL */}
          <div className="profile-container">
            <div className="skin-wrapper">
              <img
                src={avatarUrl}
                alt={`Skin de ${user.uid}`}
                className="skin-render"
              />
            </div>

            <div className="profile-panel">
              <div className="profile-right">
                <div className="username">{user.uid}</div>

                <div className="stat-row">
                  <Swords size={16} />
                  <span className="label">Nivel:</span>
                  <span className="value">{user.nivel}</span>
                </div>

                <div className="stat-row">
                  <BarChart2 size={16} />
                  <span className="label">XP:</span>
                  <span className="value">
                    {user.xp_actual} / {xpToNextLevel}
                  </span>
                </div>

                <progress
                  max={xpToNextLevel}
                  value={user.xp_actual}
                  ref={progressRef}
                ></progress>
              </div>
            </div>
          </div>

          {/* CONTENIDO: LOGROS + RECOMPENSAS */}
          <div className="dashboard-sections">
            <RewardList user={user} />
            <LogroList user={user} onXpClaimed={handleXpClaimed} />
            
          </div>
        </div>
      )}
    </div>
  );
}
