import  { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import toast from "react-hot-toast";
import "../styles/rangoSelectorAnimado.scss";

const RANGOS = [
  {
    id: "nova",
    nombre: "NOVA",
    imagen: "/assets/rangos/nova.webp",
    precio30d: 300,
    precioPerma: 1800,
    beneficios_30d: {
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
      dinero: "50.000 $",
      ecos: 150,
      keys_survival: "8 / 3 / -",
      keys_oneblock: "8 / 3 / -",
      materiales: true,
      kit: "Diamante encantado",
      comida: "16 Zanahorias doradas"
    },
    beneficios_perma: {
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
    beneficios_30d: {
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
      dinero: "110.000 $",
      ecos: 250,
      keys_survival: "20 / 8 / -",
      keys_oneblock: "20 / 8 / -",
      materiales: true,
      kit: "Netherita full",
      comida: "64 Manzanas doradas"
    },
    beneficios_perma: {
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
    beneficios_30d: {
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
      dinero: "230.000 $",
      ecos: 450,
      keys_survival: "35 / 18 / 5",
      keys_oneblock: "35 / 18 / 5",
      materiales: true,
      kit: "Netherita OP",
      comida: "16 Manzanas Encantadas"
    },
    beneficios_perma: {
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
  const [modo, setModo] = useState("perma");
  const [rangoSeleccionado, setRangoSeleccionado] = useState(null);
  const [confirmando, setConfirmando] = useState(false);
  const { user, setUser } = useContext(UserContext);

  const handleComprar = (rango, tipo) => {
    const precio = tipo === "30d" ? rango.precio30d : rango.precioPerma;
    if (!user) {
      toast.error("Debes iniciar sesión para comprar un rango.");
      return;
    }
    if (user.ecos < precio) {
      toast.error(`No tienes suficientes ECOS. Necesitas ${precio}.`);
      return;
    }
    setRangoSeleccionado({ rango, tipo, precio });
    setConfirmando(true);
  };

  const confirmarCompra = async () => {
  if (!rangoSeleccionado) return;
  const { rango, tipo, precio } = rangoSeleccionado;

  try {
    const res = await fetch("https://flancraftweb-backend.onrender.com/api/rangos/comprar-rango", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        uuid: user.uuid,
        rango: rango.id,
        tipo,
        precio,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Error al comprar el rango");

    toast.success(`¡Has comprado el rango ${rango.nombre} (${tipo})!`);
    setConfirmando(false);

    // ✅ Actualiza los ECOS visualmente sin recargar
    setUser({
      ...user,
      ecos: user.ecos - precio,
    });
  } catch (err) {
    console.error("Error en la compra:", err);
    toast.error("Hubo un problema al procesar la compra.");
  }
};



  return (
    <section className="rango-selector-epico">
      <div className="rango-banner-hero">
        <div className="banner-overlay">
          <h1>Rangos Épicos</h1>
          <p>Elige el rango que más se adapta a tu aventura. Puedes ver sus beneficios en modalidad 30 días o permanente.</p>
        </div>
      </div>

      <div className="rango-banner-textura modo-toggle-wrapper">
        <div className="modo-toggle">
          <button className={modo === "30d" ? "activo" : ""} onClick={() => setModo("30d")}>Beneficios 30 Días</button>
          <button className={modo === "perma" ? "activo" : ""} onClick={() => setModo("perma")}>Beneficios Permanentes</button>
        </div>
      </div>

      <div className="tabla-rangos">
        <div className="tabla-header">
          <div className="columna-beneficios"></div>
          {RANGOS.map((rango) => (
            <div key={rango.id} className="columna-rango">
              <img src={rango.imagen} alt={`Rango ${rango.nombre}`} className="imagen-rango" />
              <h2 className="nombre-rango">{rango.nombre}</h2>
              <div className="botones-compra">
                {modo === "30d" ? (
                  <button className="boton-compra btn-30" onClick={() => handleComprar(rango, "30d")}>
                    {rango.precio30d}
                    <img src="/assets/eco.png" alt="eco" className="eco-mini" /> 30 Días
                  </button>
                ) : (
                  <button className="boton-compra btn-perma" onClick={() => handleComprar(rango, "perma")}>
                    {rango.precioPerma}
                    <img src="/assets/eco.png" alt="eco" className="eco-mini" /> Permanente
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="tabla-body">
          {FILAS.map((fila) => (
            <div key={fila.clave} className="fila-beneficio">
              <div className="beneficio-label">{fila.label}</div>
              {RANGOS.map((rango) => {
                const valor = rango[`beneficios_${modo}`][fila.clave];
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
                        <img src="/assets/check.png" alt="Sí" className={`icono-check ${claseCheck}`} />
                      ) : (
                        <span className="no-disponible">X</span>
                      )
                    ) : fila.clave === "ecos" ? (
                      <span className={`valor-num ${claseColor}`}>
                        {valor}
                        {Array.from({ length: rango.id === "inmortal" ? 3 : rango.id === "alpha" ? 2 : 1 }).map((_, i) => (
                          <img key={i} src="/assets/eco.png" alt="ECOS" className="eco-icono derecha" />
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

      {confirmando && rangoSeleccionado && (
        <div className="modal-compra">
          <div className="modal-contenido">
            <h3>¿Confirmar compra?</h3>
            <p>
              Vas a comprar el rango{" "}
              <strong>{rangoSeleccionado.rango.nombre}</strong> (
              {rangoSeleccionado.tipo}) por{" "}
              <strong>{rangoSeleccionado.precio} ECOS</strong>
            </p>
            <button className="btn-confirmar" onClick={confirmarCompra}>Confirmar</button>
            <button className="btn-cancelar" onClick={() => setConfirmando(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </section>
  );
}
