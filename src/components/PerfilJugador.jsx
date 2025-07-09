// ...imports iguales
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from '../lib/supabaseClient';
import "../styles/pages/_perfiljugador.scss";
import topborder from "/assets/topborder.png";

export default function PerfilJugador() {
  const { nombre } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [estadisticas, setEstadisticas] = useState([]);
  const [sanciones, setSanciones] = useState([]);
  const [servidorActivo, setServidorActivo] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setCargando(true);
      let jugador = null;

      // 1. Buscar en estadísticas
      const { data: statsData } = await supabase
        .from("estadisticas_agrupadas")
        .select("*")
        .eq("nombre_minecraft", nombre);

      if (statsData && statsData.length > 0) {
        jugador = {
          nombre_minecraft: statsData[0].nombre_minecraft,
          uuid: statsData[0].uuid,
        };
        setEstadisticas(statsData);
        setServidorActivo(statsData[0].servidor);
      } else {
        // 2. Buscar en jails si no hay estadísticas
        const { data: jailData } = await supabase
          .from("jails")
          .select("uuid, name")
          .eq("name", nombre)
          .order("timestamp", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!jailData) {
          setUsuario(null);
          setCargando(false);
          return;
        }

        jugador = {
          nombre_minecraft: jailData.name,
          uuid: jailData.uuid !== "desconocido" ? jailData.uuid : null,
        };
      }

      // 3. Buscar en usuarios si hay UUID válido
      let userMeta = {};
      if (jugador.uuid && jugador.uuid.length > 5) {
        const { data } = await supabase
          .from("usuarios")
          .select("nivel, xp_actual, rango_usuario, es_premium")
          .eq("uuid", jugador.uuid)
          .maybeSingle();
        if (data) userMeta = data;
      }

      // 4. Buscar sanciones del jugador
      let sancionesData = [];
      try {
        const res = await fetch(`https://flancraftweb-backend.onrender.com/api/sanciones/jugador/${jugador.nombre_minecraft}`);
        sancionesData = await res.json();
      } catch (error) {
        console.error("Error al obtener sanciones:", error);
        sancionesData = [];
      }

      setUsuario({ ...jugador, ...userMeta });
      setSanciones(Array.isArray(sancionesData) ? sancionesData : []);
      setCargando(false);
    };

    fetchData();
  }, [nombre]);

  const formatearTiempo = (ticks) => {
    const totalSegundos = Math.floor((ticks || 0) / 20);
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    return `${horas}h ${minutos}m`;
  };

  const etiquetas = {
    bloques_minados: "Bloques minados",
    bloques_colocados: "Bloques colocados",
    mobs_matados: "Mobs matados",
    kills_pvp: "Kills PvP",
    muertes: "Muertes",
    tiempo_jugado: "Tiempo jugado",
  };

  if (cargando) return <div className="perfiljugador-loading">Cargando perfil...</div>;

  if (!usuario) {
    return (
      <div className="perfiljugador-wrapper no-encontrado">
        <div className="perfiljugador-card error">
          <img src="/assets/default-head.png" alt="No encontrado" className="perfiljugador-skin" />
          <h2>Jugador no encontrado</h2>
          <p>No hay estadísticas registradas para "{nombre}".</p>
          <button className="btn" onClick={() => navigate(-1)}>← Volver atrás</button>
        </div>
      </div>
    );
  }

  const servidoresDisponibles = [...new Set(estadisticas.map((e) => e.servidor))];
  const statsActuales = estadisticas.find((e) => e.servidor === servidorActivo);

  return (
    <div className="perfiljugador-wrapper">
      <div className="cabecera-imagen">
        <div className="perfiljugador-card">
          <img
            src={`https://mc-heads.net/body/${usuario.nombre_minecraft}/right`}
            alt={`Skin de ${usuario.nombre_minecraft}`}
            className="perfiljugador-skin"
          />
          <div className="perfiljugador-info">
            <h1 className={`nombre-jugador ${usuario.rango_usuario ? `rango-${usuario.rango_usuario.toLowerCase()}` : ""}`}>
              {usuario.nombre_minecraft}
              {usuario.es_premium && (
                <img src="/assets/premium.png" alt="Premium" className="icono-premium" />
              )}
            </h1>
            <p className="nivel">Nivel {usuario.nivel || 1}</p>
            <div className="xp-bar">
              <div
                className="xp-fill"
                style={{ width: `${Math.min((usuario.xp_actual || 0) / 100, 1) * 100}%` }}
              ></div>
            </div>
            <p className="xp-text">{usuario.xp_actual || 0} XP</p>
          </div>
        </div>

        {servidoresDisponibles.length > 0 && (
          <div className="selector-servidor">
            {servidoresDisponibles.map((s) => (
              <button
                key={s}
                className={`selector-btn ${servidorActivo === s ? "active" : ""}`}
                onClick={() => setServidorActivo(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="borde-inferior-imagen"></div>
      </div>

      <div className="decoracion-fondo-wrapper">
  <div className="estadisticas-top-decor">
    <img src={topborder} alt="Decoración superior" className="decor-top" />
    <div className="decor-borde-right" />
  </div>

        <div className="estadisticas-wrapper-decorada">
          {estadisticas.length > 0 && statsActuales ? (
            <div className="estadisticas-detalle">
              <h3 className="servidor-titulo">{statsActuales.servidor}</h3>
              <div className="stats-grid">
                {Object.entries(etiquetas).map(([clave, label]) => (
                  <div key={clave} className="stat-card">
                    <span className="label">{label}</span>
                    <span className="valor">
                      {clave === "tiempo_jugado"
                        ? formatearTiempo(statsActuales[clave])
                        : (statsActuales[clave] || 0).toLocaleString("es-ES")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="estadisticas-detalle vacio">
            <p className="mensaje-vacio">
              Este jugador no tiene estadísticas registradas.
            </p>
            </div>
          )}
          
        </div>
        

        <div className="sanciones-wrapper">
  <h3>Sanciones</h3>

  {sanciones.length === 0 ? (
    <div className="sancion-vacia">
      <p className="sin-sanciones">
        Este jugador es un ejemplo a seguir. No tiene ninguna sanción registrada.
      </p>
    </div>
  ) : (
    <ul className="sanciones-lista">
      {sanciones.map((s, i) => (
        <li
          key={i}
          className={`sancion-item ${String(s.duration).toLowerCase().includes("perma") ? "permaban" : ""}`}
        >
          <div className="sancion-cuerpo">
            <p><strong>Tipo:</strong> {s.type || "Sanción"}</p>
            <p><strong>Motivo:</strong> {s.observacion || "No especificado"}</p>
            <p><strong>Duración:</strong> {s.duration || "Desconocida"}</p>
            <p><strong>Staff:</strong> {s.moderator || "Desconocido"}</p>
            <p><strong>Servidor:</strong> {s.server || "N/A"}</p>
            <p><strong>Fecha:</strong> {s.timestamp ? new Date(Number(s.timestamp)).toLocaleString("es-ES") : "Sin fecha"}</p>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>


        <div className="volver-btn">
          <button className="btn" onClick={() => navigate(-1)}>
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  );
}
