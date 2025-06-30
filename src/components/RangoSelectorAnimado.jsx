import  { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import toast from "react-hot-toast";
import "../styles/rangoSelectorAnimado.scss";

const RANGOS = [
  {
    id: "nova",
    nombre: "NOVA",
    imagen: "/assets/rangos/nova.webp",
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
    },
    kit_detallado: [
      "Casco de Diamante (Respiración 3, Protección 3, Irrompibilidad 3, Reparación 1)",
      "Pechera de Diamante (Protección 3, Irrompibilidad 3, Reparación 1)",
      "Pantalones de Diamante (Protección 3, Irrompibilidad 3, Reparación 1)",
      "Botas de Diamante (Protección 3, Irrompibilidad 3, Reparación 1)",
      "Espada de Diamante (Filo 3, Botín 3, Irrompibilidad 3, Reparación 1)",
      "Pico de Diamante (Eficiencia 2, Fortuna 2, Irrompibilidad 2, Reparación 2)",
      "Hacha de Diamante (Eficiencia 2, Irrompibilidad 2, Reparación 1)",
      "Pala de Diamante (Eficiencia 2, Irrompibilidad 2, Reparación 1)",
      "Azada de Diamante (Eficiencia 2, Irrompibilidad 2, Reparación 1)"
    ]
  },
  {
    id: "alpha",
    nombre: "ALPHA",
    imagen: "/assets/rangos/alpha.webp",
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
    },
    kit_detallado: [
      "Casco de Netherita (Respiración 5, Protección 5, Irrompibilidad 5, Reparación 1, Espinas 3)",
      "Pechera de Netherita (Protección 5, Irrompibilidad 5, Reparación 1, Espinas 3)",
      "Pantalones de Netherita (Protección 5, Irrompibilidad 5, Reparación 1, Espinas 3)",
      "Botas de Netherita (Protección 5, Irrompibilidad 5, Reparación 1, Espinas 3)",
      "Espada de Netherita (Filo 5, Barrido 2, Aspecto Ígneo 2, Botín 5, Irrompibilidad 5, Reparación 1)",
      "Pico de Netherita (Eficiencia 5, Fortuna 5, Irrompibilidad 5, Reparación 1)",
      "Pico de Netherita (Eficiencia 5, Toque de Seda 1, Irrompibilidad 5, Reparación 1)",
      "Hacha de Netherita (Eficiencia 5, Irrompibilidad 5, Reparación 1)",
      "Pala de Netherita (Eficiencia 5, Irrompibilidad 5, Reparación 1)",
      "Azada de Netherita (Eficiencia 5, Irrompibilidad 5, Reparación 1)"
    ]
  },
  {
    id: "inmortal",
    nombre: "INMORTAL",
    imagen: "/assets/rangos/inmortal.webp",
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
    },
    kit_detallado: [
      "Casco de Netherita (Respiración 6, Protección 6, Irrompibilidad 6, Reparación 1, Espinas 6)",
      "Pechera de Netherita (Protección 6, Irrompibilidad 6, Reparación 1, Espinas 6)",
      "Pantalones de Netherita (Protección 6, Irrompibilidad 6, Reparación 1, Espinas 6)",
      "Botas de Netherita (Protección 6, Irrompibilidad 6, Reparación 1, Espinas 6)",
      "Espada de Netherita (Filo 6, Barrido 3, Aspecto Ígneo 3, Botín 6, Irrompibilidad 6, Reparación 1)",
      "Pico de Netherita (Eficiencia 6, Fortuna 6, Irrompibilidad 6, Reparación 1)",
      "Pico de Netherita (Eficiencia 6, Toque de Seda 1, Irrompibilidad 6, Reparación 1)",
      "Hacha de Netherita (Eficiencia 6, Irrompibilidad 6, Reparación 1)",
      "Pala de Netherita (Eficiencia 6, Irrompibilidad 6, Reparación 1)",
      "Azada de Netherita (Eficiencia 6, Irrompibilidad 6, Reparación 1)"
    ]
  }
];

const RANGOS_ORDENADOS = ["nova", "alpha", "inmortal"];

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

function RangoSelectorAnimado() {
  const [modo, setModo] = useState("perma");
  const [precios, setPrecios] = useState({});
  const [rangoSeleccionado, setRangoSeleccionado] = useState(null);
  const [confirmando, setConfirmando] = useState(false);
  const [comprando, setComprando] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [kitDesplegado, setKitDesplegado] = useState(null);
  
    useEffect(() => {
    const fetchPrecios = async () => {
      try {
        const res = await fetch("https://flancraftweb-backend.onrender.com/api/rangos/lista");
        const data = await res.json();
        if (res.ok) {
          const mapa = {};
          data.forEach(({ rango, tipo, precio }) => {
            if (!mapa[rango]) mapa[rango] = {};
            mapa[rango][tipo] = precio;
          });
          setPrecios(mapa);
        } else {
          toast.error("No se pudieron cargar los precios.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error al obtener los precios.");
      }
    };
    fetchPrecios();
  }, []);

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
    const { rango, tipo } = rangoSeleccionado;
    setComprando(true);
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
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al comprar el rango");

     toast.custom((t) => {
  return (
    <div className={`toast-rango-compra ${t.visible ? "mostrar" : ""}`}>
      <img src={rango.imagen} alt={rango.nombre} className="toast-rango-imagen" />
      <div className="toast-rango-texto">
        <strong>¡Has desbloqueado el rango {rango.nombre}!</strong>
        <span>
          {tipo === "perma" ? "Permanente" : "30 días"} por {precios[rango.id][tipo]}{" "}
          <img src="/assets/eco.png" alt="ECOS" className="eco-mini-inline" />
        </span>
      </div>
    </div>
  );
});

      setConfirmando(false);
      if (data.nuevoSaldo !== undefined) {
        setUser({ ...user, ecos: data.nuevoSaldo });
      }
    } catch (err) {
      console.error("Error en la compra:", err);
      toast.error("Hubo un problema al procesar la compra.");
    } finally {
      setComprando(false);
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
          <div className="beneficio-label encabezado"></div>
          {RANGOS_ORDENADOS.map((id) => {
            const rango = RANGOS.find(r => r.id === id);
            const precio = precios?.[rango.id]?.[modo];
            return (
              <div key={rango.id} className={`columna-rango ${rango.id === "inmortal" ? "resaltado" : ""}`}>
                {rango.id === "inmortal" && <span className="etiqueta-popular">MÁS COMPRADO</span>}
                <img src={rango.imagen} alt={`Rango ${rango.nombre}`} className="imagen-rango" />
                <h2 className="nombre-rango">{rango.nombre}</h2>
                <div className="botones-compra">
                  <button
                    className={`boton-compra ${modo === "perma" ? "btn-perma" : "btn-30"}`}
                    onClick={() => handleComprar(rango, modo)}
                    disabled={precio === undefined}
                  >
                    {precio !== undefined ? (
                      <>
                        {precio} <img src="/assets/eco.png" alt="eco" className="eco-mini" /> {modo === "perma" ? "Permanente" : "30 Días"}
                      </>
                    ) : (
                      "Cargando..."
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="tabla-body">
          {FILAS.map((fila) => {
            const esFilaKit = fila.clave === "kit";
            return (
              <div key={fila.clave}>
                <div className={`fila-beneficio ${fila.clave === "comida" ? "fila-comida" : ""}`}>
                  <div className="beneficio-label">{fila.label}</div>
                  <div className="beneficio-celda-group">
                    {RANGOS_ORDENADOS.map((id) => {
                      const rango = RANGOS.find(r => r.id === id);
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
                              <span
                                className={`valor-num ${claseColor} kit-desplegable-toggle`}
                                onClick={() => setKitDesplegado(kitDesplegado ? null : "todos")}

                                style={{ cursor: "pointer" }}
                              >
                                {valor} ▼
                              </span>
                            </div>
                          ) : (
                            <span className={`valor-num ${claseColor}`}>{valor}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {esFilaKit && kitDesplegado && (
                  <div className="fila-kit-detallado">
                    <div className="beneficio-label"></div>
                    <div className="beneficio-celda-group">
                      {RANGOS_ORDENADOS.map((id) => {
                        const rango = RANGOS.find(r => r.id === id);
                        return (
                          <div key={id + "_kitdetalle"} className="beneficio-celda">
                            {kitDesplegado ? (
                              <ul className="kit-detalle-lista">
                                {rango.kit_detallado?.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            ) : (
                              <span className="kit-detalle-vacio">—</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {confirmando && rangoSeleccionado && (
        <div className="modal-compra">
          <div className={`modal-contenido ${comprando ? "cargando" : ""}`}>
            <h3 className="modal-titulo">Compra de rango</h3>
            <div className="modal-desglose">
              <p className="modal-texto">Vas a desbloquear el rango</p>
              <div className="modal-rango-linea">
                <img src={rangoSeleccionado.rango.imagen} alt={rangoSeleccionado.rango.nombre} className="modal-rango-icono" />
                <span className="modal-rango-nombre">{rangoSeleccionado.rango.nombre}</span>
                <span className="modal-rango-tipo">
                  ({rangoSeleccionado.tipo === "perma" ? "Permanente" : "30 días"})
                </span>
              </div>
              {precios?.[rangoSeleccionado.rango.id]?.[rangoSeleccionado.tipo] !== undefined && (
                <p className="modal-texto">
                  por <span className="modal-ecos">{precios[rangoSeleccionado.rango.id][rangoSeleccionado.tipo]}</span>{" "}
                  <img src="/assets/eco.png" alt="ECOS" className="eco-mini" />
                </p>
              )}
            </div>

            <div className="modal-botones">
              <button
                className={`btn-confirmar ${comprando ? "deshabilitado" : ""}`}
                onClick={confirmarCompra}
                disabled={comprando}
              >
                {comprando ? "Procesando..." : "Confirmar compra"}
              </button>
              <button className="btn-cancelar" onClick={() => setConfirmando(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {comprando && (
        <div className="overlay-conjuro">
          <div className="circulo-magico" />
          <div className="chispa chispa1" />
          <div className="chispa chispa2" />
          <div className="chispa chispa3" />
        </div>
      )}
    </section>
  );
}

export default RangoSelectorAnimado;