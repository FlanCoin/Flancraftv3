import React, { useState } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const mockMissions = [
  {
    id: 1,
    title: "Recolecta 500 bloques de piedra",
    description: "¡Demuestra tu poder minero!",
    progress: 320,
    goal: 500,
    claimed: false,
    rewardXP: 150,
  },
  {
    id: 2,
    title: "Elimina 20 Creepers",
    description: "¡Los verdes no pasarán!",
    progress: 20,
    goal: 20,
    claimed: true,
    rewardXP: 300,
  },
  {
    id: 3,
    title: "Visita el mercado",
    description: "Solo mirar... o comprar 👀",
    progress: 1,
    goal: 1,
    claimed: false,
    rewardXP: 50,
  },
];

export default function MissionsList({ uid }) {
  const [missions, setMissions] = useState(mockMissions);

  const handleClaim = (id) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, claimed: true } : m
      )
    );
    // Aquí puedes hacer el POST a Supabase más adelante
  };

  return (
    <div className="bg-flan-dark text-white p-6 rounded-lg shadow-lg border border-flan-gold">
      <h2 className="text-2xl font-bold mb-4 text-flan-gold">📜 Misiones Diarias</h2>
      <div className="space-y-4">
        {missions.map((mission) => {
          const percent = Math.min(100, (mission.progress / mission.goal) * 100);
          return (
            <div key={mission.id} className="bg-flan-gray rounded p-4 shadow-inner">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-lg font-bold text-yellow-400">{mission.title}</h3>
                  <p className="text-sm text-gray-300">{mission.description}</p>
                </div>
                <span className="text-sm font-mono text-flan-gold">
                  +{mission.rewardXP} XP
                </span>
              </div>

              <div className="w-full bg-gray-800 rounded h-3 mb-2 border border-yellow-600">
                <motion.div
                  className="bg-yellow-400 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>

              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>{mission.progress}/{mission.goal}</span>
                <span>{mission.claimed ? "✅ Reclamada" : percent >= 100 ? "Disponible para reclamar" : "En progreso..."}</span>
              </div>

              <button
                onClick={() => handleClaim(mission.id)}
                disabled={mission.claimed || percent < 100}
                className={clsx(
                  "w-full py-2 px-4 mt-1 rounded font-bold transition duration-300 ease-in-out",
                  mission.claimed
                    ? "bg-gray-700 cursor-not-allowed text-gray-400"
                    : "bg-yellow-500 hover:bg-yellow-600 text-black"
                )}
              >
                {mission.claimed ? "Reclamada" : "Reclamar recompensa"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
