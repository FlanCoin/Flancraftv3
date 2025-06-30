import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import {
  Tree, Fire, PaintBrush, Cube, CrownSimple, Sword,
  PersonSimpleRun, Globe, WarningCircle, CheckCircle, HourglassMedium
} from 'phosphor-react';

import useIsMobile from '../../hooks/useIsMobile';
import '../../styles/pages/_tribunalmain.scss';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export default function Sanciones() {
  const [sanciones, setSanciones] = useState([]);
  const [filtroJugador, setFiltroJugador] = useState('');
  const [jugadoresBaneados, setJugadoresBaneados] = useState([]);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('jails')
        .select('*')
        .order('timestamp', { ascending: false });
      setSanciones(data || []);

      const baneados = data
        ?.filter(s => s.estado === 'baneado')
        .map(s => s.name.toLowerCase());
      setJugadoresBaneados([...new Set(baneados)]);
    }
    fetchData();
  }, []);

  const contarStrikes = (jugador, tipo) =>
    sanciones.filter((s) => s.name === jugador && s.type === tipo).length;

  const obtenerNombreServidor = (raw) => {
    const mapa = {
      survival: 'Survival',
      anarquico: 'Anárquico',
      creativo: 'Creativo',
      oneblock: 'OneBlock',
      kingdoms: 'Kingdoms',
      boxpvp: 'BoxPvP',
      parkour: 'Parkour',
      'play.flancraft.com': 'Lobby',
    };
    return mapa[raw?.toLowerCase()] || 'Lobby';
  };

  const obtenerIconoServidor = (server) => {
    const base = { size: 16, weight: 'bold', style: { marginRight: '6px' } };
    const iconos = {
      survival: <Tree {...base} />,
      anarquico: <Fire {...base} />,
      creativo: <PaintBrush {...base} />,
      oneblock: <Cube {...base} />,
      kingdoms: <CrownSimple {...base} />,
      boxpvp: <Sword {...base} />,
      parkour: <PersonSimpleRun {...base} />,
      'play.flancraft.com': <Globe {...base} />,
    };
    return iconos[server?.toLowerCase()] || <Globe {...base} />;
  };


  const formatearDuracion = (raw) => {
    if (!raw) return 'Desconocida';
    const match = raw.toLowerCase().match(/(\d+)([smhd])/);
    if (!match) return raw;
    const val = parseInt(match[1], 10);
    const unit = match[2];
    const map = { s: 'segundo', m: 'minuto', h: 'hora', d: 'día' };
    return `${val} ${map[unit]}${val > 1 ? 's' : ''}`;
  };

  const obtenerFechaFin = (timestamp, raw) => {
    const match = raw?.toLowerCase().match(/(\d+)([smhd])/);
    if (!match) return null;
    const val = parseInt(match[1], 10);
    const unit = match[2];
    const ms = { s: 1000, m: 60000, h: 3600000, d: 86400000 }[unit] * val;
    return new Date(parseInt(timestamp) + ms).toLocaleString('es-ES');
  };

  return (
    <section className="tribunal-epic">
      <div className="epic-header">
        <h1>Tribunal de Sanciones</h1>
        <p>Consulta y revisa el historial de infracciones de los jugadores de FlanCraft. ¡La justicia no duerme!</p>
      </div>

      <div className="selector-panel">
        <input
          type="text"
          placeholder="Buscar jugador..."
          value={filtroJugador}
          onChange={(e) => setFiltroJugador(e.target.value)}
          className="filtro-input"
        />

        <label htmlFor="toggle-leyenda" className="leyenda-btn">📜 Leyenda</label>
        <input type="checkbox" id="toggle-leyenda" className="leyenda-toggle" />
        <div className="leyenda-modal">
          <div className="leyenda-content">
            <label htmlFor="toggle-leyenda" className="close-btn">✖</label>
            <h2>Tabla de Sanciones</h2>
            <table className="leyenda-table">
              <thead>
                <tr><th>Motivo</th><th>1º vez</th><th>2º vez</th><th>3º vez</th></tr>
              </thead>
              <tbody>
                <tr><td>Hacks</td><td>Jail 12h</td><td>Jail 5d</td><td>Ban perm.</td></tr>
                <tr><td>Fly</td><td>Jail 6h</td><td>Jail 3d</td><td>Ban perm.</td></tr>
                <tr><td>Insultos</td><td>Jail 30m</td><td>Jail 5h</td><td>Ban perm.</td></tr>
                <tr><td>TPAKill</td><td>Jail 6h</td><td>Jail 5d</td><td>Ban perm.</td></tr>
                <tr><td>Grief</td><td>Jail 2h</td><td>Jail 8h</td><td>Jail 5d</td></tr>
                <tr><td>Spam</td><td>Jail 1d</td><td>Jail 10d</td><td>Ban perm.</td></tr>
                <tr><td>Flood</td><td>Avisar</td><td>Jail 15m</td><td>Jail 2h</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 📱 Tarjetas Mobile / Tablet */}
      {isMobile && (
        <div className="sanciones-cards">
          {sanciones
            .filter((s) => s.name.toLowerCase().includes(filtroJugador.toLowerCase()))
            .map((s, index) => {
              const strikes = contarStrikes(s.name, s.type);
              const fechaFin = obtenerFechaFin(s.timestamp, s.duration);

              return (
                <div className="sancion-card" key={index}>
                  <div className="header">
                    <img src={`https://mc-heads.net/avatar/${s.name}/40`} alt={s.name} />
                    <div className="player-info">
                      <strong onClick={() => navigate(`/perfil/${s.name}`)}>{s.name}</strong>
                      {jugadoresBaneados.includes(s.name.toLowerCase()) && (
                        <span className="permaban-badge">PERMABAN</span>
                      )}
                      {s.banType && (
                        <span className="baneado-badge">{s.banType.toUpperCase()}</span>
                      )}
                    </div>
                  </div>

                  <div className="info">
                    <div><strong>Moderador:</strong> {s.moderator}</div>
                    <div><strong>Motivo:</strong> {s.type}</div>
                    <div><strong>Duración:</strong> {formatearDuracion(s.duration)}</div>
                    {fechaFin && (
                      <div><strong>Finaliza:</strong> {fechaFin}</div>
                    )}
                    <div><strong>Fecha:</strong> {new Date(parseInt(s.timestamp)).toLocaleString('es-ES')}</div>
                    <div className={`server ${s.server?.toLowerCase() || 'desconocido'}`}>
                      {obtenerIconoServidor(s.server)} {obtenerNombreServidor(s.server)}
                    </div>

                    <div className={`strikes ${strikes >= 3 ? 'permaban' : ''}`}>
                      <WarningCircle size={14} weight="duotone" /> Strikes: {strikes}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* 🖥️ Tabla Desktop */}
      {!isMobile && (
        <div className="tabla-scroll-wrapper">
          <table className="sanciones-table tabla-epica">
            <thead>
              <tr>
                <th>Jugador</th>
                <th>Moderador</th>
                <th>Motivo</th>
                <th>Duración</th>
                <th>Fecha</th>
                <th>Servidor</th>

              </tr>
            </thead>
            <tbody>
              {sanciones
                .filter((s) => s.name.toLowerCase().includes(filtroJugador.toLowerCase()))
                .map((s, index) => {
                  const strikes = contarStrikes(s.name, s.type);
                  const fechaFin = obtenerFechaFin(s.timestamp, s.duration);
                  return (
                    <tr key={index}>
                      <td>
                        <div className="jugador-info">
                          <img src={`https://mc-heads.net/avatar/${s.name}/32`} className="avatar-head" alt={s.name} />
                          <span onClick={() => navigate(`/perfil/${s.name}`)} style={{ cursor: 'pointer' }}>
                            {s.name}
                          </span>
                          {jugadoresBaneados.includes(s.name.toLowerCase()) && (
                            <span className="permaban-badge">PERMABAN</span>
                          )}
                        </div>
                      </td>
                      <td><strong>{s.moderator}</strong></td>
                      <td>
                        <span className="tipo">{s.type}</span>
                        <span className={`strikes ${strikes >= 3 ? 'permaban' : ''}`}>
                          <WarningCircle size={14} weight="duotone" /> Strikes: {strikes}
                          {strikes >= 3 && <strong> (Permaban)</strong>}
                        </span>
                      </td>
                      <td>
                        <div>{formatearDuracion(s.duration)}</div>
                        {fechaFin && <div className="duracion-extra">Finaliza: {fechaFin}</div>}
                      </td>
                      <td>{new Date(parseInt(s.timestamp)).toLocaleString('es-ES')}</td>
                      <td>
                        <span className={`server-badge ${s.server?.toLowerCase() || 'desconocido'}`}>
                          {obtenerIconoServidor(s.server)}
                          {obtenerNombreServidor(s.server)}
                        </span>
                      </td>

                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
