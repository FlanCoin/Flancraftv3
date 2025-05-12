import React, { useState } from 'react';
import clsx from 'clsx';

export default function ClaimEco({ uid, mock = false }) {
  const [level, setLevel] = useState(12); // nivel actual
  const [nextRewardAt, setNextRewardAt] = useState(15); // nivel objetivo
  const [claimed, setClaimed] = useState(false); // si ya se reclamó
  const [ecoReward, setEcoReward] = useState(250); // ECO otorgado

  const handleClaim = () => {
    if (level >= nextRewardAt && !claimed) {
      setClaimed(true);
      // 🔜 Aquí iría lógica POST a Supabase para marcar como reclamado
    }
  };

  const progress = Math.min((level / nextRewardAt) * 100, 100);

  return (
    <div className="bg-flan-gray text-white p-6 rounded-lg shadow-lg border border-yellow-500">
      <h2 className="text-xl font-bold text-flan-gold mb-2">🎁 Recompensa por Nivel</h2>
      <p className="text-sm mb-2 text-gray-300">
        Al llegar al nivel <span className="font-bold text-yellow-300">{nextRewardAt}</span> podrás reclamar{' '}
        <span className="font-bold text-green-400">{ecoReward} ECO</span>
      </p>

      <div className="bg-gray-800 border border-yellow-600 h-3 rounded mb-2 overflow-hidden">
        <div
          className="bg-yellow-400 h-full transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mb-4">Progreso: {level}/{nextRewardAt} niveles</p>

      <button
        onClick={handleClaim}
        disabled={claimed || level < nextRewardAt}
        className={clsx(
          'w-full py-2 px-4 rounded font-bold transition duration-300 ease-in-out',
          claimed
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-green-500 text-black hover:bg-green-600'
        )}
      >
        {claimed ? '✅ Recompensa Reclamada' : 'Reclamar ECO'}
      </button>
    </div>
  );
}
