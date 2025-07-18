import React, { useEffect, useState } from "react";
import "../styles/pages/_tiendatebex.scss";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const imagenesPersonalizadas = {
  RANGOS: "/tienda/rangos.png",
  SURVIVAL: "/tienda/categorias/survival.png",
  ONEBLOCK: "/tienda/categorias/oneblock.png",
  POKEBOX: "/tienda/categorias/pokebox.png",
  "PREMIUM FLAN": "/tienda/categorias/premium_flan.png",
  "¡ANTES DE COMPRAR!": "/tienda/categorias/antes.png",
};

const agrupaciones = {
  RANGOS: ["Rangos Permanentes", "Rangos Mensuales"],
};

const Tienda = () => {
  const [jugador, setJugador] = useState("");
  const [nombreConfirmado, setNombreConfirmado] = useState(
    localStorage.getItem("nombreJugador") || ""
  );
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [productoPendiente, setProductoPendiente] = useState(null);

  const [categoriasOriginales, setCategoriasOriginales] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [carrito, setCarrito] = useState(
    JSON.parse(localStorage.getItem("carrito")) || []
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerDatosTienda();
  }, []);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    if (nombreConfirmado) {
      localStorage.setItem("nombreJugador", nombreConfirmado);
    }
  }, [nombreConfirmado]);

  const obtenerDatosTienda = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tebex/datos`);
      const data = await res.json();
      setCategoriasOriginales(data.categorias || []);
      setPaquetes(data.paquetes || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la tienda.");
      setLoading(false);
    }
  };

  const handleAgregarAlCarrito = (producto) => {
    if (!nombreConfirmado) {
      setProductoPendiente(producto);
      setMostrarLogin(true);
      return;
    }

    const existe = carrito.some((p) => p.id === producto.id);
    if (existe) {
      setCarrito(carrito.filter((p) => p.id !== producto.id));
    } else {
      setCarrito([...carrito, producto]);
    }
  };

  const handleConfirmarNombre = () => {
    if (!jugador.trim()) return;
    setNombreConfirmado(jugador.trim());
    setMostrarLogin(false);

    if (productoPendiente) {
      const yaEsta = carrito.some((p) => p.id === productoPendiente.id);
      if (!yaEsta) {
        setCarrito([...carrito, productoPendiente]);
      }
      setProductoPendiente(null);
    }
  };

  const calcularTotal = () =>
    carrito.reduce((acc, item) => acc + parseFloat(item.price), 0).toFixed(2);

  const categoriasAgrupadas = () => {
    const agrupadas = [];

    for (const [grupo, ids] of Object.entries(agrupaciones)) {
      agrupadas.push({
        id: `agrupado-${grupo}`,
        name: grupo,
        image: imagenesPersonalizadas[grupo],
        categoriasIncluidas: categoriasOriginales.filter((c) =>
          ids.includes(c.name)
        ),
      });
    }

    categoriasOriginales.forEach((cat) => {
      const yaIncluida = agrupadas.some((grupo) =>
        grupo.categoriasIncluidas?.some((sub) => sub.id === cat.id)
      );
      if (!yaIncluida) {
        agrupadas.push({
          id: cat.id,
          name: cat.name,
          image: imagenesPersonalizadas[cat.name] || cat.image,
          categoriasIncluidas: [cat],
        });
      }
    });

    return agrupadas;
  };

  const productosFiltrados = categoriaSeleccionada
    ? paquetes.filter((p) =>
        categoriaSeleccionada.categoriasIncluidas.some(
          (cat) => p.category?.id === cat.id
        )
      )
    : [];

  return (
    <div className="tienda-tebex">
      {/* COLUMNA IZQUIERDA */}
      <div className="tienda-contenido">
        <h1>Tienda Oficial de FlanCraft</h1>

        {loading && <p>Cargando productos...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !categoriaSeleccionada && (
          <div className="categorias-grid">
            {categoriasAgrupadas().map((cat) => (
              <div
                key={cat.id}
                className="categoria-card"
                onClick={() => setCategoriaSeleccionada(cat)}
              >
                <img src={cat.image} alt={cat.name} />
                <h2>{cat.name}</h2>
                <button>Ver productos</button>
              </div>
            ))}
          </div>
        )}

        {!loading && categoriaSeleccionada && (
          <div className="productos-grid">
            <button
              className="volver"
              onClick={() => setCategoriaSeleccionada(null)}
            >
              ← Volver
            </button>
            <h2>{categoriaSeleccionada.name}</h2>

            {productosFiltrados.map((prod) => {
              const enCarrito = carrito.some((p) => p.id === prod.id);
              return (
                <div key={prod.id} className="producto-card">
                  <img src={prod.image} alt={prod.name} />
                  <h3>{prod.name}</h3>
                  <div
                    className="producto-descripcion"
                    dangerouslySetInnerHTML={{ __html: prod.description }}
                  />
                  <p>{prod.price} €</p>
                  <button
                    className={enCarrito ? "btn-quitar" : "btn-agregar"}
                    onClick={() => handleAgregarAlCarrito(prod)}
                  >
                    {enCarrito ? "Quitar del carrito" : "Añadir al carrito"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* COLUMNA DERECHA */}
      <div className="carrito-wrapper">
        <div className="carrito-usuario">
          {nombreConfirmado ? (
            <p className="jugador-confirmado">👤 {nombreConfirmado}</p>
          ) : (
            <button onClick={() => setMostrarLogin(true)}>
              Invitado (Login)
            </button>
          )}
        </div>

        <div className="carrito-listado">
          <h3>CARRITO</h3>
          {carrito.length === 0 ? (
            <p className="vacio">Tu carrito está vacío</p>
          ) : (
            carrito.map((item, i) => (
              <div key={i} className="item-carrito">
                <span>{item.name}</span>
                <span>{item.price} €</span>
                <button onClick={() => handleAgregarAlCarrito(item)}>❌</button>
              </div>
            ))
          )}
        </div>

        <div className="carrito-total">
          <p>Total: <strong>{calcularTotal()} €</strong></p>
          <button className="checkout">Ir al pago</button>
        </div>
      </div>

      {/* MODAL LOGIN */}
      {mostrarLogin && (
        <div className="modal-login">
          <div className="modal-contenido">
            <h2>Ingresa tu nombre de jugador</h2>
            <input
              type="text"
              placeholder="Tu nombre de Minecraft"
              value={jugador}
              onChange={(e) => setJugador(e.target.value)}
            />
            <button onClick={handleConfirmarNombre}>Confirmar</button>
            <button className="cerrar" onClick={() => setMostrarLogin(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tienda;
