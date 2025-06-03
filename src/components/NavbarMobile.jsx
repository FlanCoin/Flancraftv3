import { NavLink, Link } from "react-router-dom";
import LogoutButton from "./Auth/LogoutButton";

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
  return (
    <>
      {/* Mobile Header */}
      <div className="navbar-inner mobile-only">
        <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>
          <span />
          <span />
          <span />
        </button>

        <div className="logo-wrapper">
          <Link to="/">
            <img src="/assets/logonav.png" alt="Flancraft logo" className="logo-img" />
          </Link>
        </div>

        <div
          className="profile-button mobile-only"
          onClick={() => setProfileOpen(!profileOpen)}
        >
          <img
            src={`https://mc-heads.net/avatar/${userData.username}/32`}
            alt="avatar"
            className="user-avatar"
          />
          {isLoggedIn && (
            <div className={`user-dropdown-wrapper mobile ${profileOpen ? "open" : ""}`}>
              <div className="user-dropdown">
                <div className="user-header">
                  <img
                    src={`https://mc-heads.net/avatar/${userData.username}/64`}
                    alt="avatar"
                    className="user-avatar-large"
                  />
                  <div>
                    <p className="username-big">
                      {userData.username}{" "}
                      <span className="level-text">Nv. {userData.userLevel}</span>
                    </p>
                    <p className="uuid">ID: {userData.uuid.slice(0, 6)}...</p>
                  </div>
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
                    <img
                      src="/assets/eco.png"
                      alt="ECOS"
                      className="eco-icon-navbar"
                    />
                    <span>{userData.ecos} ECOS</span>
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
        </div>
      </div>

      {/* Mobile Slide Menu */}
      <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}></div>
      <div className="mobile-menu">
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
    </>
  );
};

export default NavbarMobile;
