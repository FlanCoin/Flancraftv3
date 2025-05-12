import React, { useState } from "react";
import "../styles/pages/_home.scss";

import MapRPG from "../components/MapRPG";
import ServerStatus from "../components/ServerStatus";
import GameModes from "../components/GameModes";
import TeamCarousel from "../components/TeamCarousel";
import SectionDivider from "../components/SectionDivider";
import SectionDivider2 from "../components/SectionDivider2";
import PlayerDashboard from "../components/PlayerDashboard";
import RitualEko from "../components/RitualEko";
import Footer from "../components/Footer";

const Home = () => {
  const [copied, setCopied] = useState(false);

  const copyIP = () => {
    navigator.clipboard.writeText("play.flancraft.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="home">
      <header className="hero-flancraft">
        <video autoPlay muted loop playsInline className="hero-video">
          <source src="/videos/background.mp4" type="video/mp4" />
        </video>

        <div className="hero-overlay" />

        <div className="hero-content">
          <h1>Bienvenido a Flancraft</h1>
          <p>
            Tu aventura empieza aquí. Explora, sube de nivel y deja tu legado en
            el mundo.
          </p>

          <ServerStatus />

          <button className="hero-btn" onClick={copyIP}>
            {copied ? "¡IP Copiada!" : "Conectarse a Flancraft"}
          </button>
        </div>
      </header>
      <SectionDivider />

      <MapRPG />
      <SectionDivider />
      <PlayerDashboard />
      <SectionDivider />
      <RitualEko />
      <SectionDivider />
      <GameModes />
      <SectionDivider />

      <div className="main-content">
        <TeamCarousel />
        <section className="sections"></section>
      </div>
      <div className="divider-overlay">
        <SectionDivider2 />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
