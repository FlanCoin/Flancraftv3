import React, { useState, useEffect } from "react";
import "../../styles/pages/_tiendatebex.scss";
import VistaCategorias from "./VistaCategorias";
import VistaProductos from "./VistaProductos";
import CarritoLateral from "./CarritoLateral";
import ModalLogin from "./ModalLogin";
import { agruparCategorias } from "./helpers";
import { useCarrito } from "./useCarrito";

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://flancraftweb-backend.onrender.com";

const Tienda = () => {
  const [jugador, setJugador] = useState("");
  const [nombreConfirmado, setNombreConfirmado] = useState(
    localStorage.getItem("nombreJugador") || ""
  );
  const [categorias, setCategorias] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

const {
  carrito,
  toggleProducto,
  mostrarLogin,
  setMostrarLogin,
  confirmarPendiente,
  calcularTotal,
} = useCarrito(nombreConfirmado);

  useEffect(() => {
    const obtener = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tebex/datos`);
        const data = await res.json();
        setCategorias(data.categorias || []);
        setPaquetes(data.paquetes || []);
      } catch {
        setError("No se pudo cargar la tienda.");
      } finally {
        setLoading(false);
      }
    };
    obtener();
  }, []);

  useEffect(() => {
    if (nombreConfirmado) {
      localStorage.setItem("nombreJugador", nombreConfirmado);
    }
  }, [nombreConfirmado]);

  const handleConfirmarNombre = () => {
    if (!jugador.trim()) return;
    setNombreConfirmado(jugador.trim());
    confirmarPendiente();
  };

  const categoriasAgrupadas = agruparCategorias(categorias);

  const productosFiltrados = categoriaSeleccionada
    ? paquetes.filter((p) =>
        categoriaSeleccionada.categoriasIncluidas.some(
          (cat) => p.category?.id === cat.id
        )
      )
    : [];

  return (
    <div className="tienda-tebex">
      <div className="tienda-contenido">
        <h1>Tienda Oficial de FlanCraft</h1>

        {loading && <p>Cargando productos...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !categoriaSeleccionada && (
          <VistaCategorias
            categoriasAgrupadas={categoriasAgrupadas}
            setCategoriaSeleccionada={setCategoriaSeleccionada}
          />
        )}

        {!loading && categoriaSeleccionada && (
          <VistaProductos
            productos={productosFiltrados}
            categoria={categoriaSeleccionada}
            carrito={carrito}
            onAgregar={toggleProducto}
            onVolver={() => setCategoriaSeleccionada(null)}
          />
        )}
      </div>

      <CarritoLateral
        carrito={carrito}
        onAgregar={toggleProducto}
        nombreConfirmado={nombreConfirmado}
        onLoginClick={() => setMostrarLogin(true)}
        calcularTotal={calcularTotal}
      />

      {mostrarLogin && (
        <ModalLogin
          jugador={jugador}
          setJugador={setJugador}
          onConfirmar={handleConfirmarNombre}
          onCerrar={() => setMostrarLogin(false)}
        />
      )}
    </div>
  );
};

export default Tienda;
