import React from 'react';
import NewsHighlight from './NewsHighlight';
import '../styles/components/_playerdashboard.scss';

const PlayerDashboard = () => {
  return (
    <section className="player-dashboard">
      <div className="pd-bg" />
      <div className="pd-wrapper">
        <div className="dashboard-top">
          {/* PERFIL */}
          <div className="card perfil">
            <div className="avatar-block">
              <img src="/assets/avatar.jpg" alt="Avatar" />
              <h4>Sir Lancelot</h4>
            </div>
            <div className="xp-bar"><div /></div>
            <ul className="stats">
              <li>Monstruos vencidos: 48</li>
              <li>Misiones completadas: 12</li>
              <li>Logros: 6</li>
            </ul>
          </div>

          {/* MISIONES */}
          <div className="card misiones">
            <ul>
              <li>Visita el foro <span>+10 XP</span></li>
              <li className="completada">Completa una misión <span>+15 XP</span></li>
              <li>Explora la mazmorra <span>+30 XP</span></li>
            </ul>
            <div className="contador">Próxima actualización: 12:45:30</div>
          </div>

          {/* EVENTOS */}
          <div className="card eventos">
            <div className="evento-card">
              <img src="/assets/evento1.jpg" alt="Torneo" />
              <h5>Torneo de Caballeros</h5>
              <p>Comienza en 2 días</p>
              <button className="cta">Participar</button>
            </div>
            <div className="evento-card">
              <img src="/assets/evento2.webp" alt="Feria" />
              <h5>Feria del Comercio</h5>
              <p>Finaliza en 5h</p>
              <button className="cta">Visitar</button>
            </div>
          </div>
        </div>

        {/* NEWS */}
        <NewsHighlight />
      </div>
    </section>
  );
};

export default PlayerDashboard;
