import { useEffect, useState } from "react";
import { getLeaderboards } from "../api/getLeaderboards";
import "../styles/pages/_leaderboards.scss";

const SERVIDORES = [
  { id: "survival", nombre: "Survival" },
  { id: "oneblock", nombre: "OneBlock" },
  { id: "boxpvp", nombre: "BoxPvP" },
  { id: "anarquico", nombre: "Anárquico" },
  { id: "parkour", nombre: "Parkour" },
];

const STATS = [
  "bloques_minados",
  "bloques_colocados",
  "mobs_matados",
  "kills_pvp",
  "muertes",
  "tiempo_jugado",
];

const LABELS = {
  bloques_minados: "Minados",
  bloques_colocados: "Colocados",
  mobs_matados: "Mobs",
  kills_pvp: "Kills PvP",
  muertes: "Muertes",
  tiempo_jugado: "Tiempo (h)",
};

const TOOLTIP_DESCRIPCIONES = {
  bloques_minados: "Cantidad total de bloques rotos con herramientas.",
  bloques_colocados: "Número de bloques colocados en el mundo.",
  mobs_matados: "Mobs (hostiles y pasivos) eliminados.",
  kills_pvp: "Jugadores eliminados en combate.",
  muertes: "Número total de veces que has muerto.",
  tiempo_jugado: "Horas totales jugadas en este servidor.",
};

export default function Leaderboards() {
  const [servidor, setServidor] = useState("survival");
  const [data, setData] = useState([]);
  const [datosVisibles, setDatosVisibles] = useState([]);
  const [orden, setOrden] = useState("tiempo_jugado");
  const [ordenAscendente, setOrdenAscendente] = useState(false);
  const [offset, setOffset] = useState(0);
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [animacion, setAnimacion] = useState("");
  const [proximosDatos, setProximosDatos] = useState(null);
  const [usuariosVinculados, setUsuariosVinculados] = useState({});
  const limit = 10;

  useEffect(() => {
    fetch("https://flancraftweb-backend.onrender.com/api/usuarios")
      .then((res) => res.json())
      .then((usuarios) => {
        const mapa = {};
        usuarios.forEach((u) => {
          if (u.uuid) {
            mapa[u.uuid] = {
              rango: u.rango_usuario?.toLowerCase() || null,
              premium: u.es_premium === true
            };
          }
        });
        setUsuariosVinculados(mapa);
      })
      .catch((err) => console.error("Error al obtener usuarios:", err));
  }, []);

  useEffect(() => {
    let cancelado = false;
    setAnimacion("fade-out");

    const timeout = setTimeout(() => {
      if (cancelado) return;

      getLeaderboards({ tipo: orden, servidor, limit, offset }).then((res) => {
        if (cancelado) return;

        const lista = res.resultados || [];
        const ordenada = ordenAscendente
          ? [...lista].sort((a, b) => (a[orden] || 0) - (b[orden] || 0))
          : [...lista].sort((a, b) => (b[orden] || 0) - (a[orden] || 0));

        setProximosDatos(ordenada);

        setTimeout(() => {
          if (cancelado) return;
          setDatosVisibles(ordenada);
          setAnimacion("fade-in");
          setTimeout(() => setAnimacion(""), 1000);
        }, 10);
      });
    }, 500);

    return () => {
      cancelado = true;
      clearTimeout(timeout);
    };
  }, [orden, servidor, offset, ordenAscendente]);

  useEffect(() => {
    setFilaSeleccionada(null);
  }, [servidor, offset]);

  const formatearTiempo = (ticks) => {
    const totalSegundos = Math.floor(ticks / 20);
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    return `${horas}h ${minutos}m`;
  };

  const formatValue = (key, value) =>
    key === "tiempo_jugado"
      ? formatearTiempo(value || 0)
      : (value || 0).toLocaleString("es-ES");

  const cambiarOrden = (stat) => {
    if (stat === orden) {
      setOrdenAscendente(!ordenAscendente);
    } else {
      setOrden(stat);
      setOrdenAscendente(false);
    }
  };

  return (
    <section className="leaderboard-epic">
      <div className="epic-header">
        <h1>Hall de la Fama</h1>
        <p>
          Solo los más constantes y valientes llegan a figurar aquí. Este leaderboard honra a todos los jugadores que han dejado su marca en los mundos de FlanCraft.
        </p>
      </div>

      <div className="selector-panel">
        {SERVIDORES.map((s) => (
          <button
            key={s.id}
            className={`selector-button ${servidor === s.id ? "active" : ""}`}
            onClick={() => {
              setServidor(s.id);
              setOffset(0);
            }}
            aria-label={`Cambiar a ${s.nombre}`}
          >
            {s.nombre}
          </button>
        ))}
      </div>

      <div className="table-container">
        <div className="tabla-titulo">
          Top {limit} - {LABELS[orden]} <span className="flecha-orden">{ordenAscendente ? "▲" : "▼"}</span>
        </div>

        <table className="tabla-epica">
          <thead>
            <tr>
              <th scope="col">Rango</th>
              <th scope="col">Jugador</th>
              {STATS.map((s) => (
                <th
                  key={s}
                  className={`ordenable ${orden === s ? "activo" : ""}`}
                  onClick={() => cambiarOrden(s)}
                  title={`${LABELS[s]} — ${TOOLTIP_DESCRIPCIONES[s]}`}
                  scope="col"
                >
                  {LABELS[s]}
                  {orden === s && (
                    <span className="flecha-orden">{ordenAscendente ? "▲" : "▼"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={
            animacion === "fade-out"
              ? "tbody-animado-salida"
              : animacion === "fade-in"
              ? "tbody-animado-entrada"
              : ""
          }>
            {datosVisibles.map((player, i) => {
              const posicionGlobal = offset + i;
              const filaClase = `fila fila-${posicionGlobal + 1}${filaSeleccionada === player.uuid ? " seleccionada" : ""}`;
              const medallaSrc =
                posicionGlobal === 0
                  ? "/assets/oro.png"
                  : posicionGlobal === 1
                  ? "/assets/plata.png"
                  : posicionGlobal === 2
                  ? "/assets/bronce.png"
                  : null;
              const datosUsuario = usuariosVinculados[player.uuid];
              const rango = datosUsuario?.rango;
              const esPremium = datosUsuario?.premium;

              return (
                <tr
                  key={`${player.uuid}-${orden}-${offset}`}
                  className={`${filaClase} anim-row`}
                  onClick={() =>
                    setFilaSeleccionada((prev) => (prev === player.uuid ? null : player.uuid))
                  }
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <td>
                    {medallaSrc ? (
                      <img src={medallaSrc} alt={`Top ${posicionGlobal + 1}`} className="medalla" />
                    ) : (
                      <span className="numero-rango">{posicionGlobal + 1}</span>
                    )}
                  </td>
                  <td>
                    <div className="jugador-info">
                      <img
                        src={`https://mc-heads.net/avatar/${player.nombre_minecraft || "Steve"}/32`}
                        onError={(e) => (e.currentTarget.src = "/assets/default-head.png")}
                        alt={`Avatar de ${player.nombre_minecraft || "Desconocido"}`}
                        className="avatar-head"
                      />
                      <span
                        className={rango ? `nombre-colored rango-${rango}` : ""}
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                      >
                        {player.nombre_minecraft || "Desconocido"}
                        {esPremium && (
                          <img
                            src="/assets/premium.png"
                            alt="Premium"
                            className="icono-premium"
                          />
                        )}
                      </span>
                    </div>
                  </td>
                  {STATS.map((stat) => (
                    <td key={stat}>{formatValue(stat, player[stat])}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="epic-pagination paginador-numerico">
        <button onClick={() => setOffset(0)} disabled={offset === 0} aria-label="Primera página">«</button>
        <button onClick={() => setOffset(Math.max(0, offset - limit))} disabled={offset === 0} aria-label="Anterior">‹</button>
        {[...Array(10)].map((_, index) => {
          const pageIndex = index * limit;
          const pageNumber = index + 1;
          return (
            <button
              key={index}
              className={offset === pageIndex ? "activo" : ""}
              onClick={() => setOffset(pageIndex)}
            >
              {pageNumber}
            </button>
          );
        })}
        <button onClick={() => setOffset(offset + limit)} disabled={offset + limit >= 10 * limit} aria-label="Siguiente">›</button>
        <button onClick={() => setOffset((10 - 1) * limit)} disabled={offset + limit >= 10 * limit} aria-label="Última página">»</button>
      </div>
    </section>
  );
}