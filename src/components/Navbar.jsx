import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaBalanceScale } from 'react-icons/fa';
import { supabase } from '@lib/supabaseClient';
import LogoutButton from './Auth/LogoutButton';
import '../styles/components/_navbar.scss';

const Navbar = ({ onLoginClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownTimeout = useRef(null);
  const profileTimeout = useRef(null);

  const stored = localStorage.getItem("flan_user");
  const parsed = stored ? JSON.parse(stored) : null;
  const isLoggedIn = Boolean(parsed && parsed.loggedIn);

  const [userData, setUserData] = useState({
    username: parsed?.name || '',
    uuid: '',
    userXP: 0,
    userXPMax: 100,
    userLevel: 1,
    ecos: 0,
  });

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
  if (!parsed?.uuid) return;

  const fetchUser = async () => {
    try {
      const [userRes, monedasRes] = await Promise.all([
        supabase.from("usuarios").select("*").eq("uuid", parsed.uuid).single(),
        fetch(`https://flancraftweb-backend.onrender.com/api/monedas/${parsed.uuid}`)
      ]);

      const userData = userRes.data;
      const monedas = monedasRes.ok ? await monedasRes.json() : { ecos: 0 };

      if (userData) {
        setUserData({
          username: userData.uid,
          uuid: userData.uuid || 'desconocido',
          userXP: userData.xp_actual,
          userXPMax: 100,
          userLevel: userData.nivel,
          ecos: monedas.ecos || 0,
        });
      }
    } catch (error) {
      console.error("Error al cargar usuario:", error);
    }
  };

  fetchUser();
}, []);


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

        <div className="profile-button">
          <img src={`https://mc-heads.net/avatar/${userData.username}/32`} alt="avatar" />
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="navbar-content desktop-only">
        <div className="nav-left-wrapper">
          <div className="nav-left">
            <Link to="/" className="logo">
              <img src="/assets/logonav.png" alt="Flancraft logo" className="logo-img" />
            </Link>
          </div>

          <div className="nav-center links">
            <NavLink to="/"><i className="fas fa-home" /> Inicio</NavLink>
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

            <NavLink to="/estadisticas"><i className="fas fa-chart-line" /> Estadísticas</NavLink>

            <div className={`dropdown ${activeDropdown === 'mercado' ? 'show-dropdown' : ''}`}
              onMouseEnter={() => handleDropdownHover('mercado')}
              onMouseLeave={handleDropdownLeave}>
              <span className="dropdown-toggle">
                <i className="fas fa-store" /> Mercado <i className="fas fa-chevron-down arrow-icon" />
              </span>
              <div className="dropdown-menu">
                <NavLink to="/tienda"><i className="fas fa-gem" /> Store Servidor</NavLink>
                <NavLink to="/tienda-merch"><i className="fas fa-shopping-bag" /> Merchandising</NavLink>
              </div>
            </div>

            <NavLink to="/tribunal"><FaBalanceScale /> Tribunal</NavLink>
          </div>
        </div>

        <div className="nav-right">
          {!isLoggedIn ? (
            <button className="login-button" onClick={onLoginClick}>
              <i className="fas fa-sign-in-alt" /> Iniciar sesión
            </button>
          ) : (
            <>
              <div
  className="user-box"
  onMouseEnter={handleProfileEnter}
  onMouseLeave={handleProfileLeave}
>
<Link to="/dashboard" className="user-trigger">
  <img
    src={`https://mc-heads.net/avatar/${userData.username}/32`}
    alt="avatar"
    className="user-avatar"
  />
  <span className="username">{userData.username}</span>
</Link>


  <div
    className={`user-dropdown-wrapper enhanced ${profileOpen ? 'open' : ''}`}
    onMouseEnter={handleProfileEnter}
    onMouseLeave={handleProfileLeave}
  >
    <div className="user-dropdown">
  <div className="user-header">
    <img
      src={`https://mc-heads.net/avatar/${userData.username}/64`}
      alt="avatar"
      className="user-avatar-large"
    />
    <div>
      <p className="username-big">
        {userData.username} <span className="level-text">Nv. {userData.userLevel}</span>
      </p>
      <p className="uuid">ID: {userData.uuid.slice(0, 6)}...</p>
    </div>
  </div>

  <div className="xp-bar-profile">
    <div
      className="xp-fill"
      style={{ width: `${(userData.userXP / userData.userXPMax) * 100}%` }}
    />
  </div>

  <div className="balance-wrapper">
  <div className="balance-item">
    <img src="/assets/eco.png" alt="ECOS" className="eco-icon-navbar" />
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
</div>

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

          
          <NavLink to="/estadisticas"><i className="fas fa-chart-line" /> Estadisticas</NavLink>

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
    </nav>
  );
};

export default Navbar;
