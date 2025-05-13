import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';

const formatCountdown = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}h ${m}m ${s}s`;
};

export default function EventsPanel() {
  const [events, setEvents] = useState([]);
  const [now, setNow] = useState(new Date());

  // Actualización en vivo del tiempo
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cargar eventos desde Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('ends_at', { ascending: true });

      if (data) {
        setEvents(data);
      } else {
        console.error('❌ Error al cargar eventos:', error);
      }
    };

    fetchEvents();
  }, []);

  const getTimeLeft = (event) => {
    const diff = new Date(event.ends_at) - now;
    return diff > 0 ? formatCountdown(diff) : "⛔ Finalizado";
  };

  return (
    <div className="bg-flan-gray text-white p-6 rounded-lg shadow-lg border border-yellow-400">
      <h2 className="text-2xl font-bold mb-4 text-flan-gold">🕒 Eventos Activos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => (
          <div key={event.id} className="bg-flan-dark rounded overflow-hidden shadow border border-yellow-700">
            {event.banner_url && (
              <img
                src={event.banner_url}
                alt={event.title}
                className="w-full h-32 object-cover object-center"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl text-yellow-400 font-bold mb-1">{event.title}</h3>
              <p className="text-sm text-gray-300 mb-3">{event.description}</p>
              <div className="text-sm font-mono text-yellow-300">
                ⏳ Finaliza en: <span className="font-bold">{getTimeLeft(event)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
