import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TribunalMain from './pages/tribunal/TribunalMain';
import TribunalLogin from './pages/tribunal/TribunalLogin';
import TribunalAdmin from './pages/tribunal/TribunalAdmin.jsx';
import TribunalStaff from './pages/tribunal/TribunalStaff';
import PerfilJugadorTribunal from './pages/tribunal/PerfilJugadorTribunal';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AllNews from './components/AllNews';
import NewsDetail from './components/NewsDetail';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Tribunal System */}
        <Route path="/news" element={<AllNews />} /> 
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="/tribunal" element={<TribunalMain />} />
        <Route path="/login" element={<TribunalLogin />} />
        <Route path="/admin" element={<TribunalAdmin />} />
        <Route path="/staff" element={<TribunalStaff />} />
        <Route path="/perfil/:nombre" element={<PerfilJugadorTribunal />} />
      </Routes>
    </>
  );
};

export default App;
