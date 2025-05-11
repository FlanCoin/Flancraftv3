import React, { useEffect, useState } from "react";
import { HiBolt, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import codexData from "../data/codex-data";
import "../styles/components/_ritual.scss";

export default function RitualEko() {
  const [index, setIndex] = useState(0);
  const [viewed, setViewed] = useState(Array(codexData.length).fill(false));
  const current = codexData[index];
  const allViewed = viewed.every(Boolean);

  useEffect(() => {
    const updated = [...viewed];
    updated[index] = true;
    setViewed(updated);
  }, [index]);

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const next = () => {
    if (index < codexData.length - 1) setIndex(index + 1);
  };

  const getClass = (i) => {
    const diff = i - index;
    if (diff === 0) return "center";
    if (diff === -1 || (index === 0 && i === codexData.length - 1)) return "left";
    if (diff === 1 || (index === codexData.length - 1 && i === 0)) return "right";
    return "hidden";
  };

  return (
    <section className="ritual-carousel" style={{ backgroundImage: `url(${current.bg})` }}>
      <div className="overlay" />

      <div className={`codex-box ${viewed[index + 1] === false ? "right-glow-border" : ""}`}>

        {/* Flechas mágicas interiores */}
        <div className="arrow-panel left-arrow" onClick={prev}>
          {index > 0 && <HiChevronLeft />}
        </div>
        <div
          className={`arrow-panel right-arrow ${
            viewed[index + 1] === false && index < codexData.length - 1 ? "glow" : ""
          }`}
          onClick={next}
        >
          {index < codexData.length - 1 && <HiChevronRight />}
        </div>

        <h2 className="ritual-title">{current.title}</h2>
        <h3 className="ritual-subtitle">
          {current.subtitle}
          <span className="ritual-badge" style={{ backgroundColor: current.badgeColor }}>
            {current.badge}
          </span>
        </h3>

        <div className="ritual-description fade-in">
          {current.description.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>

        <div className="carousel-inner">
          {codexData.map((item, i) => (
            <img
              key={i}
              src={item.thumb}
              alt={item.title}
              className={`carousel-item ${getClass(i)}`}
            />
          ))}
        </div>

        <div className="ritual-progress">
          Viñeta {index + 1} de {codexData.length}
        </div>

        <button
          className={`eko-btn ${allViewed ? "active" : "disabled"}`}
          disabled={!allViewed}
          onClick={() => window.location.href = "/shop"}
        >
          <HiBolt className="bolt-icon" />
          {allViewed ? "Obtener EKO" : "Descubre el poder..."}
        </button>
      </div>
    </section>
  );
}
