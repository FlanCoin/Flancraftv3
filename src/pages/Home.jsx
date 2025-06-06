import React, { useState, useContext, useRef, useEffect } from "react";
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
import LoginModal from "../components/Auth/LoginModal";

import { UserContext } from "../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const gameModesRef = useRef(null);

  const handleMainButtonClick = () => {
    if (!user) {
      setShowLogin(true);
    } else {
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    if (location.state?.scrollTo === "game-modes-section") {
      const target = document.getElementById("game-modes-section");
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth" });
        }, 200);
      }
    }
  }, [location]);

  return (
    <div className="home">
      <header className="hero-flancraft">
        <video autoPlay muted loop playsInline className="hero-video">
          <source src="/videos/background.mp4" type="video/mp4" />
        </video>

        <div className="hero-overlay" />

        <div className="hero-content">
<div className="hero-logo" role="img" aria-label="Flancraft logo" />
          <p>
            Tu aventura empieza aquí. Explora, sube de nivel y deja tu legado en el mundo.
          </p>

          <ServerStatus />

          <button className="hero-btn" onClick={handleMainButtonClick}>
            {!user ? (
              "Conectarse a Flancraft"
            ) : (
              <span className="hero-user-wrapper">
                <span className="greeting-text">Disfruta de tu hogar,</span>
                <span className="nombre-colored">{user?.name || user?.username || "aventurero"}</span>
              </span>
            )}
          </button>
        </div>
      </header>

      {showLogin && (
        <LoginModal
          onClose={() => {
            setShowLogin(false);
            const stored = localStorage.getItem("flan_user");
            if (stored) {
              try {
                const parsed = JSON.parse(stored);
                if (parsed?.loggedIn) {
                  setUser(parsed);
                }
              } catch (e) {
                console.error("Error al parsear flan_user:", e);
              }
            }
          }}
        />
      )}

      <SectionDivider />
      <MapRPG />
      <SectionDivider />
      <PlayerDashboard />
      <SectionDivider />
      <RitualEko />
      <SectionDivider />

      <div ref={gameModesRef} id="game-modes-section">
        <GameModes />
      </div>

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
