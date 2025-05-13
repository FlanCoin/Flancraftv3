import React, { useEffect, useState } from 'react';
import { supabase } from '@lib/supabaseClient';

export default function ChatLogsAdmin() {
  const [logs, setLogs] = useState([]);
  const [serverFilter, setServerFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [serverFilter, search]);

  const fetchLogs = async () => {
    let query = supabase
      .from('chat_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(200);

    if (serverFilter) query = query.eq('server', serverFilter);
    if (search) query = query.ilike('message', `%${search}%`);

    const { data, error } = await query;
    if (error) console.error(error);
    else setLogs(data);
  };

  const formatTime = (t) => new Date(t).toLocaleString('es-ES');

  return (
    <div className="p-8 text-white bg-flan-dark min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-flan-gold">💬 Registro de Chats</h1>

      <div className="flex gap-4 mb-4">
        <select
          onChange={(e) => setServerFilter(e.target.value)}
          value={serverFilter}
          className="bg-gray-800 border border-yellow-500 p-2 rounded"
        >
          <option value="">🌐 Todos los servidores</option>
          <option value="survival">🌲 Survival</option>
          <option value="oneblock">🧱 OneBlock</option>
          <option value="pokebox">🐉 Pokebox</option>
          <option value="creativo">🎨 Creativo</option>
          <option value="anarquico">🔥 Anárquico</option>
        </select>

        <input
          type="text"
          placeholder="🔍 Buscar mensaje o jugador"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 border border-yellow-500 p-2 rounded w-full"
        />
      </div>

      <div className="bg-flan-gray p-4 rounded shadow-inner border border-yellow-600 max-h-[70vh] overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-gray-400">No hay mensajes registrados.</p>
        ) : (
          <ul className="space-y-3 text-sm">
            {logs.map((log) => (
              <li key={log.id} className="border-b border-gray-700 pb-2">
                <span className="text-yellow-400 font-bold">{log.username}</span> 
                <span className="text-gray-400"> [{log.server}]</span>:
                <span className="ml-1 text-white">{log.message}</span>
                <div className="text-xs text-gray-500">{formatTime(log.timestamp)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
