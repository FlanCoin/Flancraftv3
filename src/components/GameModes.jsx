import React, { useState } from "react";
import "../styles/components/_gamemodes.scss";

const modes = [
  {
    id: "survival",
    name: "Survival",
    description:
      "Aventura clásica con economía, clanes y misiones. Incluye Slimefun y dungeons exclusivas.",
    image: "/assets/modes/survival.png",
    icon: "/assets/icons/survival-icon.png",
  },
  {
    id: "oneblock",
    name: "OneBlock",
    description:
      "Comienza en un solo bloque, mejora tu isla y enfréntate a desafíos únicos.",
    image: "/assets/modes/oneblock.png",
    icon: "/assets/icons/oneblock-icon.png",
  },
  {
    id: "pokebox",
    name: "PokeBox PVP",
    description:
      "PvP intenso con temática Pokémon. Usa kits, habilidades y conquista la arena.",
    image: "/assets/modes/pokebox.png",
    icon: "/assets/icons/pokebox-icon.png",
  },
  {
    id: "creativo",
    name: "Creativo",
    description:
      "Desata tu imaginación en parcelas infinitas con WorldEdit y herramientas de construcción.",
    image: "/assets/modes/creativo.png",
    icon: "/assets/icons/creativo-icon.png",
  },
  {
    id: "anarquico",
    name: "Anárquico",
    description:
      "Sin reglas, sin límites. Sobrevive en el caos y construye tu imperio en libertad total.",
    image: "/assets/modes/anarquico.png",
    icon: "/assets/icons/anarquico-icon.png",
  },
  {
    id: "parkour",
    name: "Parkour",
    description:
      "Salta a través de mapas diseñados por expertos. ¿Podrás dominar todos los retos?",
    image: "/assets/modes/parkour.png",
    icon: "/assets/icons/parkour-icon.png",
  },
 /* {
    id: "kingdoms",
    name: "Kingdoms",
    description:
      "¡Próximamente! Construye tu reino, conquista territorios y lidera tu imperio.",
    image: "/assets/modes/kingdoms.png",
    icon: "/assets/icons/kingdoms-icon.png",
  },*/
];

const GameModes = () => {
  const [active, setActive] = useState(modes[0]);

  return (
    <section className="gamemodes-wrapper">
      <div className="gm-bg" />
      <div className="gm-inner">
        <div className="gm-header">
          <div className="gm-title-wrapper">
            <h2 className="gm-title">Modos de juego</h2>
            <p className="gm-desc">
              Desde aventuras clásicas hasta retos épicos. ¡Explora los mundos
              de Flancraft!
            </p>
            <div className="gm-title-line top" />
            <div className="gm-title-line bottom" />
          </div>
        </div>

        <div className="gm-main">
          <div className="gm-left">
            <div className="gm-video-frame">
              <img src={active.image} alt={active.name} />
            </div>
          </div>

          <div className="gm-right">
            <div className="gm-subheader">
              <p className="gm-subtitle">
                Descubre cada uno de nuestros maravillosos
              </p>
              <h4 className="gm-mundos">MUNDOS</h4>
            </div>
            <div className="gm-selector">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  className={`gm-circle-btn ${
                    active.id === mode.id ? "active " + mode.id : ""
                  }`}
                  onClick={() => setActive(mode)}
                >
                  <img src={mode.icon} alt={mode.name} />
                  <span className="gm-btn-label">{mode.name}</span>
                </button>
              ))}
            </div>

            <div className="gm-details">
            <div className="gm-details-wrapper">
    <h3 className={active.id}>{active.name}</h3>
    <p key={active.id} className="gm-glitch-transition">{active.description}</p>
  </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameModes;
