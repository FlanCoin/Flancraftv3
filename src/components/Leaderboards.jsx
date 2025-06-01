import { useEffect, useState } from "react";
import { getLeaderboards } from "../api/getLeaderboards";
import "../styles/pages/_leaderboards.scss";

const SERVIDORES = [
  { id: "survival", nombre: "Survival"},
  { id: "oneblock", nombre: "OneBlock"},
  { id: "boxpvp", nombre: "BoxPvP"},
  { id: "anarquico", nombre: "Anárquico"},
  { id: "parkour", nombre: "Parkour"},
];

const STATS = ["bloques_minados", "mobs_matados", "saltos", "kills_pvp", "tiempo_jugado"];

const LABELS = {
  bloques_minados: "Bloques",
  mobs_matados: "Mobs",
  saltos: "Saltos",
  kills_pvp: "Kills PvP",
  tiempo_jugado: "Tiempo (h)",
};

export default function Leaderboards() {
  const [servidor, setServidor] = useState("survival");
  const [data, setData] = useState([]);
  const [orden, setOrden] = useState("tiempo_jugado");
  const [offset, setOffset] = useState(0);
  const limit = 10;

  useEffect(() => {
    getLeaderboards({ tipo: orden, servidor, limit, offset }).then((res) => {
      setData(res.resultados || []);
    });
  }, [orden, servidor, offset]);

  const formatearTiempo = (segundos) => `${(segundos / 3600).toFixed(1)} h`;

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
          >
            {s.nombre}
          </button>
        ))}
      </div>

      <div className="table-container">
        <div className="tabla-titulo">
          Los {data.length + offset} mejores - {LABELS[orden]}
        </div>
        <table className="tabla-epica">
          <thead>
            <tr>
              <th>Rango</th>
              <th>Jugador</th>
              {STATS.map((s) => (
                <th
                  key={s}
                  className={orden === s ? "activo" : ""}
                  onClick={() => setOrden(s)}
                >
                  {LABELS[s]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((player, i) => (
              <tr key={player.uuid} className={`fila fila-${i + 1}`}>
                <td>
                  {i < 3 ? (
                    <img
                      src={`/medallas/${i + 1}.svg`}
                      alt={`Top ${i + 1}`}
                      className="medalla"
                    />
                  ) : (
                    <span className="numero-rango">{offset + i + 1}</span>
                  )}
                </td>
                <td className="jugador-info">
                  <img
                    src={`https://mc-heads.net/avatar/${player.nombre_minecraft || "Steve"}/32`}
                    alt="skin"
                    className="avatar-head"
                  />
                  <span>{player.nombre_minecraft || "Desconocido"}</span>
                </td>
                {STATS.map((stat) => (
                  <td key={stat}>
                    {stat === "tiempo_jugado"
                      ? formatearTiempo(player[stat] || 0)
                      : (player[stat] || 0).toLocaleString("es-ES")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="epic-pagination">
        <button onClick={() => setOffset(Math.max(0, offset - limit))} disabled={offset === 0}>
          ← Anterior
        </button>
        <span>
          {offset + 1} - {offset + data.length}
        </span>
        <button onClick={() => setOffset(offset + limit)} disabled={data.length < limit}>
          Siguiente →
        </button>
      </div>
    </section>
  );
}
