import React from 'react';
import Dashboard from '../pages/Dashboard'; // Asegúrate que la ruta es correcta
import NewsHighlight from './NewsHighlight';
import '../styles/components/_playerdashboard.scss';

const PlayerDashboard = () => {
  return (
    <section className="player-dashboard">
      <div className="pd-bg" />
      <div className="pd-wrapper">
        {/* ✅ Reemplazamos todo el dashboard antiguo */}
        <Dashboard />

        {/* ✅ Noticias (sección inferior se mantiene igual) */}
        <NewsHighlight />
      </div>
    </section>
  );
};

export default PlayerDashboard;
