import { useEffect, useState, useRef } from "react";
import { CheckCircle, Clock, Gift } from "lucide-react";
import "../styles/pages/dashboard/_dashboardpage.scss";

function LogroList({ user, onXpClaimed }) {
  const [logros, setLogros] = useState([]);
  const [error, setError] = useState(null);
  const [reclamadoId, setReclamadoId] = useState(null);
  const [cargandoId, setCargandoId] = useState(null);

  // Refs por cada botón de logro
  const buttonRefs = useRef({});

  useEffect(() => {
    fetch(`https://flancraftweb-backend.onrender.com/api/logros/${user.uuid}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setLogros)
      .catch((err) => setError(err.message));
  }, [user.uuid]);

  const reclamarLogro = async (id_logro, xp_otorgada) => {
    try {
      setCargandoId(id_logro);
      const res = await fetch(
        `https://flancraftweb-backend.onrender.com/api/logros/reclamar/${id_logro}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uuid: user.uuid }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al reclamar logro");

      setReclamadoId(id_logro);
      setLogros((prev) =>
        prev.map((logro) =>
          logro.id === id_logro ? { ...logro, reclamado: true } : logro
        )
      );

      // Sonido de éxito
      const xpSound = new Audio("/sounds/success.mp3");
      xpSound.volume = 0.5;
      xpSound.play();

      // Ejecutar animación desde LogroList hacia XP bar en Dashboard
      const sourceButton = buttonRefs.current[id_logro];
      if (onXpClaimed) {
        onXpClaimed(xp_otorgada, sourceButton);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setCargandoId(null);
    }
  };

  return (
    <div className="logros-container">
      <h2>Logros del Jugador</h2>

      {error ? (
        <p className="error">Error al cargar logros: {error}</p>
      ) : (
        <ul className="logros-list">
          {logros.map((logro) => {
            const progresoPercent = Math.min(
              100,
              (logro.progreso_actual / logro.objetivo) * 100
            );

            return (
              <li
                key={logro.id}
                className={`logro-item ${logro.completado ? "completado" : ""}`}
              >
                <div className="logro-info">
                  <h4>{logro.nombre || logro.tipo}</h4>
                  <p>{logro.descripcion || "Progreso de logro"}</p>
                  <div className="barra-progreso">
                    <div
                      className="progreso"
                      style={{ width: `${progresoPercent}%` }}
                    ></div>
                  </div>
                  <p className="progreso-texto">
                    {logro.progreso_actual} / {logro.objetivo} —{" "}
                    <Gift size={16} /> {logro.xp_otorgada} XP
                  </p>
                </div>

                <div className="logro-acciones">
                  {logro.completado && !logro.reclamado ? (
                    <button
                      ref={(el) => (buttonRefs.current[logro.id] = el)}
                      onClick={() =>
                        reclamarLogro(logro.id, logro.xp_otorgada)
                      }
                      disabled={cargandoId === logro.id}
                    >
                      {cargandoId === logro.id
                        ? "Reclamando..."
                        : "Reclamar XP"}
                    </button>
                  ) : logro.reclamado || logro.id === reclamadoId ? (
                    <span className="reclamado">
                      <CheckCircle size={16} /> Reclamado
                    </span>
                  ) : (
                    <span className="incompleto">
                      <Clock size={16} /> En progreso
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default LogroList;
