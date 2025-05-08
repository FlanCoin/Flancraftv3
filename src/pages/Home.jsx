import React, { useState } from 'react';
import '../styles/pages/_home.scss';

import MapRPG from '../components/MapRPG';
import NewsSection from '../components/news/NewsSection';
import ServerStatus from '../components/ServerStatus';
import GameModes from '../components/GameModes';
import TeamCarousel from '../components/TeamCarousel';
import SectionDivider from '../components/SectionDivider';
import ThemedFeatures from '../components/ThemedFeatures';
import SectionDivider2 from '../components/SectionDivider2';
import PlayerDashboard from '../components/PlayerDashboard';

const Home = () => {
  const [copied, setCopied] = useState(false);

  const copyIP = () => {
    navigator.clipboard.writeText('play.flancraft.com');
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
          <p>Tu aventura empieza aquí. Explora, sube de nivel y deja tu legado en el mundo.</p>

          <ServerStatus />

          <button className="hero-btn" onClick={copyIP}>
            {copied ? '¡IP Copiada!' : 'Conectarse a Flancraft'}
          </button>
        </div>
      </header>
      <SectionDivider />
      <PlayerDashboard />
      {/* Mapa RPG a pantalla completa */}
      <MapRPG />

      {/* Sección de modos de juego */}
      <GameModes />
      <SectionDivider />

      {/* Sección del equipo */}
      <div className="main-content">
        <TeamCarousel />
        <section className="sections">
          {/* Puedes añadir otras zonas aquí si lo deseas */}
        </section>
      </div>

      {/* Divider inferior que estaba mal posicionado antes */}
      <SectionDivider />
      <ThemedFeatures/>
<div className="divider-overlay">
  <SectionDivider2 />
</div>


      {/* Noticias */}
      <NewsSection />

      {/* Footer */}
      <footer className="footer-flancraft">
        <div className="footer-inner">
          <p className="footer-title">© 2025 Flancraft Network</p>
          <p className="footer-sub">Servidor Minecraft 1.20+ — Vive tu aventura</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
