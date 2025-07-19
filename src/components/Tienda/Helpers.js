// Imagenes personalizadas por grupo
const imagenesPersonalizadas = {
  RANGOS: "/tienda/categorias/rangos.png",
  SURVIVAL: "/tienda/categorias/survival.png",
  ONEBLOCK: "/tienda/categorias/oneblock.png",
  POKEBOX: "/tienda/categorias/pokebox.png",
  "PREMIUM FLAN": "/tienda/categorias/premium_flan.png",
  "¡ANTES DE COMPRAR!": "/tienda/categorias/antes.png",
};

// Agrupaciones manuales de subcategorías por grupo
const agrupaciones = {
  RANGOS: ["Rangos Permanentes", "Rangos Mensuales"],
  SURVIVAL: [
    "Keys Clásicas",
    "Keys Avanzadas",
    "Protecciones",
    "Monedas Elite",
    "Experiencia",
    "Kits",
    "Items OP",
    "Pase de Batalla",
    "TICKETS KOTH",
  ],
  ONEBLOCK: ["Keys Avanzadas", "Keys Clásicas"],
  POKEBOX: ["Keys", "Pokemons", "Monedas", "Experiencia"],
  "PREMIUM FLAN": ["PREMIUM FLAN"],
};

// Categorías que deben ignorarse
const categoriasIgnoradas = ["ECOS", "Minions"];


// Agrupa las categorías originales según las reglas definidas
export function agruparCategorias(categoriasOriginales) {
  console.log("🟢 Nombres REALES de categorías que devuelve la API:");
  if (!Array.isArray(categoriasOriginales)) {
    console.warn("⚠️ categoriasOriginales no es un array válido:", categoriasOriginales);
    return [];
  }

  console.log(
    categoriasOriginales
      .filter((c) => c && typeof c.name === "string")
      .map((c) => c.name)
  );

  const agrupadas = [];

  for (const [grupo, nombres] of Object.entries(agrupaciones)) {
    const incluidas = categoriasOriginales.filter(
      (c) => c && nombres.includes(c.name) && !categoriasIgnoradas.includes(c.name)
    );

    if (incluidas.length > 0) {
      agrupadas.push({
        id: `agrupado-${grupo.toLowerCase().replace(/\s/g, "-")}`,
        name: grupo,
        image: imagenesPersonalizadas[grupo],
        subcategorias: incluidas,
      });
    }
  }

  // Agrega categorías que no están agrupadas ni ignoradas
  categoriasOriginales.forEach((cat) => {
    if (
      cat &&
      !agrupadas.some((grupo) => grupo.subcategorias.some((c) => c.id === cat.id)) &&
      !categoriasIgnoradas.includes(cat.name)
    ) {
      agrupadas.push({
        id: `categoria-${cat.id}`,
        name: cat.name,
        image: imagenesPersonalizadas[cat.name] || cat.image,
        subcategorias: [cat],
      });
    }
  });

  return agrupadas;
}

// Cálculo total del carrito
export function calcularTotal(carrito) {
  return carrito.reduce((total, item) => {
    const cantidad = item.cantidad ?? 1;
    return total + item.price * cantidad;
  }, 0).toFixed(2);
}
