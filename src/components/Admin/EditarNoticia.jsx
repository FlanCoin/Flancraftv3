import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditorContent, useEditor, generateHTML } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Iframe from '../../extensions/Iframe';
import toast from 'react-hot-toast';
import { FaLink, FaPalette, FaEdit } from 'react-icons/fa';
import '../../styles/pages/_editarnoticia.scss';

const API_URL = "https://flancraftweb-backend.onrender.com";

const extensiones = [
  StarterKit,
  Link,
  Image,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  TextStyle,
  Color,
  Iframe,
];

const EditarNoticia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [portada, setPortada] = useState('');
  const [fecha, setFecha] = useState('');
  const [loading, setLoading] = useState(true);

  const editor = useEditor({
    extensions: extensiones,
    content: '',
    editorProps: {
      attributes: {
        class: 'editor-contenido',
      },
    },
  });

  useEffect(() => {
    const cargarNoticia = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('flan_user'))?.token;
        if (!token) throw new Error('Token no encontrado');

        const res = await fetch(`${API_URL}/api/noticias/id/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('No autorizado o no encontrada');
        const data = await res.json();

        setTitulo(data.titulo);
        setPortada(data.portada || '');
        setFecha(data.fecha?.slice(0, 16) || new Date().toISOString().slice(0, 16));
        if (editor && data.contenido) {
          editor.commands.setContent(data.contenido);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error al cargar noticia:', err);
        toast.error('No se pudo cargar la noticia.');
        navigate('/admin/noticias');
      }
    };

    cargarNoticia();
  }, [id, editor, navigate]);

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
        <button onClick={() => {
          const url = prompt("Introduce una URL de YouTube, TikTok o Instagram:");
          if (!url) return;

          let embedUrl = "";

          if (url.includes("youtube.com") || url.includes("youtu.be")) {
            const videoId = url.includes("youtu.be") ? url.split("/").pop() : new URL(url).searchParams.get("v");
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
          } else if (url.includes("tiktok.com")) {
            embedUrl = url.replace("/video/", "/embed/video/");
          } else if (url.includes("instagram.com")) {
            const id = url.split("/p/")[1]?.split("/")[0];
            embedUrl = `https://www.instagram.com/p/${id}/embed`;
          }

          editor.chain().focus().insertContent({
            type: 'iframe',
            attrs: {
              src: embedUrl,
              width: "100%",
              height: "400",
              frameborder: "0",
              allowfullscreen: "true",
            },
          }).run();
        }}>
          🎥 Video
        </button>
      </div>
    );
  };

  const guardarCambios = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('flan_user'))?.token;
      if (!token) throw new Error('Token no encontrado');

      const contenido = editor.getJSON();
      const contenidoHtml = generateHTML(contenido, extensiones);

      const body = {
        titulo,
        portada,
        fecha,
        contenido,
        contenidoHtml,
      };

      const res = await fetch(`${API_URL}/api/noticias/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Error al guardar cambios');
      toast.success('✅ Noticia actualizada con éxito');
      navigate(`/news/${id}`);
    } catch (err) {
      console.error('Error al guardar:', err);
      toast.error('❌ Error al guardar cambios');
    }
  };

  if (loading) return <div className="cargando">Cargando...</div>;

  return (
    <div className="editar-noticia">
      <h2><FaEdit /> Editar Noticia</h2>

      <label>Título</label>
      <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />

      <label>Portada (URL)</label>
      <input type="text" value={portada} onChange={(e) => setPortada(e.target.value)} />

      <label>Fecha</label>
      <input type="datetime-local" value={fecha} onChange={(e) => setFecha(e.target.value)} />

      {renderToolbar()}
      <div className="editor-wrapper">
        <EditorContent editor={editor} />
      </div>

      <button className="guardar-btn" onClick={guardarCambios}>
        Guardar Cambios
      </button>
    </div>
  );
};

export default EditarNoticia;