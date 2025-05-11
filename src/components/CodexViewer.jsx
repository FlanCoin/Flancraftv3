import React, { useState, useEffect } from "react";
import { HiBolt } from "react-icons/hi2";
import codexData from "../data/codex-data";
import "../styles/components/_codex.scss";

export default function CodexViewer() {
  const [index, setIndex] = useState(0);
  const [viewed, setViewed] = useState(() => {
    const saved = localStorage.getItem("codexViewed");
    return saved ? JSON.parse(saved) : Array(codexData.length).fill(false);
  });

  const current = codexData[index];
  const allViewed = viewed.every(Boolean);

  const goTo = (i) => {
    setIndex(i);
    const updated = [...viewed];
    updated[i] = true;
    setViewed(updated);
    localStorage.setItem("codexViewed", JSON.stringify(updated));
  };

  useEffect(() => {
    goTo(index); // Marca como visto al cargar
  }, []);

  return (
    <section className="codex-legend" style={{ backgroundImage: `url(${current.bg})` }}>
      <div className="particles" />
      <div className="grimorio">
        <div className="page animate">
          <h2 className="title-glow">{current.title}</h2>
          <h3 className="subtitle">
            {current.subtitle}
            <span className="badge" style={{ backgroundColor: current.badgeColor }}>
              {current.badge}
            </span>
          </h3>
          <p className="text-scroll">{current.description}</p>
        </div>

        <div className="thumbnails">
          {codexData.map((entry, i) => (
            <img
              key={i}
              src={entry.thumb}
              alt={entry.title}
              className={`thumb ${i === index ? "active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <button
          className={`btn-eko ${allViewed ? "ready" : "disabled"}`}
          disabled={!allViewed}
          onClick={() => (window.location.href = "/shop")}
        >
          <HiBolt className="icon" />
          {allViewed ? "⚡ Obtener EKO" : "Explora todas las páginas..."}
        </button>
      </div>
    </section>
  );
}
