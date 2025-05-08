import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import {
  WarningCircle, CheckCircle, HourglassMedium, Skull
} from 'phosphor-react';

import '../../styles/pages/_perfiljugadortribunal.scss';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export default function PerfilJugador() {
  const { nombre } = useParams();
  const [sanciones, setSanciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('jails')
        .select('*')
        .eq('name', nombre)
        .order('timestamp', { ascending: false });

      setSanciones(data || []);
      setCargando(false);
    }

    fetchData();
  }, [nombre]);

  const contarStrikes = () => {
    const conteo = {};
    sanciones.forEach((s) => {
      if (s.type) {
        conteo[s.type] = (conteo[s.type] || 0) + 1;
      }
    });
    return conteo;
  };

  const strikes = contarStrikes();
  const permabaneado = sanciones.some((s) => s.estado === 'baneado');

  const nombresServidores = {
    survival: 'Survival',
    oneblock: 'OneBlock',
    anarquico: 'Anárquico',
    creativo: 'Creativo',
    boxpvp: 'BoxPvP',
    kingdoms: 'Kingdoms',
    parkour: 'Parkour',
    'play.flancraft.com': 'Lobby',
  };

  const formatearDuracion = (raw) => {
    if (!raw) return 'Desconocida';
    const match = raw.toLowerCase().match(/(\d+)([smhd])/);
    if (!match) return raw;

    const [ , valor, unidad ] = match;
    const unidades = { s: 'segundo', m: 'minuto', h: 'hora', d: 'día' };
    return `${valor} ${unidades[unidad]}${valor > 1 ? 's' : ''}`;
  };

  const obtenerFechaFin = (timestamp, duracionRaw) => {
    const match = duracionRaw?.toLowerCase().match(/(\d+)([smhd])/);
    if (!match) return null;

    const valor = parseInt(match[1], 10);
    const unidad = match[2];
    const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    const ms = valor * (multipliers[unidad] || 0);

    return new Date(parseInt(timestamp) + ms).toLocaleString('es-ES');
  };

  const obtenerIconoEstado = (estado) => {
    const iconProps = { size: 16, weight: 'duotone', style: { marginRight: '6px' } };
    switch (estado) {
      case 'baneado': return <Skull color="#c0392b" {...iconProps} />;
      case 'revisado': return <CheckCircle color="#27ae60" {...iconProps} />;
      case 'pendiente':
      default: return <HourglassMedium color="#e67e22" {...iconProps} />;
    }
  };

  if (cargando) return <p>Cargando historial...</p>;

  return (
    <div className="perfil-wrapper">
      <h2>Perfil de <span className="nombre-jugador">{nombre}</span></h2>

      <div className="perfil-summary-box">
        <div className="avatar-box">
          <img
            src={`https://mc-heads.net/avatar/${nombre}/100`}
            alt={nombre}
            className="avatar"
          />
          <h4 className="player-name">{nombre}</h4>
        </div>

        <div className="datos-box">
          <p>
            <strong>Estado actual:</strong>{' '}
            <span className={`estado ${permabaneado ? 'baneado' : 'revisado'}`}>
              {obtenerIconoEstado(permabaneado ? 'baneado' : 'revisado')}
              {permabaneado ? 'PERMABAN' : 'ACTIVO'}
            </span>
          </p>

          <p><strong>Total de sanciones:</strong> {sanciones.length}</p>

          <div className="strikes-container">
            <strong>Strikes por tipo:</strong>
            <ul>
              {Object.entries(strikes).map(([tipo, cantidad]) => (
                <li key={tipo}>
                  <WarningCircle size={14} weight="duotone" style={{ marginRight: '4px' }} />
                  <strong>{tipo}</strong>: {cantidad} strike(s)
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <h3 className="perfil-subtitle">Historial completo</h3>

      <table className="sanciones-table">
        <thead>
          <tr>
            <th>Moderador</th>
            <th>Motivo</th>
            <th>Duración</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Servidor</th>
            <th>Observación</th>
            <th>Revisado por</th>
          </tr>
        </thead>
        <tbody>
          {sanciones.map((s, i) => {
            const fechaFin = obtenerFechaFin(s.timestamp, s.duration);
            return (
              <tr key={i}>
                <td>{s.moderator}</td>
                <td className="tipo">
                  {s.type ? s.type.charAt(0).toUpperCase() + s.type.slice(1) : 'Sin clasificar'}
                </td>
                <td>
                  {formatearDuracion(s.duration)}
                  {fechaFin && (
                    <div className="fecha-fin">
                      Termina: {fechaFin}
                    </div>
                  )}
                </td>
                <td>{new Date(parseInt(s.timestamp)).toLocaleString('es-ES')}</td>
                <td className="estado">
                  {obtenerIconoEstado(s.estado)}
                  {s.estado || 'pendiente'}
                </td>
                <td>
  <span className={`server-badge ${s.server?.toLowerCase() || 'desconocido'}`}>
    {nombresServidores[s.server?.toLowerCase()] || 'Desconocido'}
  </span>
</td>

                <td>{s.observacion || '-'}</td>
                <td>{s.revisado_por ? s.revisado_por.split('@')[0] : '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="volver-btn">
        <Link to="/tribunal" className="btn">← Volver al tribunal</Link>
      </div>
    </div>
  );
}
