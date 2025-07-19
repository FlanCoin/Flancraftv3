import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VistaProductos from "./VistaProductos";
import { agruparCategorias } from "./Helpers";
import { useCarrito } from "./useCarrito";
import "../../styles/pages/_tiendatebex.scss";

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://flancraftweb-backend.onrender.com";

const TiendaCategoriaDetalle = () => {
  const { modo } = useParams(); // usa :modo en las rutas
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const { carrito, toggleProducto } = useCarrito(localStorage.getItem("nombreJugador") || "");

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tebex/datos`);
        const data = await res.json();
        setCategorias(data.categorias || []);
        setPaquetes(data.paquetes || []);

        const agrupadas = agruparCategorias(data.categorias);
        const encontrada = agrupadas.find(
          (cat) => cat.name.toLowerCase().replace(/ /g, "-") === modo
        );
        setCategoriaSeleccionada(encontrada || null);
      } catch (e) {
        console.error("Error al cargar:", e);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [modo]);

  const productosFiltrados = categoriaSeleccionada
    ? paquetes.filter((p) =>
        categoriaSeleccionada.subcategorias?.some(
          (cat) => p.category?.id === cat.id
        )
      )
    : [];

  return (
    <div className="tienda-tebex">
      <div className="tienda-contenido">
        <button className="volver" onClick={() => navigate("/tienda")}>
          ← Volver
        </button>
        {loading ? (
          <p>Cargando productos...</p>
        ) : !categoriaSeleccionada ? (
          <p>No se encontró la categoría.</p>
        ) : (
          <VistaProductos
            productos={productosFiltrados}
            categoria={categoriaSeleccionada}
            carrito={carrito}
            onAgregar={toggleProducto}
            onVolver={() => navigate("/tienda")}
          />
        )}
      </div>
    </div>
  );
};

export default TiendaCategoriaDetalle;
