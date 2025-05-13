import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import TribunalMain from './pages/tribunal/TribunalMain';
import TribunalLogin from './pages/tribunal/TribunalLogin';
import TribunalAdmin from './pages/tribunal/TribunalAdmin';
import TribunalStaff from './pages/tribunal/TribunalStaff';
import PerfilJugadorTribunal from './pages/tribunal/PerfilJugadorTribunal';

import AllNews from './components/AllNews';
import NewsDetail from './components/NewsDetail';

import Dashboard from './pages/Dashboard';
import StatsMine from './pages/StatsMine';
import Compare from './pages/Compare';

import ChatPanel from './pages/admin/ChatPanel';
import AdminRoute from './components/Auth/AdminRoute';

import ProtectedRoute from './components/Auth/ProtectedRoute';

import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* 🌐 Público */}
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<AllNews />} />
        <Route path="/news/:slug" element={<NewsDetail />} />

        {/* ⚖️ Tribunal System */}
        <Route path="/tribunal" element={<TribunalMain />} />
        <Route path="/login" element={<TribunalLogin />} />
        <Route path="/admin" element={<TribunalAdmin />} />
        <Route path="/staff" element={<TribunalStaff />} />
        <Route path="/perfil/:nombre" element={<PerfilJugadorTribunal />} />

        {/* 🔐 Privadas (requieren login con cuenta vinculada) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/statsmine"
          element={
            <ProtectedRoute>
              <StatsMine />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compare"
          element={
            <ProtectedRoute>
              <Compare />
            </ProtectedRoute>
          }
        />

        {/* 🛠 Admin Tools */}
        <Route
          path="/admin/chat"
          element={
            <AdminRoute>
              <ChatPanel />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
