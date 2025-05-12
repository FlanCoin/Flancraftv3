import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const mockStats = {
  playtimeHours: 134,
  deaths: 12,
  mobsKilled: {
    Zombie: 58,
    Creeper: 22,
    Enderman: 9,
    Skeleton: 41,
  },
  blocksMined: {
    Stone: 4021,
    Dirt: 1233,
    DiamondOre: 31,
    IronOre: 87,
    CoalOre: 213,
  },
  favoriteTool: "Pico de Netherite",
  dimensionTime: {
    Overworld: 120,
    Nether: 10,
    End: 4,
  }
};

export default function StatsSection({ uid, mock = false }) {
  const stats = mock ? mockStats : mockStats; // reemplazar por Supabase más adelante

  const blocksData = {
    labels: Object.keys(stats.blocksMined),
    datasets: [{
      label: 'Bloques minados',
      data: Object.values(stats.blocksMined),
      backgroundColor: '#FACC15',
      borderRadius: 6
    }]
  };

  const mobsData = {
    labels: Object.keys(stats.mobsKilled),
    datasets: [{
      label: 'Mobs eliminados',
      data: Object.values(stats.mobsKilled),
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
          <p className="mt-1">{stats.playtimeHours} horas</p>
        </div>

        <div className="bg-flan-gray p-4 rounded border border-yellow-600">
          <p className="text-red-400 font-bold">💀 Muertes Totales</p>
          <p className="mt-1">{stats.deaths}</p>
        </div>

        <div className="bg-flan-gray p-4 rounded border border-yellow-600">
          <p className="text-blue-300 font-bold">🛠 Herramienta Favorita</p>
          <p className="mt-1">{stats.favoriteTool}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold text-purple-300 mb-2">🌌 Tiempo por Dimensión</h3>
        <ul className="space-y-1">
          {Object.entries(stats.dimensionTime).map(([dim, hours]) => (
            <li key={dim} className="text-sm">
              <span className="font-bold text-yellow-200">{dim}</span>: {hours}h
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
