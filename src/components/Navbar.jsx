import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { supabase } from "@lib/supabaseClient";
import NavbarMobile from "./NavbarMobile";
import NavbarDesktop from "./NavbarDesktop";
import "../styles/components/navbar.scss";

const Navbar = ({ onLoginClick }) => {
  const { user } = useContext(UserContext);
  const isLoggedIn = Boolean(user && user.loggedIn);

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownTimeout = useRef(null);
  const profileTimeout = useRef(null);

  const [userData, setUserData] = useState({
    username: user?.name || '',
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
    if (!user?.uuid) return;
    const fetchUser = async () => {
      try {
        const [userRes, monedasRes] = await Promise.all([
          supabase.from("usuarios").select("*").eq("uuid", user.uuid).single(),
          fetch(`https://flancraftweb-backend.onrender.com/api/monedas/${user.uuid}`)
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
  }, [user]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.profile-button')) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handlers = {
    handleDropdownHover: (key) => {
      clearTimeout(dropdownTimeout.current);
      setActiveDropdown(key);
    },
    handleDropdownLeave: () => {
      dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 200);
    },
    handleProfileEnter: () => {
      clearTimeout(profileTimeout.current);
      setProfileOpen(true);
    },
    handleProfileLeave: () => {
      profileTimeout.current = setTimeout(() => setProfileOpen(false), 250);
    },
    toggleDropdown: (key) => {
      setActiveDropdown((prev) => (prev === key ? null : key));
    },
  };

  const sharedProps = {
    menuOpen,
    setMenuOpen,
    activeDropdown,
    setActiveDropdown,
    profileOpen,
    setProfileOpen,
    isLoggedIn,
    userData,
    onLoginClick,
    ...handlers,
  };

  return (
    <nav className={`navbar-flancraft ${menuOpen ? 'menu-open' : ''}`}>
      <NavbarMobile {...sharedProps} />
      <NavbarDesktop {...sharedProps} />
    </nav>
  );
};

export default Navbar;
