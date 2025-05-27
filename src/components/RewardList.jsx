import { useEffect, useState, useRef } from "react";
import { Lock, CheckCircle } from "lucide-react";
import "../styles/pages/dashboard/_rewardlist.scss";

export default function RewardList({ user }) {
  const [reclamadas, setReclamadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  const recompensas = [
    { nivel: 1, descripcion: "100 ECOS", tipo: "eco" },
    { nivel: 5, descripcion: "200 ECOS", tipo: "eco" },
    { nivel: 10, descripcion: "300 ECOS", tipo: "eco" },
    { nivel: 15, descripcion: "500 ECOS", tipo: "eco" },
    { nivel: 20, descripcion: "1000 ECOS", tipo: "eco" },
    { nivel: 25, descripcion: "10000$", tipo: "dolar" },
    { nivel: 30, descripcion: "2500 ECOS", tipo: "eco" }
  ];

  useEffect(() => {
    fetch(`https://flancraftweb-backend.onrender.com/api/recompensas/reclamadas/${user.uuid}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setReclamadas(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.uuid]);

  const handleReclamar = async (nivel) => {
    try {
      const res = await fetch("https://flancraftweb-backend.onrender.com/api/recompensas/reclamar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid: user.uuid, nivel })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReclamadas([...reclamadas, nivel]);
    } catch (err) {
      console.error("Error reclamando recompensa:", err.message);
    }
  };

  const calcularProgreso = (nivel) => {
    if (nivel < user.nivel) return "progresado";
    if (nivel === user.nivel + 1) return "siguiente";
    return "pendiente";
  };

  const calcularProgresoReal = () => {
    if (!user) return 0;
    const xpActual = user.xp_actual || 0;
    const nivelActual = user.nivel || 1;
    const xpToNextLevel = nivelActual * 500;
    const porcentajeXP = Math.min((xpActual / xpToNextLevel) * 100, 100);
    return porcentajeXP;
  };

  const progreso = calcularProgresoReal();

  const scrollBy = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 300, behavior: "smooth" });
    }
  };

  return (
    <div className="reward-pass">
      <h2 className="titulo-reward">Recompensas de Nivel</h2>

      <div className="rewards-scroll-container">
        <div className="scroll-button scroll-left" onClick={() => scrollBy(-1)} />
        <div className="scroll-button scroll-right" onClick={() => scrollBy(1)} />
        <div className="fade-left" />
        <div className="fade-right" />

        <div className="rewards-wrapper" ref={scrollRef}>
          <div className="progreso-container">
            <div className="linea-fondo"></div>
            <div className="linea-relleno" style={{ width: `${progreso}%` }}></div>
          </div>

          <div className="rewards-row">
            {recompensas.map((r, i) => {
              const yaReclamada = reclamadas.includes(r.nivel);
              const alcanzado = user.nivel >= r.nivel;
              const icono = r.tipo === "eco"
                ? <img src="/assets/eco.png" alt="ECO" />
                : <img src="/assets/dolar.png" alt="Dolar" />;

              return (
                <div key={i} className="reward-slot">
                  <div className={`reward-box ${alcanzado ? "unlocked" : "locked"} ${yaReclamada ? "claimed" : ""}`}>
                    <div className="reward-icon">{alcanzado ? icono : <Lock size={20} />}</div>
                    <div className="reward-desc">{r.descripcion}</div>
                    <div className="reward-nivel">Nivel {r.nivel}</div>
                    {alcanzado && !yaReclamada && (
                      <button onClick={() => handleReclamar(r.nivel)} className="reclamar-btn">Reclamar</button>
                    )}
                    {yaReclamada && (
                      <div className="claimed-status">
                        <CheckCircle size={14} /> Reclamada
                      </div>
                    )}
                  </div>
                  <div className={`nodo ${calcularProgreso(r.nivel)}`}>
                    <span>{r.nivel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="xp-indicador">
        {user.xp_actual} / {user.nivel * 500} XP
      </div>

      {loading && <p className="estado">Cargando recompensas...</p>}
      {error && <p className="estado error">Error: {error}</p>}
    </div>
  );
}
