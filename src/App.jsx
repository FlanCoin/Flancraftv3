// src/App.jsx
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginModal from "./components/Auth/LoginModal";

// Páginas públicas
import Home from "./pages/Home";
import AllNews from "./components/AllNews";
import NewsDetail from "./components/NewsDetail";
import DashboardPage from "./components/DashboardPage";
import Tienda from './components/Tienda';

// Tribunal System
import TribunalMain from "./pages/tribunal/TribunalMain";
import TribunalAdmin from "./pages/tribunal/TribunalAdmin";
import GestionStaff from './components/Admin/GestionStaff';
import PerfilJugadorTribunal from "./pages/tribunal/PerfilJugadorTribunal";
import LeaderboardsPage from "./pages/LeaderboardsPage";

import "@fortawesome/fontawesome-free/css/all.min.css";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <Navbar onLoginClick={() => setShowLogin(true)} />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      <Routes>
        {/* 🌐 Público */}
        <Route path="/" element={<Home onLoginClick={() => setShowLogin(true)} />} />
        <Route path="/news" element={<AllNews />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="/tienda" element={<Tienda />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/leaderboards" element={<LeaderboardsPage />} />
        <Route path="/admin" element={<GestionStaff />} />

        {/* ⚖️ Tribunal System (Staff) */}
        <Route path="/tribunal" element={<TribunalMain />} />
        <Route path="/tribunal/admin" element={<TribunalAdmin />} />
        <Route path="/perfil/:nombre" element={<PerfilJugadorTribunal />} />
    </Routes>
    </>
  );
};

export default App;
