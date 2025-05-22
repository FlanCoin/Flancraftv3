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
  const progressRef = useRef(null); // ✅ barra de XP accesible
  const xpFlyRef = useRef(null);    // ✅ bolita animada

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
      .then((res) => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(setUser)
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  const xpToNextLevel = user?.nivel ? user.nivel * 500 : 100;
  const avatarUrl = `https://minotar.net/armor/body/${user?.uid}/200.png`;

  // ✅ llamada desde LogroList
  const handleXpClaimed = (xp, sourceButton) => {
    if (!user || !progressRef.current || !xpFlyRef.current) return;

    // ⚡ animar bolita
    const start = sourceButton.getBoundingClientRect();
    const end = progressRef.current.getBoundingClientRect();

    const fly = xpFlyRef.current;
    fly.classList.remove("hidden");
    fly.style.top = `${start.top + window.scrollY}px`;
    fly.style.left = `${start.left + window.scrollX}px`;

    fly.animate([
      { transform: "translate(0, 0)", opacity: 1 },
      {
        transform: `translate(${end.left - start.left}px, ${end.top - start.top}px)`,
        opacity: 0,
      },
    ], {
      duration: 800,
      easing: "ease-in-out"
    });

    setTimeout(() => {
      fly.classList.add("hidden");
    }, 800);

    // ⏫ animar suma
    const oldXp = user.xp_actual;
    const newXp = Math.min(user.xp_actual + xp, xpToNextLevel);

    let startVal = oldXp;
    const step = () => {
      startVal += Math.ceil((xp / 30)); // animar en 30 frames
      if (startVal >= newXp) {
        startVal = newXp;
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(step);
      }
      setUser((prev) => ({ ...prev, xp_actual: startVal }));
    };
    let raf = requestAnimationFrame(step);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-hypixel">
        {loading ? (
          <p className="loading">Cargando perfil...</p>
        ) : error ? (
          <p className="error">Error al cargar perfil: {error}</p>
        ) : (
          <>
            {/* XP ANIMATION ELEMENT */}
            <div id="xp-fly" className="xp-fly hidden" ref={xpFlyRef}></div>

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

            {/* SECCIONES */}
            <div className="dashboard-sections">
              <LogroList user={user} onXpClaimed={handleXpClaimed} />
              <RewardList user={user} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
