import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VistaProductos from "./VistaProductos";
import { agruparCategorias } from "./Helpers";
import "../../styles/pages/_tiendatebex.scss";

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://flancraftweb-backend.onrender.com";

const TiendaCategoriaDetalle = ({ carrito, toggleProducto }) => {
  const { modo, subcategoria } = useParams();
  const navigate = useNavigate();

  const [paquetes, setPaquetes] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tebex/datos`);
        const data = await res.json();

        const agrupadas = agruparCategorias(data.categorias);
        const encontrada = agrupadas.find(
          (cat) => cat.name.toLowerCase().replace(/ /g, "-") === modo
        );

        setCategoriaSeleccionada(encontrada || null);
        setPaquetes(data.paquetes || []);
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
        categoriaSeleccionada.subcategorias?.some((cat) => p.category?.id === cat.id)
      )
    : [];

  return (
    <div className="tienda-tebex">
      <div className="tienda-contenido">
        {loading ? (
          <p>Cargando productos...</p>
        ) : !categoriaSeleccionada ? (
          <p>No se encontró la categoría.</p>
        ) : (
          <VistaProductos
            key={`${modo}-${subcategoria || "root"}`} // ✅ Fuerza remount en cambios
            productos={productosFiltrados}
            categoria={categoriaSeleccionada}
            carrito={carrito}
            toggleProducto={toggleProducto}
            subcategoriaSeleccionadaURL={subcategoria}
            onVolver={() => navigate(-1)} // ✅ Volver correctamente
          />
        )}
      </div>
    </div>
  );
};

export default TiendaCategoriaDetalle;
