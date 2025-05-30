import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/_tribunalstaff.scss';
import { UserContext } from '../../context/UserContext';

export default function StaffPanel() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [staffList, setStaffList] = useState([]);
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [nuevoRol, setNuevoRol] = useState('mod');
  const [editingEmail, setEditingEmail] = useState(null);
  const [rolEditado, setRolEditado] = useState('');

  useEffect(() => {
    if (!user || !user.loggedIn || user.rol_admin !== 'owner') {
      navigate('/');
      return;
    }

    cargarStaff();
  }, [user, navigate]);

  const cargarStaff = async () => {
    try {
      const res = await fetch('/api/staff');
      const data = await res.json();
      setStaffList(data);
    } catch (err) {
      console.error("Error cargando staff", err);
    }
  };

  const agregarStaff = async () => {
    if (!nuevoEmail || !nuevoRol) return;

    const res = await fetch('/api/create-staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: nuevoEmail,
        password: 'contraseña123',
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
    if (!confirm(`¿Seguro que deseas eliminar a ${email}?`)) return;

    try {
      await fetch('/api/staff', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      cargarStaff();
    } catch (err) {
      console.error("Error al eliminar staff", err);
    }
  };

  const guardarRolEditado = async (email) => {
    await fetch('/api/staff', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, rol: rolEditado }),
    });

    setEditingEmail(null);
    setRolEditado('');
    cargarStaff();
  };

  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">Gestión de Staff</h1>

      <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <span style={{ marginRight: '10px', fontWeight: 'bold' }}>
          Sesión: {user?.uid} ({user?.rol_admin})
        </span>
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
                  <button className="btn" onClick={() => guardarRolEditado(s.email)}>
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

                    {s.email !== user?.email && (
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
