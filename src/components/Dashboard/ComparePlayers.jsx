import React, { useState } from 'react';

const mockPlayers = {
  StevePro: {
    level: 12,
    xp: 480,
    xpMax: 600,
    deaths: 14,
    mobsKilled: 130,
    blocksMined: 6234,
    favoriteTool: 'Pico de Diamante',
  },
  AlexMine: {
    level: 10,
    xp: 350,
    xpMax: 500,
    deaths: 9,
    mobsKilled: 160,
    blocksMined: 5400,
    favoriteTool: 'Espada de Hierro',
  }
};

export default function ComparePlayers({ mock = true }) {
  const [playerA, setPlayerA] = useState('StevePro');
  const [playerB, setPlayerB] = useState('AlexMine');

  const dataA = mockPlayers[playerA];
  const dataB = mockPlayers[playerB];

  return (
    <div className="bg-flan-dark text-white p-6 rounded-lg shadow-lg border border-yellow-400">
      <h2 className="text-2xl font-bold text-flan-gold mb-4">⚔️ Comparador de Jugadores</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <select
          value={playerA}
          onChange={(e) => setPlayerA(e.target.value)}
          className="bg-flan-gray text-white p-2 rounded border border-yellow-600"
        >
          {Object.keys(mockPlayers).map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <select
          value={playerB}
          onChange={(e) => setPlayerB(e.target.value)}
          className="bg-flan-gray text-white p-2 rounded border border-yellow-600"
        >
          {Object.keys(mockPlayers).map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-flan-gray p-4 rounded border border-yellow-700">
          <img
            src={`https://mc-heads.net/avatar/${playerA}/64`}
            alt={playerA}
            className="mb-2"
          />
          <p className="font-bold text-yellow-300 text-lg">{playerA}</p>
          <p>Nivel: {dataA.level}</p>
          <p>XP: {dataA.xp}/{dataA.xpMax}</p>
          <p>Muertes: {dataA.deaths}</p>
          <p>Mobs eliminados: {dataA.mobsKilled}</p>
          <p>Bloques minados: {dataA.blocksMined}</p>
          <p>Herramienta favorita: {dataA.favoriteTool}</p>
        </div>

        <div className="bg-flan-gray p-4 rounded border border-yellow-700">
          <img
            src={`https://mc-heads.net/avatar/${playerB}/64`}
            alt={playerB}
            className="mb-2"
          />
          <p className="font-bold text-yellow-300 text-lg">{playerB}</p>
          <p>Nivel: {dataB.level}</p>
          <p>XP: {dataB.xp}/{dataB.xpMax}</p>
          <p>Muertes: {dataB.deaths}</p>
          <p>Mobs eliminados: {dataB.mobsKilled}</p>
          <p>Bloques minados: {dataB.blocksMined}</p>
          <p>Herramienta favorita: {dataB.favoriteTool}</p>
        </div>
      </div>
    </div>
  );
}
