import React, { useEffect, useState } from 'react';
import { supabase } from '@lib/supabaseClient';
import clsx from 'clsx';

const ProfileCard = ({ uid, mock = false }) => {
  const [user, setUser] = useState({
    username: 'StevePro',
    level: 7,
    xp: 150,
    xpMax: 200,
    uuid: '123456-abcd',
    avatar: 'StevePro',
  });

  useEffect(() => {
    if (!mock && uid) {
      const fetchUser = async () => {
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('uid', uid)
          .single();

        if (data) {
          setUser({
            username: data.uid,
            level: data.nivel,
            xp: data.xp_actual,
            xpMax: 100, // puedes calcular XP máxima según nivel si haces sistema escalable
            uuid: data.uuid || 'desconocido',
            avatar: data.uid,
          });
        }
      };

      fetchUser();
    }
  }, [mock, uid]);

  const xpPercent = Math.min(100, (user.xp / user.xpMax) * 100);

  return (
    <div className="bg-[#1d1b1b] text-white p-6 rounded-lg shadow-lg border border-yellow-400">
      <div className="flex items-center space-x-4">
        <img
          src={`https://mc-heads.net/avatar/${user.avatar}/64`}
          alt="avatar"
          className="rounded pixel-avatar border-2 border-yellow-400"
        />
        <div>
          <h3 className="text-xl font-bold">{user.username}</h3>
          <p className="text-sm text-yellow-400">Nv. {user.level}</p>
          <p className="text-xs text-gray-400">ID: {user.uuid.slice(0, 8)}...</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="w-full bg-gray-800 rounded h-4 relative overflow-hidden border border-yellow-500">
          <div
            className="bg-yellow-400 h-full transition-all duration-500 ease-in-out"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
        <p className="text-xs text-center mt-1">
          XP: {user.xp}/{user.xpMax}
        </p>
      </div>

      <div className="mt-6">
        <button
          className={clsx(
            "w-full py-2 px-4 rounded font-bold transition",
            "bg-yellow-500 hover:bg-yellow-600 text-black"
          )}
        >
          Ver perfil completo
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
