import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginModal from "./components/Auth/LoginModal";
import { Toaster } from "react-hot-toast";

// Páginas públicas
import Home from "./pages/Home";
import AllNews from "./components/AllNews";
import NewsDetail from "./components/NewsDetail";
import DashboardPage from "./components/DashboardPage";
import Tienda from './components/Tienda';
import RangoSelectorAnimado from "./components/RangoSelectorAnimado";

// Tribunal System
import TribunalMain from "./pages/tribunal/TribunalMain";
import TribunalAdmin from "./pages/tribunal/TribunalAdmin";
import GestionStaff from './components/Admin/GestionStaff';
import NoticiasAdmin from './components/Admin/NoticiasAdmin';
import PerfilJugador from "./components/PerfilJugador";
import LeaderboardsPage from "./pages/LeaderboardsPage";
import EditarNoticia from "./components/EditarNoticia"; // ✅ nueva importación

import "@fortawesome/fontawesome-free/css/all.min.css";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <Navbar onLoginClick={() => setShowLogin(true)} />
      <Toaster position="top-center" reverseOrder={false} />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      <Routes>
        {/* 🌐 Público */}
        <Route path="/" element={<Home onLoginClick={() => setShowLogin(true)} />} />
        <Route path="/news" element={<AllNews />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="/tienda" element={<Tienda />} />
        <Route path="/rangos" element={<RangoSelectorAnimado />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/leaderboards" element={<LeaderboardsPage />} />
        <Route path="/perfil/:nombre" element={<PerfilJugador />} />

        {/* 🛡️ Admin Paneles */}
        <Route path="/admin" element={<GestionStaff />} />
        <Route path="/admin/noticias" element={<NoticiasAdmin />} />
        <Route path="/admin/noticias/editar/:id" element={<EditarNoticia />} />

        {/* ⚖️ Tribunal System */}
        <Route path="/tribunal" element={<TribunalMain />} />
        <Route path="/tribunal/admin" element={<TribunalAdmin />} />
      </Routes>
    </>
  );
};

export default App;
