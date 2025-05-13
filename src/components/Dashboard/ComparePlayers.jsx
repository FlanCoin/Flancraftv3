import React, { useEffect, useState } from 'react';
import { supabase } from '@lib/supabaseClient';

export default function ComparePlayers() {
  const [players, setPlayers] = useState([]);
  const [playerA, setPlayerA] = useState('');
  const [playerB, setPlayerB] = useState('');
  const [dataA, setDataA] = useState(null);
  const [dataB, setDataB] = useState(null);

  // Cargar lista de jugadores al montar
  useEffect(() => {
    const loadPlayers = async () => {
      const { data, error } = await supabase
        .from('player_stats')
        .select('uid');

      if (error) {
        console.error('❌ Error cargando jugadores:', error);
        return;
      }

      const names = data.map(p => p.uid);
      setPlayers(names);

      if (names.length >= 2) {
        setPlayerA(names[0]);
        setPlayerB(names[1]);
      }
    };

    loadPlayers();
  }, []);

  // Cargar datos de los jugadores seleccionados
  useEffect(() => {
    const loadStats = async (uid, setter) => {
      if (!uid) return;
      const { data } = await supabase
        .from('player_stats')
        .select('*')
        .eq('uid', uid)
        .single();

      if (data) setter(data);
    };

    loadStats(playerA, setDataA);
    loadStats(playerB, setDataB);
  }, [playerA, playerB]);

  const renderPlayer = (data, name) => {
    if (!data) return <p className="text-gray-400">Cargando datos de {name}...</p>;

    return (
      <div className="bg-flan-gray p-4 rounded border border-yellow-700">
        <img src={`https://mc-heads.net/avatar/${data.uid}/64`} alt={data.uid} className="mb-2" />
        <p className="font-bold text-yellow-300 text-lg">{data.uid}</p>
        <p>Nivel: {data.nivel}</p>
        <p>XP: {data.xp_actual}</p>
        <p>Muertes: {data.deaths || 0}</p>
        <p>Mobs eliminados: {Object.values(data.mobs_killed || {}).reduce((a, b) => a + b, 0)}</p>
        <p>Bloques minados: {Object.values(data.blocks_mined || {}).reduce((a, b) => a + b, 0)}</p>
      </div>
    );
  };

  return (
    <div className="bg-flan-dark text-white p-6 rounded-lg shadow-lg border border-yellow-400">
      <h2 className="text-2xl font-bold text-flan-gold mb-4">⚔️ Comparador de Jugadores</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <select
          value={playerA}
          onChange={(e) => setPlayerA(e.target.value)}
          className="bg-flan-gray text-white p-2 rounded border border-yellow-600"
        >
          {players.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <select
          value={playerB}
          onChange={(e) => setPlayerB(e.target.value)}
          className="bg-flan-gray text-white p-2 rounded border border-yellow-600"
        >
          {players.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        {renderPlayer(dataA, playerA)}
        {renderPlayer(dataB, playerB)}
      </div>
    </div>
  );
}
