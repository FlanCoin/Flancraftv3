import React, { useState } from "react";
import CarritoLateral from "./CarritoLateral";
import { useCarrito } from "./useCarrito";

const SUBCATEGORIAS_SURVIVAL = {
  "Keys Clásicas": ["clásica", "clásicas", "classic", "key clásica"],
  "Keys Avanzadas": ["avanzada", "avanzadas"],
  "Protecciones": ["protección", "protecciones", "resguardo"],
  "Monedas Elite": ["moneda elite", "monedas elite"],
  "Experiencia": ["experiencia", "xp"],
  "Kits": ["kit"],
  "Items OP": ["item op", "op"],
  "Pase de Batalla": ["pase de batalla", "battle pass"],
  "TICKETS KOTH": ["koth", "ticket"]
};

function obtenerSubcategoria(prod) {
  const nombre = prod.name.toLowerCase();
  for (const [subcat, keywords] of Object.entries(SUBCATEGORIAS_SURVIVAL)) {
    if (keywords.some((k) => nombre.includes(k))) {
      return subcat;
    }
  }
  return "Otros";
}

const VistaProductos = ({ productos, categoria, onVolver, nombreConfirmado }) => {
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(null);

  const {
    carrito,
    toggleProducto,
    mostrarLogin,
    setMostrarLogin,
    calcularTotal
  } = useCarrito(nombreConfirmado);

  const productosAgrupados = productos.reduce((acc, prod) => {
    const subcat = obtenerSubcategoria(prod);
    if (!acc[subcat]) acc[subcat] = [];
    acc[subcat].push(prod);
    return acc;
  }, {});

  const handleVolverSubcategoria = () => {
    setSubcategoriaSeleccionada(null);
  };

  return (
    <div className="tienda-contenido">
      {/* 🧱 Columna izquierda: productos */}
      <div className="vista-productos">
        <button
          className="volver"
          onClick={subcategoriaSeleccionada ? handleVolverSubcategoria : onVolver}
        >
          ← Volver
        </button>

        <h2 className="titulo-categoria">{categoria.name}</h2>

        {subcategoriaSeleccionada ? (
          <>
            <h3 className="subcategoria-titulo">{subcategoriaSeleccionada}</h3>
            <div className="productos-grid">
              {productosAgrupados[subcategoriaSeleccionada].map((prod) => {
                const enCarrito = carrito.some((p) => p.id === prod.id);
                return (
                  <div key={prod.id} className="producto-card">
                    <img src={prod.image} alt={prod.name} />
                    <h3>{prod.name}</h3>
                    <div
                      className="producto-descripcion"
                      dangerouslySetInnerHTML={{ __html: prod.description }}
                    />
                    <p className="producto-precio">{prod.price} €</p>
                    <button
                      className={enCarrito ? "btn-quitar" : "btn-agregar"}
                      onClick={() => toggleProducto(prod)}
                    >
                      {enCarrito ? "Quitar del carrito" : "Añadir al carrito"}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <p className="subtitulo">Selecciona una subcategoría:</p>
            <div className="subcategoria-grid-visual">
              {Object.keys(productosAgrupados).map((subcat) => (
                <div
                  key={subcat}
                  className="subcategoria-visual-card"
                  onClick={() => setSubcategoriaSeleccionada(subcat)}
                >
                  <img
                    src={`/tienda/subcategorias/${subcat
                      .toLowerCase()
                      .replace(/ /g, "_")}.png`}
                    alt={subcat}
                  />
                  <span>{subcat}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 🛒 Columna derecha: carrito lateral */}
      <CarritoLateral
        carrito={carrito}
        onAgregar={toggleProducto}
        nombreConfirmado={nombreConfirmado}
        onLoginClick={() => setMostrarLogin(true)}
        calcularTotal={calcularTotal}
      />
    </div>
  );
};

export default VistaProductos;
