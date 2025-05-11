import React, { useEffect, useState, useRef } from "react";
import { HiBolt, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import codexData from "../data/codex-data";
import ColorThief from "color-thief-browser";
import "../styles/components/_ritual.scss";

export default function RitualEko() {
  const [index, setIndex] = useState(0);
  const [viewed, setViewed] = useState(Array(codexData.length).fill(false));
  const [dominantColor, setDominantColor] = useState("#ffffff");

  const imgRef = useRef(null);
  const current = codexData[index];
  const allViewed = viewed.every(Boolean);
  const isVideo = current.bg?.endsWith(".mp4");

  useEffect(() => {
    const updated = [...viewed];
    updated[index] = true;
    setViewed(updated);
  }, [index, viewed]);

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
      {/* Fondo dinámico: video o imagen */}
      {isVideo ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="ritual-video-bg"
        >
          <source src={current.bg} type="video/mp4" />
        </video>
      ) : (
        <div
          className="ritual-image-bg"
          style={{ backgroundImage: `url(${current.bg})` }}
        />
      )}

      <div className="overlay" />

      <div
        className={`codex-box ${!viewed[index + 1] && index < codexData.length - 1 ? "right-glow-border" : ""}`}
        style={{
          borderColor: dominantColor,
          boxShadow: `inset 0 0 12px ${dominantColor}`,
        }}
      >
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

        <h2 className="ritual-title" style={{ color: dominantColor }}>
          {current.title}
        </h2>
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
          onClick={() => (window.location.href = "/shop")}
          style={{
            background: allViewed
              ? `linear-gradient(to right, ${dominantColor}, #ffffff)`
              : undefined,
            borderColor: allViewed ? dominantColor : undefined,
          }}
        >
          <HiBolt className="bolt-icon" />
          {allViewed ? "Obtener EKO" : "Descubre el poder..."}
        </button>
      </div>

      {/* Imagen oculta solo si es imagen (para color detection) */}
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
