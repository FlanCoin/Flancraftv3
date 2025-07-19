import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function obtenerSubcategoria(prod, subcategorias) {
  if (!prod.category?.id) return "Otros";
  const match = subcategorias.find((subcat) => subcat.id === prod.category.id);
  return match?.name || "Otros";
}

const VistaProductos = ({
  productos,
  categoria,
  onVolver,
  carrito,
  toggleProducto,
  subcategoriaSeleccionadaURL = null,
}) => {
  const navigate = useNavigate();

  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(null);
  const [nombresVisibles, setNombresVisibles] = useState({});

  useEffect(() => {
    if (subcategoriaSeleccionadaURL) {
      setSubcategoriaSeleccionada(
        decodeURIComponent(subcategoriaSeleccionadaURL.replace(/-/g, " "))
      );
    }
  }, [subcategoriaSeleccionadaURL]);

  // Agrupar productos por subcategoría (clave en minúscula)
  const productosAgrupados = productos.reduce((acc, prod) => {
    const original = obtenerSubcategoria(prod, categoria.subcategorias);
    const key = original.toLowerCase();
    if (!acc[key]) acc[key] = [];
    acc[key].push(prod);
    return acc;
  }, {});

  // Mapeo de nombres visibles (subcategoría con capitalización correcta)
  useEffect(() => {
    const visibles = {};
    productos.forEach((prod) => {
      const original = obtenerSubcategoria(prod, categoria.subcategorias);
      const key = original.toLowerCase();
      visibles[key] = original;
    });
    setNombresVisibles(visibles);
  }, [productos, categoria.subcategorias]);

const handleVolverSubcategoria = () => {
  if (window.history.length > 2) {
    navigate(-1);
  } else {
    // fallback manual si no hay historial suficiente
    const baseCategoria = `/tienda/${categoria.name.toLowerCase().replace(/ /g, "-")}`;
    navigate(baseCategoria);
  }
};

  return (
    <div className="vista-productos">
<button
  className="volver"
  onClick={subcategoriaSeleccionada ? handleVolverSubcategoria : onVolver}
>
  Volver Atras
</button>

      <h2 className="titulo-categoria">{categoria.name}</h2>

      {subcategoriaSeleccionada ? (
        <div className="contenido-productos">
          <h3 className="subcategoria-titulo">
            {nombresVisibles[subcategoriaSeleccionada.toLowerCase()] ||
              subcategoriaSeleccionada}
          </h3>
          <div className="productos-grid">
            {productosAgrupados[subcategoriaSeleccionada.toLowerCase()]?.map(
              (prod) => {
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
              }
            )}
          </div>
        </div>
      ) : (
        <>
          <p className="subtitulo">Selecciona una subcategoría:</p>
          <div className="subcategoria-grid-visual">
            {Object.keys(productosAgrupados).map((subcatKey) => (
              <div
                key={subcatKey}
                className="subcategoria-visual-card"
                onClick={() =>
                  navigate(
                    `/tienda/${categoria.name
                      .toLowerCase()
                      .replace(/ /g, "-")}/${subcatKey.replace(/ /g, "-")}`
                  )
                }
              >
                <img
                  src={`/tienda/subcategorias/${subcatKey.replace(/ /g, "_")}.png`}
                  alt={nombresVisibles[subcatKey] || subcatKey}
                />
                <span>{nombresVisibles[subcatKey] || subcatKey}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VistaProductos;
