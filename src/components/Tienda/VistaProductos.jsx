import React from "react";

const VistaProductos = ({ productos, categoria, carrito, onAgregar, onVolver }) => {
  return (
    <div className="productos-grid">
      <button className="volver" onClick={onVolver}>
        ← Volver
      </button>
      <h2>{categoria.name}</h2>

      {productos.map((prod) => {
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
              onClick={() => onAgregar(prod)}
            >
              {enCarrito ? "Quitar del carrito" : "Añadir al carrito"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default VistaProductos;