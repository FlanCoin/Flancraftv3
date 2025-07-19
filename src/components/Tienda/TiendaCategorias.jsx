// src/components/Tienda/TiendaCategorias.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { agruparCategorias } from "./Helpers";
import "../../styles/pages/_tiendatebex.scss";

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://flancraftweb-backend.onrender.com";

const TiendaCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tebex/datos`);
        const data = await res.json();
        const agrupadas = agruparCategorias(data.categorias || []);
        setCategorias(agrupadas);
      } catch (e) {
        console.error("Error cargando categorías:", e);
      } finally {
        setLoading(false);
      }
    };
    cargarCategorias();
  }, []);

  const irACategoria = (cat) => {
    const nombreUrl = cat.name.toLowerCase().replace(/ /g, "-");
    navigate(`/tienda/${nombreUrl}`);
  };

  return (
    <div className="tienda-tebex">
      <div className="tienda-contenido">
        <h2>Explora las categorías de la tienda</h2>
        {loading ? (
          <p>Cargando categorías...</p>
        ) : categorias.length === 0 ? (
          <p>No hay categorías disponibles.</p>
        ) : (
          <div className="grid-categorias">
            {categorias.map((cat) => (
              <div key={cat.id} className="categoria-card" onClick={() => irACategoria(cat)}>
                <img src={cat.image || "/tienda/imagenes/default.png"} alt={cat.name} />
                <h3>{cat.name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TiendaCategorias;
