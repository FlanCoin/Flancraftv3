import React, { useState, useEffect, useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UserContext } from "../../context/UserContext";
import "../../styles/pages/_noticiasadmin.scss";

const API_URL = "https://flancraftweb-backend.onrender.com";

export default function NoticiasAdmin() {
  const { user } = useContext(UserContext);
  const [noticias, setNoticias] = useState([]);
  const [modoCrear, setModoCrear] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    subtitulo: "",
    slug: "",
    portada: "",
    contenido: "",
    publicada: false,
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user?.loggedIn && user.rol_admin === "owner") {
      fetchNoticias();
    }
  }, [user]);

  const fetchNoticias = async () => {
    const res = await fetch(`${API_URL}/api/noticias`);
    const data = await res.json();
    setNoticias(data);
  };

  const showToast = (mensaje, tipo = "success") => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async () => {
    if (!form.titulo || !form.slug || !form.contenido || form.contenido.trim() === "") {
      return showToast("Faltan campos obligatorios", "error");
    }

    const res = await fetch(`${API_URL}/api/noticias`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) return showToast("Error al crear noticia", "error");
    showToast("Noticia creada");
    setModoCrear(false);
    setForm({
      titulo: "",
      subtitulo: "",
      slug: "",
      portada: "",
      contenido: "",
      publicada: false,
    });
    fetchNoticias();
  };

  if (!user?.loggedIn || user.rol_admin !== "owner") {
    return (
      <div className="admin-wrapper" style={{ textAlign: "center", padding: "4rem" }}>
        <img src="/assets/gandalf_minecraft.png" alt="No tienes poder aquí" style={{ maxWidth: "320px", marginBottom: "1rem" }} />
        <h2 style={{ fontFamily: "'IM Fell English SC', serif", fontSize: "2rem" }}>¡No tienes poder aquí!</h2>
        <p>Acceso denegado al panel de noticias</p>
      </div>
    );
  }

  return (
    <div className="noticiasadmin-wrapper">
      <h1 className="titulo-seccion">Gestión de Noticias</h1>

      {!modoCrear && (
        <>
          <button className="btn-epico" onClick={() => setModoCrear(true)}>
            📝 Crear nueva noticia
          </button>

          <div className="lista-noticias">
            {noticias.map((n) => (
              <div className="noticia-item" key={n.id}>
                <img src={n.portada || "/assets/placeholder.png"} alt="portada" />
                <div>
                  <h2>{n.titulo}</h2>
                  <p className="fecha">{new Date(n.fecha).toLocaleDateString()}</p>
                  <p className="publicada">{n.publicada ? "🟢 Publicada" : "🔴 Borrador"}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {modoCrear && (
        <div className="formulario-noticia fade-in">
          <h2>Crear nueva noticia</h2>

          <input
            type="text"
            placeholder="Título"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />

          <input
            type="text"
            placeholder="Subtítulo"
            value={form.subtitulo}
            onChange={(e) => setForm({ ...form, subtitulo: e.target.value })}
          />

          <input
            type="text"
            placeholder="Slug (sin espacios)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />

          <input
            type="text"
            placeholder="URL de la imagen de portada"
            value={form.portada}
            onChange={(e) => setForm({ ...form, portada: e.target.value })}
          />

          <label>Contenido enriquecido</label>
          <div className="editor-contenido">
            <ReactQuill
              theme="snow"
              value={form.contenido}
              onChange={(value) => setForm({ ...form, contenido: value })}
            />
          </div>

          <label>
            <input
              type="checkbox"
              checked={form.publicada}
              onChange={(e) => setForm({ ...form, publicada: e.target.checked })}
            />
            Publicar directamente
          </label>

          <div className="acciones-formulario">
            <button className="btn-secundario" onClick={() => setModoCrear(false)}>Cancelar</button>
            <button className="btn-epico" onClick={handleSubmit}>Guardar noticia</button>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toast.tipo}`}>{toast.mensaje}</div>}
    </div>
  );
}
