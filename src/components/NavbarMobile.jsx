import { NavLink, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import LogoutButton from "./Auth/LogoutButton";
import LoginModal from "./Auth/LoginModal";

const NavbarMobile = ({
  menuOpen,
  setMenuOpen,
  profileOpen,
  setProfileOpen,
  activeDropdown,
  toggleDropdown,
  isLoggedIn,
  userData,
}) => {
  const wrapperRef = useRef();
  const profileButtonRef = useRef();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [rangoDatos, setRangoDatos] = useState(null);

  useEffect(() => {
    const handleTapOutside = (event) => {
      if (
        profileOpen &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleTapOutside);
    return () => {
      document.removeEventListener("pointerdown", handleTapOutside);
    };
  }, [profileOpen, setProfileOpen]);

  useEffect(() => {
    const fetchRangoUsuario = async () => {
      if (isLoggedIn && userData?.uuid) {
        try {
          const res = await fetch(`https://flancraftweb-backend.onrender.com/api/usuarios/${userData.uuid}`);
          const data = await res.json();
          setRangoDatos({
            rango: data.rango_usuario?.toLowerCase() || null,
            premium: data.es_premium === true,
          });
        } catch (err) {
          console.error("Error al obtener datos de usuario:", err);
        }
      }
    };
    fetchRangoUsuario();
  }, [isLoggedIn, userData?.uuid]);

  const getRangoColorClass = () => {
  if (!isLoggedIn || !userData?.uuid) return "";
  const raw = rangoDatos?.rango;
  if (!raw) return "rango-basico"; // Clase por defecto si aún no cargó
  return `rango-${raw}`;
};

  
  return (
    <>
      <div className="navbar-inner mobile-only">
        <div className="left-wrapper">
          <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>
            <span />
            <span />
            <span />
          </button>

          <Link to="/" className="logo-inline">
            <img src="/assets/logonav.png" alt="Flancraft logo" className="logo-img" />
          </Link>
        </div>

        {isLoggedIn ? (
          <button
            className="profile-button full"
            ref={profileButtonRef}
            onClick={() => setProfileOpen((prev) => !prev)}
          >
            <img
              src={`https://mc-heads.net/avatar/${userData.username}/32`}
              alt="avatar"
              className="user-avatar"
            />
            <span className="profile-greeting">
  Hola, <span className={`nombre-colored ${getRangoColorClass()}`}>{userData.username}</span>
</span>
            <i className={`fas ${profileOpen ? "fa-chevron-up" : "fa-chevron-down"}`} />
          </button>
        ) : (
          <button className="profile-button full" onClick={() => setLoginModalOpen(true)}>
            <i className="fas fa-sign-in-alt" />
            <span className="profile-greeting">Iniciar sesión</span>
          </button>
        )}
      </div>

      {isLoggedIn && (
        <div
          ref={wrapperRef}
          className={`user-dropdown-wrapper mobile-only ${profileOpen ? "open" : ""}`}
        >
          <div className="user-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="user-header centered">
              <img
                src={`https://mc-heads.net/avatar/${userData.username}/64`}
                alt="avatar"
                className="user-avatar-large"
              />
              <p className="username-big">
                <span className={`nombre-colored ${getRangoColorClass()}`}>{userData.username}</span>
                <span className="level-text">Nv. {userData.userLevel}</span>
              </p>
            </div>

            <div className="xp-bar-profile">
              <div
                className="xp-fill"
                style={{
                  width: `${(userData.userXP / userData.userXPMax) * 100}%`,
                }}
              />
            </div>

            <div className="balance-wrapper">
              <div className="balance-item">
                <span> ECOS: {userData.ecos}</span>
                <img src="/assets/eco.png" alt="ECOS" className="eco-icon-navbar" />
              </div>
            </div>

            <NavLink to="/dashboard" className="dropdown-link">
              <i className="fas fa-gift" /> Recompensas
            </NavLink>
            <NavLink to={`/perfil/${userData.username}`} className="dropdown-link">
              <i className="fas fa-chart-bar" /> Ver estadísticas
            </NavLink>

            <LogoutButton />
          </div>
        </div>
      )}

      <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}></div>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-logo-header">
          <i className="fas fa-times close-menu-button" onClick={() => setMenuOpen(false)} />
          <img src="/assets/blockhorn.png" alt="Blockhorn" className="blockhorn-logo" />
          <div className="logo-divider"></div>
          <div className="logo-glow-wrapper">
            <img src="/assets/flancraftlogo.png" alt="Flancraft" className="flancraft-logo" />
          </div>
        </div>

        <div className="mobile-links">
          <NavLink to="/"><i className="fas fa-home" /> Inicio</NavLink>
          <NavLink to="/news"><i className="fas fa-scroll" /> Noticias</NavLink>

          <div className={`mobile-dropdown ${activeDropdown === 'mundos' ? 'open' : ''}`}>
            <div className="mobile-dropdown-toggle" onClick={() => toggleDropdown('mundos')}>
              <i className="fas fa-map-marked-alt" /> Mundos
              <i className={`fas fa-chevron-down arrow-icon ${activeDropdown === 'mundos' ? 'open' : ''}`} />
            </div>
            <div className="mobile-dropdown-content">
              <NavLink to="/mundos/survival"><i className="fas fa-tree" /> Survival</NavLink>
              <NavLink to="/mundos/oneblock"><i className="fas fa-cube" /> OneBlock</NavLink>
              <NavLink to="/mundos/pokebox"><i className="fas fa-dragon" /> Pokebox</NavLink>
              <NavLink to="/mundos/anarquico"><i className="fas fa-fire-alt" /> Anárquico</NavLink>
              <NavLink to="/mundos/creativo"><i className="fas fa-paint-brush" /> Creativo</NavLink>
              <NavLink to="/mundos/parkour"><i className="fas fa-shoe-prints" /> Parkour</NavLink>
            </div>
          </div>

          <NavLink to="/leaderboards"><i className="fas fa-chart-line" /> Estadísticas</NavLink>

          <div className={`mobile-dropdown ${activeDropdown === 'mercado' ? 'open' : ''}`}>
            <div className="mobile-dropdown-toggle" onClick={() => toggleDropdown('mercado')}>
              <i className="fas fa-store" /> Tienda
              <i className={`fas fa-chevron-down arrow-icon ${activeDropdown === 'mercado' ? 'open' : ''}`} />
            </div>
            <div className="mobile-dropdown-content">
              <NavLink to="/tienda"><i className="fas fa-gem" /> Store Servidor</NavLink>
              <NavLink to="/tienda-merch"><i className="fas fa-shopping-bag" /> Merchandising</NavLink>
            </div>
          </div>

          <NavLink to="/tribunal"><i className="fas fa-gavel" /> Tribunal</NavLink>

          <div className="logo-divider"></div>
          <div className="mobile-social-links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram" /></a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-tiktok" /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube" /></a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-discord" /></a>
            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer"><i className="fab fa-telegram" /></a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-x-twitter" /></a>
          </div>
          <div className="logo-divider"></div>
        </div>
      </div>

      {loginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}
    </>
  );
};

export default NavbarMobile;
