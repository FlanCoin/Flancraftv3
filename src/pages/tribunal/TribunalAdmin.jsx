import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Link, useNavigate } from 'react-router-dom';
import {
  PencilSimple,
  Trash,
  FloppyDisk,
  SignOut,
  ArrowLeft,
  Tree,
  Fire,
  PaintBrush,
  Cube,
  CrownSimple,
  Sword,
  PersonSimpleRun,
  Globe,
  CheckCircle,
  HourglassMedium,
  Skull
} from 'phosphor-react';

import '../../styles/pages/_tribunaladmin.scss';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export default function AdminPanel() {
  const [sanciones, setSanciones] = useState([]);
  const [editing, setEditing] = useState(null);
  const [observacion, setObservacion] = useState('');
  const [estado, setEstado] = useState('pendiente');
  const [userEmail, setUserEmail] = useState('');
  const [userRol, setUserRol] = useState('');
  const [motivoEditado, setMotivoEditado] = useState('');
  const navigate = useNavigate();

  const motivos = [
    'hacks', 'fly', 'minar survival', 'insultos', 'tpakill',
    'granja de lag', 'grif', 'spam', 'flood', 'usar bugs', 'estafas', 'otros'
  ];

  useEffect(() => {
    async function verificarSesion() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = '/loginstaff';
        return;
      }

      const email = session.user.email;
      setUserEmail(email);

      const { data: rolData } = await supabase
        .from('staff_roles')
        .select('rol')
        .eq('email', email)
        .single();

      if (!rolData) {
        alert('No tienes permisos para acceder aquí');
        await supabase.auth.signOut();
        window.location.href = '/loginstaff';
        return;
      }

      setUserRol(rolData.rol);
      cargarSanciones();
    }

    verificarSesion();
  }, []);

  const cargarSanciones = async () => {
    const { data } = await supabase
      .from('jails')
      .select('*')
      .order('timestamp', { ascending: false });

    setSanciones(data);
  };

  const guardarCambios = async (sancion) => {
    await supabase
      .from('jails')
      .update({
        observacion,
        estado,
        type: motivoEditado,
        revisado_por: userEmail
      })
      .eq('id', sancion.id);

    cargarSanciones();
    setEditing(null);
    setObservacion('');
    setEstado('pendiente');
    setMotivoEditado('');
  };

  const eliminarSancion = async (sancionId, nombre) => {
    const confirmacion = confirm(`¿Seguro que quieres eliminar la sanción de ${nombre}?`);
    if (!confirmacion) return;

    await supabase
      .from('jails')
      .delete()
      .eq('id', sancionId);

    cargarSanciones();
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    window.location.href = '/loginstaff';
  };

  const obtenerNombreServidor = (raw) => {
    const mapaServidores = {
      'survival': 'Survival',
      'anarquico': 'Anárquico',
      'creativo': 'Creativo',
      'oneblock': 'OneBlock',
      'kingdoms': 'Kingdoms',
      'boxpvp': 'BoxPvP',
      'parkour': 'Parkour',
      'play.flancraft.com': 'Lobby',
    };
    return mapaServidores[raw?.toLowerCase()] || 'Servidor desconocido';
  };

  const obtenerIconoServidor = (server) => {
    const baseProps = { size: 16, weight: 'fill', style: { marginRight: '6px' } };
    const iconMap = {
      survival: <Tree {...baseProps} />,
      anarquico: <Fire {...baseProps} />,
      creativo: <PaintBrush {...baseProps} />,
      oneblock: <Cube {...baseProps} />,
      kingdoms: <CrownSimple {...baseProps} />,
      boxpvp: <Sword {...baseProps} />,
      parkour: <PersonSimpleRun {...baseProps} />,
      'play.flancraft.com': <Globe {...baseProps} />,
    };
    return iconMap[server?.toLowerCase()] || <Globe {...baseProps} />;
  };

  const obtenerIconoEstado = (estado) => {
    const props = { size: 16, weight: 'duotone', style: { marginRight: '6px' } };
    switch (estado) {
      case 'baneado': return <Skull color="#c0392b" {...props} />;
      case 'revisado': return <CheckCircle color="#27ae60" {...props} />;
      case 'pendiente':
      default: return <HourglassMedium color="#e67e22" {...props} />;
    }
  };

  const formatearDuracion = (duracionRaw) => {
    if (!duracionRaw) return 'Desconocida';
    const match = duracionRaw.toLowerCase().match(/(\d+)([smhd])/);
    if (!match) return duracionRaw;

    const valor = parseInt(match[1], 10);
    const unidad = match[2];
    const unidades = { s: 'segundo', m: 'minuto', h: 'hora', d: 'día' };

    return `${valor} ${unidades[unidad] || ''}${valor > 1 ? 's' : ''}`;
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

  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">Panel de Administración</h1>

      <div className="admin-toolbar">
        <button className="btn volver" onClick={() => navigate('/tribunal')}>
          <ArrowLeft size={18} weight="bold" style={{ marginRight: '6px' }} />
          Volver a sanciones
        </button>

        <div style={{ marginLeft: 'auto' }}>
          <span style={{ marginRight: '10px', fontWeight: 'bold' }}>
            Sesión: {userEmail} ({userRol})
          </span>
          <button onClick={cerrarSesion} className="btn logout">
            <SignOut size={18} weight="bold" style={{ marginRight: '6px' }} />
            Cerrar sesión
          </button>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Jugador</th>
            <th>Motivo</th>
            <th>Duración</th>
            <th>Estado</th>
            <th>Observación</th>
            <th>Servidor</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {sanciones.map((s) => {
            const fechaFin = obtenerFechaFin(s.timestamp, s.duration);
            return (
              <tr key={s.id}>
                <td>
                  <Link to={`/perfil/${s.name}`} className="player-link">
                    <div className="player-cell">
                      <img
                        src={`https://mc-heads.net/avatar/${s.name}/30`}
                        alt={s.name}
                        className="avatar"
                      />
                      <span>{s.name}</span>
                    </div>
                  </Link>
                </td>

                <td>
                  {editing === s.id ? (
                    <select
                      value={motivoEditado}
                      onChange={(e) => setMotivoEditado(e.target.value)}
                    >
                      {motivos.map((motivo) => (
                        <option key={motivo} value={motivo}>{motivo}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`motivo-badge ${s.type?.toLowerCase().replace(/\s/g, '-') || 'otros'}`}>
                      {s.type || 'Sin clasificar'}
                    </span>
                  )}
                </td>

                <td>
                  {formatearDuracion(s.duration)}
                  {fechaFin && (
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>
                      Termina: {fechaFin}
                    </div>
                  )}
                </td>

                <td className={`estado ${s.estado || 'pendiente'}`}>
                  {obtenerIconoEstado(s.estado)}
                  {s.estado || 'pendiente'}
                </td>

                <td>{s.observacion || '-'}</td>

                <td>
                  <span className={`server-badge ${s.server?.toLowerCase() || 'desconocido'}`}>
                    {obtenerIconoServidor(s.server)}
                    {obtenerNombreServidor(s.server)}
                  </span>
                </td>

                <td>
                  {editing === s.id ? (
                    <div className="editor">
                      <textarea
                        value={observacion}
                        onChange={(e) => setObservacion(e.target.value)}
                        placeholder="Escribe observación..."
                      />
                      <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                        <option value="pendiente">Pendiente</option>
                        <option value="revisado">Revisado</option>
                        <option value="baneado">Baneado</option>
                      </select>
                      <button onClick={() => guardarCambios(s)}>
                        <FloppyDisk size={18} weight="bold" style={{ marginRight: '5px' }} />
                        Guardar
                      </button>
                    </div>
                  ) : (
                    <div className="action-buttons">
                      <button
                        className="btn"
                        title={`Editar sanción a ${s.name}`}
                        onClick={() => {
                          setEditing(s.id);
                          setObservacion(s.observacion || '');
                          setEstado(s.estado || 'pendiente');
                          setMotivoEditado(s.type || 'otros');
                        }}
                      >
                        <PencilSimple size={18} weight="bold" style={{ marginRight: '5px' }} />
                        Editar
                      </button>

                      {(userRol === 'admin' || userRol === 'srmod' || userRol === 'owner') && (
                        <button
                          className="btn eliminar"
                          title={`Eliminar sanción de ${s.name}`}
                          onClick={() => eliminarSancion(s.id, s.name)}
                        >
                          <Trash size={18} weight="bold" style={{ marginRight: '5px' }} />
                          Eliminar
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
