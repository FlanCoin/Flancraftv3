import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaBalanceScale } from 'react-icons/fa';
import { supabase } from '@lib/supabaseClient';
import '../styles/components/_navbar.scss';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownTimeout = useRef(null);
  const profileTimeout = useRef(null);

  const uid = localStorage.getItem("flan_uid");
  const isLoggedIn = Boolean(uid);

  const [userData, setUserData] = useState({
    username: uid || '',
    uuid: '',
    userXP: 0,
    userXPMax: 100,
    userLevel: 1,
  });

  const handleLogout = () => {
    localStorage.removeItem("flan_uid");
    window.location.href = "/";
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!uid) return;

      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("uid", uid)
        .single();

      if (data) {
        setUserData({
          username: data.uid,
          uuid: data.uuid || 'desconocido',
          userXP: data.xp_actual,
          userXPMax: 100, // puedes hacer que esto escale dinámicamente
          userLevel: data.nivel,
        });
      }
    };

    fetchUser();
  }, [uid]);

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

  const toggleDropdown = (key) => {
    setActiveDropdown((prev) => (prev === key ? null : key));
  };

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
          <img src={`https://mc-heads.net/avatar/${userData.username}/32`} alt="avatar" />
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
            <NavLink to="/news"><i className="fas fa-scroll" /> Noticias</NavLink>

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

            <NavLink to="/tribunal"><FaBalanceScale /> Tribunal</NavLink>
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
                  <img src={`https://mc-heads.net/avatar/${userData.username}/32`} alt="avatar" className="user-avatar" />
                  <span className="username">{userData.username}</span>
                </div>

                <div className={`user-dropdown-wrapper ${profileOpen ? 'open' : ''}`}
                  onMouseEnter={handleProfileEnter}
                  onMouseLeave={handleProfileLeave}>
                  <div className="user-dropdown">
                    <div className="user-header">
                      <img src={`https://mc-heads.net/avatar/${userData.username}/64`} alt="avatar" className="user-avatar-large" />
                      <div>
                        <p className="username-big">{userData.username} <span className="level-text">Nv. {userData.userLevel}</span></p>
                        <p className="uuid">ID: {userData.uuid.slice(0, 6)}...</p>
                      </div>
                    </div>

                    <div className="xp-bar-profile">
                      <div className="xp-fill" style={{ width: `${(userData.userXP / userData.userXPMax) * 100}%` }} />
                    </div>

                    <NavLink to={`/perfil/${userData.username}`} className="dropdown-link">
                      <i className="fas fa-chart-bar" /> Ver estadísticas
                    </NavLink>

                    <button className="dropdown-link logout-button" onClick={handleLogout}>
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
          <div className="logo-divider"></div>
          <div className="logo-glow-wrapper">
            <img src="/assets/flancraftlogo.png" alt="Flancraft" className="flancraft-logo" />
          </div>
        </div>

        <div className="mobile-links">
          <NavLink to="/noticias"><i className="fas fa-scroll" /> Noticias</NavLink>
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

          <NavLink to="/slimefun"><i className="fas fa-flask" /> Slimefun</NavLink>
          <NavLink to="/estadisticas"><i className="fas fa-chart-line" /> Stats</NavLink>

          <div className={`mobile-dropdown ${activeDropdown === 'mercado' ? 'open' : ''}`}>
            <div className="mobile-dropdown-toggle" onClick={() => toggleDropdown('mercado')}>
              <i className="fas fa-store" /> Tienda
              <i className={`fas fa-chevron-down arrow-icon ${activeDropdown === 'mercado' ? 'open' : ''}`} />
            </div>
            <div className="mobile-dropdown-content">
              <NavLink to="/tienda-tebex"><i className="fas fa-gem" /> Store Servidor</NavLink>
              <NavLink to="/tienda-merch"><i className="fas fa-shopping-bag" /> Merchandising</NavLink>
            </div>
          </div>

          <NavLink to="/justicia"><i className="fas fa-gavel" /> Tribunal</NavLink>

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
    </nav>
  );
};

export default Navbar;
