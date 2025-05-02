import React, { useEffect, useState } from 'react';
import '../../styles/pages/_tribunalstaff.scss';
import { supabase } from '@lib/supabaseClient';


export default function StaffPanel() {
  const [userEmail, setUserEmail] = useState('');
  const [rol, setRol] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [nuevoRol, setNuevoRol] = useState('mod');
  
  const [editingEmail, setEditingEmail] = useState(null);
  const [rolEditado, setRolEditado] = useState('');

  useEffect(() => {
    async function verificar() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/login';
        return;
      }

      const email = session.user.email;
      setUserEmail(email);

      const { data: rolData } = await supabase
        .from('staff_roles')
        .select('rol, nivel')
        .eq('email', email)
        .single();

      if (!rolData || rolData.nivel !== 'owner') {
        alert('Solo los owners pueden acceder a este panel.');
        await supabase.auth.signOut();
        window.location.href = '/login';
        return;
      }

      setRol(rolData.rol);
      cargarStaff();
    }

    verificar();
  }, []);

  const cargarStaff = async () => {
    const { data } = await supabase.from('staff_roles').select('*').order('email', { ascending: true });
    setStaffList(data);
  };
  
  const agregarStaff = async () => {
    if (!nuevoEmail || !nuevoRol) return;
  
    const res = await fetch('/api/create-staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: nuevoEmail,
        password: 'contraseña123', // Aquí puedes pedir o generar la contraseña
        rol: nuevoRol,
      }),
    });
  
    const result = await res.json();
  
    if (res.ok) {
      alert('Usuario creado correctamente');
      setNuevoEmail('');
      setNuevoRol('mod');
      cargarStaff();
    } else {
      alert('Error: ' + result.error);
    }
  };

  const eliminarStaff = async (email) => {
    if (confirm(`¿Seguro que deseas eliminar a ${email}?`)) {
      await supabase.from('staff_roles').delete().eq('email', email);
      cargarStaff();
    }
  };

  const guardarRolEditado = async (email) => {
    await supabase
      .from('staff_roles')
      .update({ rol: rolEditado })
      .eq('email', email);

    setEditingEmail(null);
    setRolEditado('');
    cargarStaff();
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">Gestión de Staff</h1>

      <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <span style={{ marginRight: '10px', fontWeight: 'bold' }}>
          Sesión: {userEmail} ({rol})
        </span>
        <button onClick={cerrarSesion} className="btn logout">Cerrar sesión</button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Añadir nuevo miembro del staff</h3>
        <input
          type="email"
          placeholder="Correo"
          value={nuevoEmail}
          onChange={(e) => setNuevoEmail(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <select value={nuevoRol} onChange={(e) => setNuevoRol(e.target.value)}>
          <option value="mod">Mod</option>
          <option value="srmod">SrMod</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={agregarStaff} className="btn">➕ Añadir</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Correo</th>
            <th>Rol / Nivel</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((s, index) => (
            <tr key={index}>
              <td>{s.email}</td>
              <td>
  {editingEmail === s.email ? (
    <select value={rolEditado} onChange={(e) => setRolEditado(e.target.value)}>
      <option value="mod">mod</option>
      <option value="srmod">SrMod</option>
      <option value="admin">admin</option>
    </select>
  ) : (
    <>
      {s.rol} {s.nivel === 'owner' && <strong>(Owner)</strong>}
    </>
  )}
</td>
              <td>
                {editingEmail === s.email ? (
                  <button
                    className="btn"
                    onClick={() => guardarRolEditado(s.email)}
                  >
                    💾 Guardar
                  </button>
                ) : (
                  <>
                    <button
                      className="btn"
                      onClick={() => {
                        setEditingEmail(s.email);
                        setRolEditado(s.rol);
                      }}
                      style={{ marginRight: '6px' }}
                    >
                      ✏️ Editar
                    </button>

                    {s.email !== userEmail && (
                      <button
                        className="btn eliminar"
                        onClick={() => eliminarStaff(s.email)}
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
