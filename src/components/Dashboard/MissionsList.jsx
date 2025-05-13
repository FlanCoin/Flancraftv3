import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { supabase } from "@lib/supabaseClient";

export default function MissionsList({ uid }) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧠 Cargar misiones desde Supabase
  useEffect(() => {
    const fetchMissions = async () => {
      if (!uid) return;

      const { data, error } = await supabase
        .from("player_missions")
        .select("*, missions (title, description, goal, reward_xp)")
        .eq("uid", uid);

      if (!error && data) {
        const formatted = data.map((entry) => ({
          id: entry.mission_id,
          progress: entry.progress,
          claimed: entry.claimed,
          title: entry.missions.title,
          description: entry.missions.description,
          goal: entry.missions.goal,
          rewardXP: entry.missions.reward_xp,
        }));
        setMissions(formatted);
      }

      setLoading(false);
    };

    fetchMissions();
  }, [uid]);

  // 🔐 Reclamar misión
  const handleClaim = async (id) => {
    const updated = missions.map((m) =>
      m.id === id ? { ...m, claimed: true } : m
    );
    setMissions(updated);

    const { error } = await supabase
      .from("player_missions")
      .update({ claimed: true })
      .eq("uid", uid)
      .eq("mission_id", id);

    if (error) {
      console.error("❌ Error reclamando misión:", error.message);
    }
  };

  if (loading) return <p className="text-white">⏳ Cargando misiones...</p>;

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
