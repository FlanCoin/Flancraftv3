import React, { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import axios from "../../hooks/useAxios";
import {
  FaPlus, FaEdit, FaTrash, FaNewspaper, FaPalette, FaCode, FaClock, FaLink
} from "react-icons/fa";
import "../../styles/pages/_noticiasadmin.scss";

const NoticiasAdmin = () => {
  const [form, setForm] = useState({
    titulo: "",
    slug: "",
    portada: "",
    servidor: "global",
    fecha: new Date().toISOString().slice(0, 16),
    usarFechaManual: false,
    noEnviarADiscord: false,
    id: null,
  });

  const [noticias, setNoticias] = useState([]);
  const [htmlInput, setHtmlInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contenidoPendiente, setContenidoPendiente] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Color,
      TextStyle,
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "editor-contenido",
      },
    },
  });

  useEffect(() => {
    fetchNoticias();
  }, []);

  useEffect(() => {
    if (!editor || !contenidoPendiente) return;

    try {
      const json = typeof contenidoPendiente === "string"
        ? JSON.parse(contenidoPendiente)
        : contenidoPendiente;

      if (json?.type === "doc") {
        editor.commands.setContent(json);
      } else {
        console.warn("Contenido no válido:", json);
      }
    } catch (err) {
      console.error("Error al aplicar contenido:", err);
    } finally {
      setContenidoPendiente(null);
    }
  }, [editor, contenidoPendiente]);

  const fetchNoticias = async () => {
    try {
      const res = await axios.get("/api/noticias/todas");
      const ahora = new Date();
      const ordenadas = res.data
        .filter((n) => n.publicada && new Date(n.fecha) <= ahora)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setNoticias(ordenadas);
    } catch (error) {
      console.error("Error al cargar noticias", error);
    }
  };

  const handleChangeTitulo = (titulo) => {
    const slugGenerado = titulo
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    setForm((prev) => ({ ...prev, titulo, slug: slugGenerado }));
  };

  const handleEdit = (noticia) => {
    setForm({
      titulo: noticia.titulo,
      slug: noticia.slug,
      portada: noticia.portada || "",
      servidor: noticia.servidor || "global",
      fecha: noticia.fecha?.slice(0, 16) || new Date().toISOString().slice(0, 16),
      usarFechaManual: true,
      id: noticia.id,
    });

    setContenidoPendiente(noticia.contenido);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editor) return;

    const contenido = editor.getJSON();
    if (!form.titulo || !form.slug || !contenido) return;

    setIsSubmitting(true);

    const payload = {
      titulo: form.titulo,
      slug: form.slug,
      portada: form.portada,
      servidor: form.servidor,
      contenido,
      publicada: true,
      fecha: form.usarFechaManual ? form.fecha : new Date().toISOString(),
      noEnviarDiscord: form.noEnviarADiscord,
    };

    try {
      if (form.id) {
        await axios.put(`/api/noticias/${form.id}`, payload);
      } else {
        await axios.post("/api/noticias", payload);
      }

      setTimeout(() => editor.commands.clearContent(), 100);
      setForm({
        titulo: "",
        slug: "",
        portada: "",
        servidor: "global",
        fecha: new Date().toISOString().slice(0, 16),
        usarFechaManual: false,
        noEnviarADiscord: false,
        id: null,
      });
      fetchNoticias();
      window.location.reload();
    } catch (error) {
      console.error("Error al enviar noticia", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta noticia?")) return;
    try {
      await axios.delete(`/api/noticias/${id}`);
      fetchNoticias();
      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar", error);
    }
  };

  const handlePasteHtml = () => {
    if (!htmlInput || !editor) return;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlInput, "text/html");

      const titulo =
        doc.querySelector("h1")?.textContent.trim() ||
        doc.querySelector("title")?.textContent.trim();
      const primeraImagen = doc.querySelector("img")?.getAttribute("src");

      if (titulo) handleChangeTitulo(titulo);
      if (primeraImagen)
        setForm((prev) => ({ ...prev, portada: primeraImagen }));

      const bodyHTML = doc.body.innerHTML.trim();
      if (bodyHTML) {
        editor.commands.setContent(bodyHTML, false, {
          preserveWhitespace: true,
        });
      }

      setHtmlInput("");
    } catch (error) {
      console.error("Error al procesar HTML pegado:", error);
    }
  };

  const renderToolbar = () => {
    if (!editor) return null;

    return (
      <div className="editor-toolbar">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "is-active" : ""}>B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "is-active" : ""}>I</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}>H2</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "is-active" : ""}>• Lista</button>
        <button onClick={() => {
          const url = prompt("Introduce la URL:");
          if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }
        }}><FaLink /> Enlace</button>
        <button onClick={() => {
          const url = prompt("URL de imagen:");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}>Imagen</button>
        <label className="color-picker">
          <FaPalette />
          <input type="color" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} title="Color de texto" />
        </label>
      </div>
    );
  };

  return (
    <div className="noticias-admin">
      <h2><FaNewspaper /> Crea una nueva noticia</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título de la noticia"
          value={form.titulo}
          onChange={(e) => handleChangeTitulo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Slug personalizado"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />
        <input
          type="text"
          placeholder="URL de imagen de portada (opcional)"
          value={form.portada}
          onChange={(e) => setForm({ ...form, portada: e.target.value })}
        />

        <label>
          Servidor destino:
          <select
            value={form.servidor}
            onChange={(e) => setForm({ ...form, servidor: e.target.value })}
          >
            <option value="global">🌐 Global</option>
            <option value="survival">🌲 Survival</option>
            <option value="oneblock">🧱 OneBlock</option>
            <option value="pokebox">🎮 Pokebox</option>
          </select>
        </label>

        <label className="checkbox-fecha">
          <input
            type="checkbox"
            checked={form.usarFechaManual}
            onChange={(e) =>
              setForm({ ...form, usarFechaManual: e.target.checked })
            }
          />
          Usar fecha manual de publicación
        </label>

        {form.usarFechaManual && (
          <label>
            <FaClock /> Fecha de publicación:
            <input
              type="datetime-local"
              value={form.fecha || ""}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            />
          </label>
        )}

        {renderToolbar()}

        {editor ? (
          <div className="tiptap-editor-wrapper">
            <EditorContent editor={editor} className="tiptap-editor" />
          </div>
        ) : (
          <p>Cargando editor...</p>
        )}

        <div className="html-paste-box">
          <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            placeholder="Pega aquí código HTML para insertar contenido"
          />
          <button type="button" onClick={handlePasteHtml}>
            <FaCode /> Pegar HTML
          </button>
        </div>
<label className="checkbox-discord">
  <input
    type="checkbox"
    checked={form.noEnviarADiscord}
    onChange={(e) =>
      setForm({ ...form, noEnviarADiscord: e.target.checked })
    }
  />
  No enviar esta noticia a Discord
</label>
        <button type="submit" className="boton-publicar" disabled={isSubmitting}>
          {isSubmitting ? "Publicando..." : form.id ? <><FaEdit /> Actualizar noticia</> : <><FaPlus /> Publicar noticia</>}
        </button>
      </form>

      <hr />

      <div className="lista-noticias">
        <h3><FaNewspaper /> Noticias guardadas</h3>
        {noticias.map((noticia) => (
          <div className="noticia-item" key={noticia.id}>
            {noticia.portada && (
              <img
                src={noticia.portada}
                alt="Portada"
                className="miniatura"
              />
            )}
            <div className="contenido">
              <h4>{noticia.titulo}</h4>
              <span className="fecha">
                {new Date(noticia.fecha).toLocaleDateString("es-ES", {
                  day: "numeric", month: "short", year: "numeric",
                  hour: "2-digit", minute: "2-digit"
                })}
              </span>
            </div>
            <div className="acciones">
              <button onClick={() => handleEdit(noticia)} title="Editar"><FaEdit /></button>
              <button onClick={() => handleDelete(noticia.id)} title="Eliminar"><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticiasAdmin;
