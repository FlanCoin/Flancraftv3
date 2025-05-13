import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { supabase } from '@lib/supabaseClient';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function StatsSection({ uid }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('player_stats')
        .select('*')
        .eq('uid', uid)
        .single();

      if (error) {
        console.error('❌ Error cargando estadísticas:', error);
      } else {
        setStats(data);
      }

      setLoading(false);
    };

    if (uid) fetchStats();
  }, [uid]);

  if (loading || !stats) {
    return <div className="text-white text-center p-4">⛏ Cargando estadísticas...</div>;
  }

  const blocksMined = stats.blocks_mined || {};
  const mobsKilled = stats.mobs_killed || {};
  const advancements = stats.advancements || [];

  const playtimeHours = Math.floor((stats.playtime_ticks || 0) / 72000); // 20 ticks/seg x 60 seg x 60 min = 72,000

  const blocksData = {
    labels: Object.keys(blocksMined),
    datasets: [{
      label: 'Bloques minados',
      data: Object.values(blocksMined),
      backgroundColor: '#FACC15',
      borderRadius: 6
    }]
  };

  const mobsData = {
    labels: Object.keys(mobsKilled),
    datasets: [{
      label: 'Mobs eliminados',
      data: Object.values(mobsKilled),
      backgroundColor: '#4ADE80',
      borderRadius: 6
    }]
  };

  return (
    <div className="bg-flan-dark text-white p-6 rounded-lg shadow-lg border border-yellow-400">
      <h2 className="text-2xl font-bold text-flan-gold mb-6">📊 Mina de Estadísticas</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg text-yellow-300 font-bold mb-2">⛏ Bloques Minados</h3>
          <Bar data={blocksData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>

        <div>
          <h3 className="text-lg text-green-300 font-bold mb-2">⚔️ Mobs Eliminados</h3>
          <Bar data={mobsData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-flan-gray p-4 rounded border border-yellow-600">
          <p className="text-yellow-300 font-bold">🕓 Tiempo Jugado</p>
          <p className="mt-1">{playtimeHours} horas</p>
        </div>

        <div className="bg-flan-gray p-4 rounded border border-yellow-600">
          <p className="text-red-400 font-bold">💀 Muertes Totales</p>
          <p className="mt-1">{stats.deaths || 0}</p>
        </div>

        <div className="bg-flan-gray p-4 rounded border border-yellow-600">
          <p className="text-blue-300 font-bold">🏆 Logros Desbloqueados</p>
          <p className="mt-1">{advancements.length} logros</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold text-purple-300 mb-2">📜 Últimos Logros</h3>
        <ul className="space-y-1 text-sm">
          {advancements.slice(0, 5).map((adv, i) => (
            <li key={i} className="text-yellow-200">✔ {adv.replace("minecraft:", "")}</li>
          ))}
          {advancements.length === 0 && <li className="text-gray-400">No hay logros aún.</li>}
        </ul>
      </div>
    </div>
  );
}
