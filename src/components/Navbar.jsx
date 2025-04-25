import React, { useState, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaBalanceScale } from 'react-icons/fa';
import '../styles/components/_navbar.scss';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownTimeout = useRef(null);
  const profileTimeout = useRef(null);

  const handleDropdownHover = (key) => {
    clearTimeout(dropdownTimeout.current);
    setActiveDropdown(key);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleProfileEnter = () => {
    clearTimeout(profileTimeout.current);
    setProfileOpen(true);
  };

  const handleProfileLeave = () => {
    profileTimeout.current = setTimeout(() => {
      setProfileOpen(false);
    }, 250);
  };

  const isLoggedIn = true;
  const username = 'StevePro';
  const uuid = '3e9a1cfa-xyz2b';
  const userXP = 150;
  const userXPMax = 200;
  const userLevel = 7;

  return (
    <nav className={`navbar-flancraft ${menuOpen ? 'menu-open' : ''}`}>
      {/* --- Mobile Header --- */}
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

        <div className="profile-button">
          <img src={`https://mc-heads.net/avatar/${username}/32`} alt="avatar" />
        </div>
      </div>

      {/* --- Desktop Navigation --- */}
      <div className="navbar-content desktop-only">
        <div className="nav-left-wrapper">
          <div className="nav-left">
            <Link to="/" className="logo">
              <img src="/assets/logonav.png" alt="Flancraft logo" className="logo-img" />
            </Link>
          </div>

          <div className="nav-center links">
            <NavLink to="/noticias"><i className="fas fa-scroll" /> Noticias</NavLink>

            <div className={`dropdown ${activeDropdown === 'mundos' ? 'show-dropdown' : ''}`}
              onMouseEnter={() => handleDropdownHover('mundos')}
              onMouseLeave={handleDropdownLeave}>
              <span className="dropdown-toggle">
                <i className="fas fa-map-marked-alt" /> Mundos <i className="fas fa-chevron-down arrow-icon" />
              </span>
              <div className="dropdown-menu">
                <NavLink to="/mundos/survival"><i className="fas fa-tree" /> Survival</NavLink>
                <NavLink to="/mundos/oneblock"><i className="fas fa-cube" /> OneBlock</NavLink>
                <NavLink to="/mundos/pokebox"><i className="fas fa-dragon" /> Pokebox</NavLink>
                <NavLink to="/mundos/anarquico"><i className="fas fa-fire-alt" /> Anárquico</NavLink>
                <NavLink to="/mundos/creativo"><i className="fas fa-paint-brush" /> Creativo</NavLink>
                <NavLink to="/mundos/parkour"><i className="fas fa-shoe-prints" /> Parkour</NavLink>
              </div>
            </div>

            <NavLink to="/slimefun"><i className="fas fa-flask" /> Slimefun</NavLink>
            <NavLink to="/estadisticas"><i className="fas fa-chart-line" /> Stats</NavLink>

            <div className={`dropdown ${activeDropdown === 'mercado' ? 'show-dropdown' : ''}`}
              onMouseEnter={() => handleDropdownHover('mercado')}
              onMouseLeave={handleDropdownLeave}>
              <span className="dropdown-toggle">
                <i className="fas fa-store" /> Mercado <i className="fas fa-chevron-down arrow-icon" />
              </span>
              <div className="dropdown-menu">
                <NavLink to="/tienda-tebex"><i className="fas fa-gem" /> Store Servidor</NavLink>
                <NavLink to="/tienda-merch"><i className="fas fa-shopping-bag" /> Merchandising</NavLink>
              </div>
            </div>

            <NavLink to="/justicia"><FaBalanceScale /> Tribunal</NavLink>
          </div>
        </div>

        <div className="nav-right">
          {!isLoggedIn ? (
            <NavLink to="/login" className="login-button">
              <i className="fas fa-sign-in-alt" /> Iniciar sesión
            </NavLink>
          ) : (
            <>
              <div className="user-box"
                onMouseEnter={handleProfileEnter}
                onMouseLeave={handleProfileLeave}>
                <div className="user-trigger">
                  <img src={`https://mc-heads.net/avatar/${username}/32`} alt="avatar" className="user-avatar" />
                  <span className="username">{username}</span>
                </div>

                <div className={`user-dropdown-wrapper ${profileOpen ? 'open' : ''}`}
                  onMouseEnter={handleProfileEnter}
                  onMouseLeave={handleProfileLeave}>
                  <div className="user-dropdown">
                    <div className="user-header">
                      <img src={`https://mc-heads.net/avatar/${username}/64`} alt="avatar" className="user-avatar-large" />
                      <div>
                        <p className="username-big">{username} <span className="level-text">Nv. {userLevel}</span></p>
                        <p className="uuid">ID: {uuid.slice(0, 6)}...</p>
                      </div>
                    </div>

                    <div className="xp-bar-profile">
                      <div className="xp-fill" style={{ width: `${(userXP / userXPMax) * 100}%` }} />
                    </div>

                    <NavLink to={`/perfil/${username}`} className="dropdown-link">
                      <i className="fas fa-chart-bar" /> Ver estadísticas
                    </NavLink>

                    <button className="dropdown-link logout-button">
                      <i className="fas fa-sign-out-alt" /> Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>

              <NavLink to="/recompensas" className="rewards-button">
                <i className="fas fa-gift" /> Recompensas
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* --- Mobile Slide Menu --- */}
      <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}></div>
      <div className="mobile-menu">
  <div className="mobile-logo-header">
  <i className="fas fa-times close-menu-button" onClick={() => setMenuOpen(false)} />
    <img src="/assets/blockhorn.png" alt="Blockhorn" className="blockhorn-logo" />
    <div class="logo-divider"></div>
    <div class="logo-glow-wrapper">
  <img src="/assets/flancraftlogo.png" alt="Flancraft" class="flancraft-logo" />
</div>
  </div>

  <NavLink to="/noticias">Noticias</NavLink>
  <NavLink to="/mundos">Mundos</NavLink>
  <NavLink to="/slimefun">Slimefun</NavLink>
  <NavLink to="/estadisticas">Stats</NavLink>
  <NavLink to="/tienda-tebex">Tienda</NavLink>
  <NavLink to="/justicia">Tribunal</NavLink>
</div>
    </nav>
  );
};

export default Navbar;
