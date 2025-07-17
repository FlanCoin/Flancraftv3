import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Iframe from '../extensions/Iframe';
import toast from 'react-hot-toast';
import '../styles/pages/_editarnoticia.scss';

const API_URL = 'https://flancraftweb-backend.onrender.com';

const EditarNoticia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [portada, setPortada] = useState('');
  const [fecha, setFecha] = useState('');
  const [loading, setLoading] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Iframe,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
      },
    },
  });

  useEffect(() => {
    const cargarNoticia = async () => {
      try {
        if (!id) throw new Error('ID no válido');
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
        toast.error('No se pudo cargar la noticia');
        navigate('/admin/noticias');
      }
    };

    cargarNoticia();
  }, [id, editor, navigate]);

  const guardarCambios = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('flan_user'))?.token;
      if (!token) throw new Error('Token no encontrado');

      const contenido = editor.getJSON();
      const body = { titulo, portada, fecha, contenido };

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
      navigate('/news/' + id);
    } catch (err) {
      console.error('Error al guardar:', err);
      toast.error('❌ Error al guardar cambios');
    }
  };

  if (loading) return <div className="cargando">Cargando...</div>;

  return (
    <div className="editar-noticia">
      <h2>Editar Noticia</h2>

      <label>Título</label>
      <input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <label>Portada (URL)</label>
      <input
        type="text"
        value={portada}
        onChange={(e) => setPortada(e.target.value)}
      />

      <label>Fecha</label>
      <input
        type="datetime-local"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />

      <label>Contenido</label>
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
