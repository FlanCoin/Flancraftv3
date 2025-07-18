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

export function agruparCategorias(categoriasOriginales) {
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
}
