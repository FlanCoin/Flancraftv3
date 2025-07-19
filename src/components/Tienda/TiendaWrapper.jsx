import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import TiendaCategorias from "./TiendaCategorias";
import TiendaCategoriaDetalle from "./TiendaCategoriaDetalle";
import CarritoLateral from "./CarritoLateral";
import ModalLogin from "./ModalLogin";
import { useCarrito } from "./useCarrito";
import VistaProductos from "./VistaProductos";
import "../../styles/pages/_tiendatebex.scss";

const TiendaWrapper = () => {
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [nombreConfirmado, setNombreConfirmado] = useState(() => localStorage.getItem("nombreJugador") || "");
  const [uuidConfirmado, setUuidConfirmado] = useState(() => localStorage.getItem("uuidJugador") || "");
  const [moneda, setMoneda] = useState(() => localStorage.getItem("monedaSeleccionada") || "EUR");
  const { carrito, toggleProducto } = useCarrito(nombreConfirmado);

  useEffect(() => {
    if (!localStorage.getItem("nombreJugador")) {
      setMostrarLogin(true);
    }
  }, []);

  const confirmarNombre = (nombre, uuid) => {
    localStorage.setItem("nombreJugador", nombre);
    localStorage.setItem("uuidJugador", uuid);
    setNombreConfirmado(nombre);
    setUuidConfirmado(uuid);
    setMostrarLogin(false);
  };

  const handleMonedaChange = (e) => {
    const nuevaMoneda = e.target.value;
    setMoneda(nuevaMoneda);
    localStorage.setItem("monedaSeleccionada", nuevaMoneda);
  };

  return (
    <div className="tienda-layout">
      {mostrarLogin && (
        <ModalLogin
          onConfirmar={confirmarNombre}
          onCancelar={() => setMostrarLogin(false)}
        />
      )}

      <div className="tienda-contenido">
        <Routes>
          <Route path="/" element={<TiendaCategorias />} />
          <Route path="/:modo" element={<TiendaCategoriaDetalle carrito={carrito} toggleProducto={toggleProducto} />} />
          <Route path="/:modo/:subcategoria" element={
            <TiendaCategoriaDetalle carrito={carrito} toggleProducto={toggleProducto} />
          } />
        </Routes>
      </div>

      <CarritoLateral
        carrito={carrito}
        onAgregar={toggleProducto}
        nombreConfirmado={nombreConfirmado}
        uuidConfirmado={uuidConfirmado}
        monedaSeleccionada={moneda}
        onMonedaChange={handleMonedaChange}
        onLoginClick={() => setMostrarLogin(true)}
      />
    </div>
  );
};

export default TiendaWrapper;
