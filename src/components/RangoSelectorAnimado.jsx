import React from "react";
import "../styles/rangoSelectorAnimado.scss";

const RANGOS = [
  {
    id: "nova",
    nombre: "NOVA",
    imagen: "/assets/rangos/nova.webp",
    precio30d: 300,
    precioPerma: 1800,
    beneficios: {
      acceso_lleno: true,
      prefijo: true,
      subastas: 30,
      warps: 15,
      tiendas: 20,
      comandos_basicos: true,
      comandos_extra: false,
      comandos_avanzados: false,
      cambiar_spawner: false,
      sethomes: 10,
      dinero: "250.000 $",
      ecos: 1200,
      keys_survival: "32 / 12 / -",
      keys_oneblock: "32 / 12 / -",
      materiales: true,
      kit: "Diamante encantado",
      comida: "16 Zanahorias doradas"
    }
  },
  {
    id: "alpha",
    nombre: "ALPHA",
    imagen: "/assets/rangos/alpha.webp",
    precio30d: 600,
    precioPerma: 2700,
    beneficios: {
      acceso_lleno: true,
      prefijo: true,
      subastas: 40,
      warps: 20,
      tiendas: 30,
      comandos_basicos: true,
      comandos_extra: true,
      comandos_avanzados: false,
      cambiar_spawner: true,
      sethomes: 20,
      dinero: "600.000 $",
      ecos: 2100,
      keys_survival: "48 / 22 / -",
      keys_oneblock: "48 / 22 / -",
      materiales: true,
      kit: "Netherita full",
      comida: "64 Manzanas doradas"
    }
  },
  {
    id: "inmortal",
    nombre: "INMORTAL",
    imagen: "/assets/rangos/inmortal.webp",
    precio30d: 900,
    precioPerma: 3400,
    beneficios: {
      acceso_lleno: true,
      prefijo: true,
      subastas: 45,
      warps: 30,
      tiendas: 40,
      comandos_basicos: true,
      comandos_extra: true,
      comandos_avanzados: true,
      cambiar_spawner: true,
      sethomes: 50,
      dinero: "1.100.000 $",
      ecos: 2600,
      keys_survival: "80 / 32 / 15",
      keys_oneblock: "80 / 32 / 15",
      materiales: true,
      kit: "Netherita OP",
      comida: "16 Manzanas encantadas"
    }
  }
];

const FILAS = [
  { clave: "prefijo", label: "Prefijo personalizado en chat y TAB" },
  { clave: "acceso_lleno", label: "Acceso cuando el servidor está lleno" },
  { clave: "ecos", label: "ECOS" },
  { clave: "dinero", label: "Dinero del servidor" },
  { clave: "subastas", label: "Subastas permitidas" },
  { clave: "warps", label: "Warps personales" },
  { clave: "tiendas", label: "Tiendas personales" },
  { clave: "sethomes", label: "Puntos de sethome" },
  { clave: "keys_survival", label: "Keys Survival (Voto / Leg / Mítica)" },
  { clave: "keys_oneblock", label: "Keys OneBlock (Básica / Épica / Leg)" },
  { clave: "materiales", label: "Materiales especiales" },
  { clave: "kit", label: "Kit exclusivo" },
  { clave: "comida", label: "Comida especial" },
  { clave: "comandos_basicos", label: "Comandos básicos (/afk, /back...)" },
  { clave: "comandos_extra", label: "Comandos extra (/nick, /near...)" },
  { clave: "cambiar_spawner", label: "Cambiar mob del Spawner con Huevo" },
  { clave: "comandos_avanzados", label: "Comandos avanzados (/fly, /repairall...)" }
];

export default function RangoSelectorAnimado() {
  return (
    <section className="rango-selector-epico">
      <div className="rango-banner-hero">
        <div className="banner-overlay">
          <h1>Rangos Épicos</h1>
          <p>
            Elige el rango que más se adapta a tu aventura. Todos otorgan poderosas
            ventajas en el mundo de FlanCraft.
          </p>
        </div>
      </div>

      <div className="rango-banner-textura"></div>

      <div className="tabla-rangos">
        <div className="tabla-header">
          <div className="columna-beneficios"></div>
          {RANGOS.map((rango) => (
            <div key={rango.id} className="columna-rango">
              <img src={rango.imagen} alt={`Rango ${rango.nombre}`} className="imagen-rango" />
              <h2 className="nombre-rango">{rango.nombre}</h2>
              <div className="botones-compra">
                <button className="boton-compra btn-30">
                  {rango.precio30d}
                  <img src="/assets/eco.png" alt="eco" className="eco-mini" /> 30 Días
                </button>
                <button className="boton-compra btn-perma">
                  {rango.precioPerma}
                  <img src="/assets/eco.png" alt="eco" className="eco-mini" /> Permanente
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="tabla-body">
          {FILAS.map((fila) => (
            <div key={fila.clave} className="fila-beneficio">
              <div className="beneficio-label">{fila.label}</div>
              {RANGOS.map((rango) => {
                const valor = rango.beneficios[fila.clave];
                const claseColor = fila.clave === "dinero"
                  ? "verde-economico"
                  : fila.clave === "ecos"
                  ? "azul-ecos"
                  : ["sethomes", "subastas", "warps", "tiendas"].includes(fila.clave)
                  ? "amarillo-beneficio"
                  : ["keys_survival", "keys_oneblock"].includes(fila.clave)
                  ? "violeta-keys"
                  : ["kit", "comida"].includes(fila.clave)
                  ? "dorado-kit"
                  : "";

                const claseCheck = fila.clave.includes("avanzados")
                  ? "check-avanzado"
                  : fila.clave.includes("extra")
                  ? "check-extra"
                  : "check-basico";

                return (
                  <div key={rango.id + fila.clave} className="beneficio-celda">
                    {typeof valor === "boolean" ? (
                      valor ? (
                        <img
                          src="/assets/check.png"
                          alt="Sí"
                          className={`icono-check ${claseCheck}`}
                        />
                      ) : (
                        <span className="no-disponible">X</span>
                      )
                    ) : fila.clave === "ecos" ? (
                      <span className={`valor-num ${claseColor}`}>
                        {valor}
                        {Array.from({ length: rango.id === "inmortal" ? 3 : rango.id === "alpha" ? 2 : 1 }).map((_, i) => (
                          <img
                            key={i}
                            src="/assets/eco.png"
                            alt="ECOS"
                            className="eco-icono derecha"
                          />
                        ))}
                      </span>
                    ) : fila.clave === "kit" ? (
                      <div className="kit-con-icono">
                        <img
                          src={
                            valor.toLowerCase().includes("op")
                              ? "/assets/netheritafull.png"
                              : valor.toLowerCase().includes("netherita")
                              ? "/assets/netherita.png"
                              : "/assets/diamante.png"
                          }
                          alt="Kit Icon"
                          className="kit-icono"
                        />
                        <span className={`valor-num ${claseColor}`}>{valor}</span>
                      </div>
                    ) : (
                      <span className={`valor-num ${claseColor}`}>{valor}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
