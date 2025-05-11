import React, { useState, useEffect, useRef } from "react";
import "../styles/components/_comicflow.scss";
import { HiBolt } from "react-icons/hi2";

const comicLore = [
  {
    title: "El Portal Susurra",
    subtitle: "Vínculo con lo Olvidado",
    badge: "Resonancia Antigua",
    badgeColor: "#66ccff",
    bg: "/assets/comic/panel1-resonancia.webp",
    thumb: "/assets/comic/panel1-resonancia.webp",
    description:
      "No fue creado, sino recordado. Algo más allá del End aún vibra: la Resonancia. Una fuerza antigua que respira en las piedras y despierta lo imposible.",
  },
  {
    title: "Presagios del Eco",
    subtitle: "Anomalías de la Realidad",
    badge: "Fragmentos de poder",
    badgeColor: "#7ae582",
    bg: "/assets/comic/panel2-senales.webp",
    thumb: "/assets/comic/panel2-senales.webp",
    description:
      "Relámpagos sin tormenta, mobs que regresan… Señales que no pueden explicarse por reglas conocidas. La Resonancia deja marcas donde toca.",
  },
  {
    title: "El Eco",
    subtitle: "Fuerza del Origen",
    badge: "Esencia Primordial",
    badgeColor: "#00ffff",
    bg: "/assets/comic/panel3-eco.webp",
    thumb: "/assets/comic/panel3-eco.webp",
    description:
      "El latido oculto del mundo. Energía primitiva que reescribe la realidad misma. El Eco no se toca, pero se siente, y quien lo escucha... puede alterar las reglas.",
  },
  {
    title: "Flan el Buscador",
    subtitle: "Portador del Nombre Verdadero",
    badge: "Viajero entre Planos",
    badgeColor: "#fbc531",
    bg: "/assets/comic/panel4-flan.webp",
    thumb: "/assets/comic/panel4-flan.webp",
    description:
      "Tras años entre templos y planos, Flan entendió el susurro original. Lo que otros llamaron mito, él lo resonó. Y el mundo empezó a responder.",
  },
  {
    title: "La Fuente del Origen",
    subtitle: "Templo de la Forma Pura",
    badge: "Cristal Infinito",
    badgeColor: "#a29bfe",
    bg: "/assets/comic/panel5-fuente.webp",
    thumb: "/assets/comic/panel5-fuente.webp",
    description:
      "Más allá del Nether, donde la forma se convierte en intención, la Fuente pulsa eternamente. Quien entra, no vuelve igual. Quien bebe, se transforma.",
  },
  {
    title: "El Mercado Interdimensional",
    subtitle: "Donde Todo Tiene Precio",
    badge: "Nexo Prohibido",
    badgeColor: "#e17055",
    bg: "/assets/comic/panel6-mercado.webp",
    thumb: "/assets/comic/panel6-mercado.webp",
    description:
      "Reliquias imposibles, armaduras prohibidas, portales rotos... Todo puede obtenerse si tienes suficiente Eco. Pero cuidado: el Eco no se obedece.",
  },
  {
    title: "EKO: La Forma Suprema",
    subtitle: "Moneda del Poder Absoluto",
    badge: "Moneda legendaria",
    badgeColor: "#00d2ff",
    bg: "/assets/comic/panel7-eko.webp",
    thumb: "/assets/comic/panel7-eko.webp",
    description:
      "Cuando el Eco se cristaliza en su máxima pureza... nace el EKO. Una energía pura, legendaria, intercambiable, y temida. Solo quien lo comprende, lo merece.",
  },
];

export default function ComicFlow() {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [progress, setProgress] = useState(0);
  const lastTime = useRef(Date.now());
  const TRANSITION = 10000;
  const DELAY = 2500;

  const current = comicLore[index];

  const next = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 500);
    setIndex((prev) => (prev + 1) % comicLore.length);
    lastTime.current = Date.now();
    setProgress(0);
  };

  useEffect(() => {
    let frame;
    const tick = () => {
      const now = Date.now();
      const elapsed = now - lastTime.current;
      const pct = ((elapsed - DELAY) / TRANSITION) * 100;
      setProgress(Math.min(pct, 100));
      if (pct >= 100) next();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section
      className="comicflow-panel"
      style={{
        backgroundImage: `url(${current.bg})`,
      }}
    >
      <div className="panel-overlay">
        <div className="panel-content">
          <h2 className="panel-title">{current.title}</h2>
          <h3 className="panel-sub">
            {current.subtitle}
            <span
              className="panel-badge"
              style={{ backgroundColor: current.badgeColor }}
            >
              {current.badge}
            </span>
          </h3>
          <p className="panel-description">{current.description}</p>
        </div>
        <div className="panel-thumbs">
          {comicLore.map((scene, i) => (
            <img
              key={i}
              src={scene.thumb}
              alt={scene.title}
              className={`thumb ${i === index ? "active" : ""}`}
              onClick={() => {
                setIndex(i);
                lastTime.current = Date.now();
                setProgress(0);
              }}
            />
          ))}
        </div>
        <a href="/shop" className="btn-eko">
          <HiBolt /> Obtener EKO
        </a>
      </div>
    </section>
  );
}
