import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import "../../styles/pages/_noticiasadmin.scss";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "link"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "link",
  "list",
  "bullet",
];

const NoticiasAdmin = () => {
  const [form, setForm] = useState({
    titulo: "",
    slug: "",
    contenido: "",
  });
  const [noticias, setNoticias] = useState([]);
  const [mostrarEditorHTML, setMostrarEditorHTML] = useState(false);

  const fetchNoticias = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/noticias`);
      setNoticias(res.data);
    } catch (error) {
      console.error("Error al cargar noticias", error);
    }
  };

  useEffect(() => {
    fetchNoticias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo || !form.slug || !form.contenido) return;

    try {
      await axios.post(`${API_URL}/api/noticias`, form);
      setForm({ titulo: "", slug: "", contenido: "" });
      fetchNoticias();
    } catch (error) {
      console.error("Error al enviar noticia", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta noticia?")) return;
    try {
      await axios.delete(`${API_URL}/api/noticias/${id}`);
      fetchNoticias();
    } catch (error) {
      console.error("Error al eliminar", error);
    }
  };

  const handleEdit = (noticia) => {
    setForm({
      titulo: noticia.titulo,
      slug: noticia.slug,
      contenido: noticia.contenido,
      id: noticia.id,
    });
    window.scrollTo(0, 0);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/api/noticias/${form.id}`, {
        titulo: form.titulo,
        slug: form.slug,
        contenido: form.contenido,
      });
      setForm({ titulo: "", slug: "", contenido: "", id: null });
      fetchNoticias();
    } catch (error) {
      console.error("Error al actualizar noticia", error);
    }
  };

  return (
    <div className="noticias-admin">
      <h2>📰 Gestión de Noticias</h2>

      <form onSubmit={form.id ? handleUpdate : handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={form.titulo}
          onChange={(e) => {
            const titulo = e.target.value;
            const slugGenerado = titulo
              .toLowerCase()
              .trim()
              .replace(/[^\w\s-]/g, "")
              .replace(/\s+/g, "-");
            setForm((prev) => ({ ...prev, titulo, slug: slugGenerado }));
          }}
        />

        <input
          type="text"
          placeholder="Slug"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />

        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          value={form.contenido}
          onChange={(value) => setForm({ ...form, contenido: value })}
          placeholder="Contenido enriquecido de la noticia..."
        />

        <button
          type="button"
          onClick={() => setMostrarEditorHTML(!mostrarEditorHTML)}
          style={{ marginTop: "0.5rem" }}
        >
          {mostrarEditorHTML ? "Ocultar HTML" : "Editar HTML manualmente"}
        </button>

        {mostrarEditorHTML && (
          <textarea
            value={form.contenido}
            onChange={(e) => setForm({ ...form, contenido: e.target.value })}
            style={{
              width: "100%",
              minHeight: "200px",
              marginTop: "1rem",
              fontFamily: "monospace",
              background: "#f9f9f9",
              border: "1px solid #ccc",
              padding: "1rem",
            }}
          />
        )}

        <button type="submit" style={{ marginTop: "1rem" }}>
          {form.id ? "Actualizar noticia" : "Publicar noticia"}
        </button>
      </form>

      <hr />

      <div className="lista-noticias">
        <h3>Noticias publicadas</h3>
        {noticias.map((noticia) => (
          <div className="noticia-item" key={noticia.id}>
            <h4>{noticia.titulo}</h4>
            <div
              className="contenido-preview"
              dangerouslySetInnerHTML={{ __html: noticia.contenido }}
            />
            <div className="acciones">
              <button onClick={() => handleEdit(noticia)}>Editar</button>
              <button onClick={() => handleDelete(noticia.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticiasAdmin;
