import React, { useState, useEffect } from 'react';
import ProfileCard from '../components/Dashboard/ProfileCard';
import MissionsList from '../components/Dashboard/MissionsList';
import EventsPanel from '../components/Dashboard/EventsPanel';
import StatsSection from '../components/Dashboard/StatsSection';
import ComparePlayers from '../components/Dashboard/ComparePlayers';
import ClaimEco from '../components/Rewards/ClaimEco';

export default function Dashboard() {
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("flan_uid");
    setUid(user);
  }, []);

  if (!uid) {
    return (
      <div className="relative p-10 text-center">
        <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
          <h2 className="text-3xl mb-4">⚠️ Área protegida</h2>
          <p className="mb-4">Debes iniciar sesión para acceder a tu Torre del Jugador</p>
          <a href="/login" className="bg-yellow-500 px-4 py-2 rounded text-black font-bold">
            Ingresar
          </a>
        </div>

        {/* Render parcial blur mock */}
        <div className="opacity-40 pointer-events-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <ProfileCard mock />
              <ClaimEco mock />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <MissionsList mock />
              <EventsPanel mock />
              <StatsSection mock />
              <ComparePlayers mock />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-flan-dark min-h-screen text-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Perfil + recompensas */}
        <div className="lg:col-span-1 space-y-6">
          <ProfileCard uid={uid} />
          <ClaimEco uid={uid} />
        </div>

        {/* Misiones + eventos + stats + comparador */}
        <div className="lg:col-span-2 space-y-6">
          <MissionsList uid={uid} />
          <EventsPanel />
          <StatsSection uid={uid} />
          <ComparePlayers uid={uid} />
        </div>
      </div>
    </div>
  );
}
