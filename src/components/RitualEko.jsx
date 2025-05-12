import React, { useEffect, useState, useRef } from "react";
import { HiBolt, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import codexData from "../data/codex-data";
import ColorThief from "color-thief-browser";
import "../styles/components/_ritual.scss";

export default function RitualEko() {
  const [index, setIndex] = useState(0);
  const [viewed, setViewed] = useState(Array(codexData.length).fill(false));
  const [dominantColor, setDominantColor] = useState("#ffffff");
  const [progress, setProgress] = useState("0%");
  const [hasUnlocked, setHasUnlocked] = useState(false);

  const imgRef = useRef(null);
  const current = codexData[index];
  const isVideo = current.bg?.endsWith(".mp4");
  const allViewed = viewed.every(Boolean);

  // Marcar viñeta como vista
  useEffect(() => {
    const updated = [...viewed];
    updated[index] = true;
    setViewed(updated);
  }, [index, viewed]);

  // Extraer color dominante
  useEffect(() => {
    if (!current?.bg || isVideo) return;
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = current.bg;
    img.onload = () => {
      try {
        const color = ColorThief.getColor(img);
        setDominantColor(`rgb(${color.join(",")})`);
      } catch (err) {
        console.error("ColorThief error:", err);
      }
    };
  }, [current, isVideo]);

  // Calcular progreso visual
  useEffect(() => {
    const percentage = `${(viewed.filter(Boolean).length / codexData.length) * 100}%`;
    setProgress(percentage);
  }, [viewed]);

  // Detectar desbloqueo
  useEffect(() => {
    if (allViewed && !hasUnlocked) {
      setHasUnlocked(true);
    }
  }, [allViewed, hasUnlocked]);

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const next = () => {
    if (index < codexData.length - 1) setIndex(index + 1);
  };

  const getClass = (i) => {
    if (i === index) return "center";
    if (i === index - 1) return "left";
    if (i === index + 1) return "right";
    return "hidden";
  };

  return (
    <section className="ritual-carousel">
      {isVideo ? (
        <video autoPlay loop muted playsInline className="ritual-video-bg">
          <source src={current.bg} type="video/mp4" />
        </video>
      ) : (
        <div className="ritual-image-bg" style={{ backgroundImage: `url(${current.bg})` }} />
      )}

      <div className="overlay" />

      <div
        className={`codex-box ${!viewed[index + 1] && index < codexData.length - 1 ? "right-glow-border" : ""}`}
        style={{
          borderColor: dominantColor,
          boxShadow: `inset 0 0 12px ${dominantColor}`,
        }}
      >
        {/* Flechas */}
        <div className="arrow-panel left-arrow" onClick={prev}>
          {index > 0 && <HiChevronLeft />}
        </div>

        <div
          className={`arrow-panel right-arrow ${
            !viewed[index + 1] && index < codexData.length - 1 ? "glow" : ""
          }`}
          onClick={next}
        >
          {index < codexData.length - 1 && <HiChevronRight />}
        </div>

        {/* Título y contenido */}
        <h2 className="ritual-title" style={{ color: dominantColor }}>{current.title}</h2>

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

        {/* Miniaturas */}
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

        {/* Botón mágico */}
        <div
          className={`eko-liquid-wrapper ${allViewed ? "unlocked" : ""} ${hasUnlocked ? "unlocked-shake" : ""}`}
          style={{ "--progress": progress }}
        >
          <button
  className={`eko-liquid-btn ${hasUnlocked ? "btn-reveal" : ""}`}
  disabled={!allViewed}
  onClick={() => (window.location.href = "/shop")}
  style={{ "--dominant": dominantColor }}
>
            <div className="liquid-bg" />

            {/* Solo mostrar líquido animado si no se ha desbloqueado */}
            {!allViewed && (
              <div className="liquid-fill">
                <div className="liquid-wave" />
              </div>
            )}

            <div className="eko-liquid-text">
              <HiBolt className="bolt-icon" />
              {allViewed ? "Obtener EKO" : "Descubre el poder..."}
            </div>
          </button>
        </div>
      </div>

      {/* Imagen oculta para extracción de color */}
      {!isVideo && (
        <img
          ref={imgRef}
          src={current.bg}
          alt="hidden-color-source"
          crossOrigin="anonymous"
          style={{ display: "none" }}
        />
      )}
    </section>
  );
}
