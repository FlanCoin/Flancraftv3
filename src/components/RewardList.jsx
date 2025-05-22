import { useEffect, useRef, useState } from "react";
import { Lock, CheckCircle, Gift, ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/pages/dashboard/_rewardlist.scss";

export default function RewardList({ user }) {
  const [reclamadas, setReclamadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scrollRef = useRef(null);

  const recompensas = [
    { nivel: 1, descripcion: "100 ECOS" },
    { nivel: 5, descripcion: "200 ECOS" },
    { nivel: 10, descripcion: "300 ECOS" },
    { nivel: 15, descripcion: "500 ECOS" },
    { nivel: 20, descripcion: "1000 ECOS" },
    { nivel: 25, descripcion: "Caja Legendaria" },
    { nivel: 30, descripcion: "2500 ECOS" }
  ];

  useEffect(() => {
    fetch(`https://flancraftweb-backend.onrender.com/api/recompensas/reclamadas/${user.uuid}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setReclamadas(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.uuid]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

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

  if (loading) return <p>Cargando recompensas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="reward-list">
      <h2>
        <Gift size={20} />
        Recompensas de Nivel
      </h2>

      <div className="reward-track-container">
        <div className="reward-fade-left" onClick={scrollLeft}><ChevronLeft /></div>
        <div className="reward-fade-right" onClick={scrollRight}><ChevronRight /></div>

        <div className="reward-track" ref={scrollRef}>
          {recompensas.map((r) => {
            const yaReclamada = reclamadas.includes(r.nivel);
            const alcanzado = user.nivel >= r.nivel;

            const estadoClass = yaReclamada
              ? "claimed"
              : alcanzado
              ? "claimable"
              : "locked";

            return (
              <div key={r.nivel} className={`reward-card ${estadoClass}`}>
                <span className="nivel">Nivel {r.nivel}</span>
                <div className="reward-icon">
                  <Gift size={20} />
                </div>
                <span className="descripcion">{r.descripcion}</span>

                <div className="estado">
                  {yaReclamada ? (
                    <>
                      <CheckCircle size={14} />
                      Reclamada
                    </>
                  ) : alcanzado ? (
                    <button onClick={() => handleReclamar(r.nivel)}>
                      Reclamar
                    </button>
                  ) : (
                    <>
                      <Lock size={14} />
                      Bloqueada
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
