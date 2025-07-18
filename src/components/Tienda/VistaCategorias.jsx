import React from "react";

const VistaCategorias = ({ categoriasAgrupadas, setCategoriaSeleccionada }) => {
  return (
    <div className="categorias-grid">
      {categoriasAgrupadas.map((cat) => (
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
  );
};

export default VistaCategorias;