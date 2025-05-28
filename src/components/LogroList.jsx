import { useEffect, useState, useRef } from "react";
import { CheckCircle, Clock, Gift, ArrowDown, ArrowUp, Filter } from "lucide-react";
import "../styles/pages/dashboard/_logrolist.scss";

const SERVIDORES = [
  { nombre: "Todos", valor: null },
  { nombre: "Survival", valor: "survival" },
  { nombre: "OneBlock", valor: "oneblock" },
  { nombre: "BoxPVP", valor: "boxpvp" },
  { nombre: "Creativo", valor: "creativo" },
  { nombre: "Anárquico", valor: "anarquico" },
];

const CRITERIOS = [
  { nombre: "Completados primero", valor: "completado" },
  { nombre: "XP descendente", valor: "xp-desc" },
  { nombre: "XP ascendente", valor: "xp-asc" },
  { nombre: "Progreso descendente", valor: "progreso-desc" },
  { nombre: "Progreso ascendente", valor: "progreso-asc" },
];

function LogroList({ user, onXpClaimed }) {
  const [logros, setLogros] = useState([]);
  const [error, setError] = useState(null);
  const [reclamadoId, setReclamadoId] = useState(null);
  const [cargandoId, setCargandoId] = useState(null);
  const [servidorActivo, setServidorActivo] = useState(null);
  const [criterio, setCriterio] = useState("completado");
  const buttonRefs = useRef({});

  useEffect(() => {
    const param = servidorActivo ? `?servidor=${servidorActivo}` : "";
    fetch(`https://flancraftweb-backend.onrender.com/api/logros/${user.uuid}${param}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setLogros)
      .catch((err) => setError(err.message));
  }, [user.uuid, servidorActivo]);

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

      const xpSound = new Audio("/assets/sounds/success.mp3");
      xpSound.volume = 0.5;
      xpSound.play();

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

  const ordenarLogros = (lista) => {
    switch (criterio) {
      case "xp-desc":
        return [...lista].sort((a, b) => b.xp_otorgada - a.xp_otorgada);
      case "xp-asc":
        return [...lista].sort((a, b) => a.xp_otorgada - b.xp_otorgada);
      case "progreso-desc":
        return [...lista].sort(
          (a, b) =>
            b.progreso_actual / b.objetivo - a.progreso_actual / a.objetivo
        );
      case "progreso-asc":
        return [...lista].sort(
          (a, b) =>
            a.progreso_actual / a.objetivo - b.progreso_actual / b.objetivo
        );
      case "completado":
      default:
        return [...lista].sort((a, b) => {
          if (a.completado === b.completado) return 0;
          return a.completado ? -1 : 1;
        });
    }
  };

  return (
    <div className="logros-container">
      <h2>Logros de Flancraft</h2>

      <div className="filtros-servidor">
        {SERVIDORES.map(({ nombre, valor }) => (
          <button
            key={nombre}
            className={valor === servidorActivo ? "activo" : ""}
            onClick={() => setServidorActivo(valor)}
          >
            {nombre}
          </button>
        ))}
      </div>

      <div className="filtros-orden">
        <Filter size={18} />
        <select value={criterio} onChange={(e) => setCriterio(e.target.value)}>
          {CRITERIOS.map((c) => (
            <option key={c.valor} value={c.valor}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <p className="error">Error al cargar logros: {error}</p>
      ) : (
        <ul className="logros-list">
          {ordenarLogros(logros).map((logro) => {
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
                    {logro.progreso_actual} / {logro.objetivo} — <Gift size={16} /> {logro.xp_otorgada} XP
                  </p>
                </div>

                <div className="logro-acciones">
                  {logro.completado && !logro.reclamado ? (
                    <button
                      ref={(el) => (buttonRefs.current[logro.id] = el)}
                      onClick={() => reclamarLogro(logro.id, logro.xp_otorgada)}
                      disabled={cargandoId === logro.id}
                    >
                      {cargandoId === logro.id ? "Reclamando..." : "Reclamar XP"}
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
