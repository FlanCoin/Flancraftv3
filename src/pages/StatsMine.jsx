// src/pages/StatsMine.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function StatsMine() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const { data, error } = await supabase.from('player_stats').select('*');

      if (error) {
        console.error("Error cargando stats:", error);
        return;
      }

      // Procesar datos agregados
      const totalPlayers = data.length;
      let totalPlaytime = 0;
      let totalDeaths = 0;

      const blockCounts = {};
      const mobCounts = {};

      let topBlockPlayer = { uid: '', count: 0 };
      let topMobPlayer = { uid: '', count: 0 };

      data.forEach(player => {
        totalPlaytime += player.playtime_ticks || 0;
        totalDeaths += player.deaths || 0;

        const blocks = player.blocks_mined || {};
        const mobs = player.mobs_killed || {};

        // contar bloques
        let playerBlockTotal = 0;
        for (const block in blocks) {
          const count = blocks[block];
          playerBlockTotal += count;
          blockCounts[block] = (blockCounts[block] || 0) + count;
        }
        if (playerBlockTotal > topBlockPlayer.count) {
          topBlockPlayer = { uid: player.uid, count: playerBlockTotal };
        }

        // contar mobs
        let playerMobTotal = 0;
        for (const mob in mobs) {
          const count = mobs[mob];
          playerMobTotal += count;
          mobCounts[mob] = (mobCounts[mob] || 0) + count;
        }
        if (playerMobTotal > topMobPlayer.count) {
          topMobPlayer = { uid: player.uid, count: playerMobTotal };
        }
      });

      const topBlocks = Object.entries(blockCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      const topMobs = Object.entries(mobCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      setStats({
        totalPlayers,
        totalPlaytime,
        totalDeaths,
        averageDeaths: (totalDeaths / totalPlayers).toFixed(2),
        topBlocks,
        topMobs,
        topBlockPlayer,
        topMobPlayer,
      });
      setLoading(false);
    };

    loadStats();
  }, []);

  if (loading || !stats) {
    return <div className="p-8 text-yellow-300">Cargando estadísticas globales...</div>;
  }

  return (
    <div className="p-8 text-white bg-flan-dark">
      <h1 className="text-3xl font-bold text-flan-gold mb-4">⛏️ Mina de Estadísticas Globales</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-flan-gray p-4 rounded shadow">
          <h2 className="text-xl font-bold text-yellow-400">👥 Total de jugadores</h2>
          <p className="text-2xl">{stats.totalPlayers}</p>
        </div>

        <div className="bg-flan-gray p-4 rounded shadow">
          <h2 className="text-xl font-bold text-yellow-400">🕒 Tiempo total jugado</h2>
          <p className="text-2xl">{(stats.totalPlaytime / 72000).toFixed(1)} horas</p>
        </div>

        <div className="bg-flan-gray p-4 rounded shadow">
          <h2 className="text-xl font-bold text-yellow-400">💀 Muertes promedio por jugador</h2>
          <p className="text-2xl">{stats.averageDeaths}</p>
        </div>

        <div className="bg-flan-gray p-4 rounded shadow">
          <h2 className="text-xl font-bold text-yellow-400">🏆 Jugador con más bloques minados</h2>
          <p className="text-xl">{stats.topBlockPlayer.uid}</p>
          <p>{stats.topBlockPlayer.count} bloques</p>
        </div>

        <div className="bg-flan-gray p-4 rounded shadow">
          <h2 className="text-xl font-bold text-yellow-400">⚔️ Jugador con más mobs matados</h2>
          <p className="text-xl">{stats.topMobPlayer.uid}</p>
          <p>{stats.topMobPlayer.count} mobs</p>
        </div>

        <div className="bg-flan-gray p-4 rounded shadow col-span-2">
          <h2 className="text-xl font-bold text-yellow-400 mb-2">⬇️ Top 5 bloques más minados</h2>
          <ul className="list-disc list-inside">
            {stats.topBlocks.map(([block, count]) => (
              <li key={block}>{block} — {count} bloques</li>
            ))}
          </ul>
        </div>

        <div className="bg-flan-gray p-4 rounded shadow col-span-2">
          <h2 className="text-xl font-bold text-yellow-400 mb-2">🐲 Top 5 mobs más eliminados</h2>
          <ul className="list-disc list-inside">
            {stats.topMobs.map(([mob, count]) => (
              <li key={mob}>{mob} — {count} mobs</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
