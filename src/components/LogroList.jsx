import { useEffect, useState } from "react";
import "../styles/pages/dashboard/_logrolist.scss";

function LogroList({ user }) {
  const [logros, setLogros] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://flancraftweb-backend.onrender.com/api/logros/${user.uuid}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setLogros)
      .catch((err) => setError(err.message));
  }, [user.uuid]);

  const reclamarLogro = async (id_logro) => {
    try {
      const res = await fetch(
        `https://flancraftweb-backend.onrender.com/api/logros/reclamar/${id_logro}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uuid: user.uuid })
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al reclamar logro");
      alert("¡XP obtenida!");
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="logros-container">
      <h2>Logros</h2>
      {error ? (
        <p className="error">Error al cargar logros: {error}</p>
      ) : (
        <ul className="logros-list">
          {logros.map((logro) => (
            <li key={logro.id} className="logro-item">
              <div className="logro-info">
                <h4>{logro.nombre}</h4>
                <p>{logro.descripcion}</p>
                <div className="barra-progreso">
                  <div
                    className="progreso"
                    style={{
                      width: `${Math.min(100, (logro.progreso_actual / logro.objetivo) * 100)}%`
                    }}
                  ></div>
                </div>
                <p>
                  {logro.progreso_actual} / {logro.objetivo} — {logro.xp_otorgada} XP
                </p>
              </div>
              <div className="logro-acciones">
                {logro.completado && !logro.reclamado ? (
                  <button onClick={() => reclamarLogro(logro.id)}>
                    Reclamar XP
                  </button>
                ) : logro.reclamado ? (
                  <span className="reclamado">✅ Reclamado</span>
                ) : (
                  <span className="incompleto">⏳ En progreso</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LogroList;
