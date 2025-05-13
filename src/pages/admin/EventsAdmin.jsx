import React, { useState, useEffect } from "react";
import { supabase } from "@lib/supabaseClient";

export default function EventsAdmin() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    ends_at: "",
    banner_url: ""
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("ends_at", { ascending: false });

    if (data) setEvents(data);
    if (error) console.error("❌ Error cargando eventos:", error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

const { data, error } = await supabase.from("events").insert([form]);
console.log("✅ Evento creado:", data[0]);
    if (error) return alert("❌ Error al crear evento");
    alert("✅ Evento creado");
    setForm({ title: "", description: "", ends_at: "", banner_url: "" });
    loadEvents();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">🎪 Admin de Eventos</h1>

      <form onSubmit={handleSubmit} className="bg-flan-gray p-6 rounded-lg mb-8 border border-yellow-600">
        <input
          type="text"
          placeholder="Título del evento"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full mb-4 p-2 rounded bg-black text-white border border-yellow-400"
          required
        />
        <textarea
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full mb-4 p-2 rounded bg-black text-white border border-yellow-400"
        />
        <input
          type="datetime-local"
          value={form.ends_at}
          onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
          className="w-full mb-4 p-2 rounded bg-black text-white border border-yellow-400"
          required
        />
        <input
          type="text"
          placeholder="URL del banner"
          value={form.banner_url}
          onChange={(e) => setForm({ ...form, banner_url: e.target.value })}
          className="w-full mb-4 p-2 rounded bg-black text-white border border-yellow-400"
        />
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-2 rounded"
        >
          Crear Evento
        </button>
      </form>

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="p-4 bg-flan-dark border border-yellow-700 rounded shadow">
            <h3 className="text-xl font-bold text-yellow-300">{event.title}</h3>
            <p className="text-sm text-gray-400">{event.description}</p>
            <p className="text-xs mt-2">🕒 Finaliza: {new Date(event.ends_at).toLocaleString()}</p>
            {event.banner_url && (
              <img src={event.banner_url} alt={event.title} className="mt-2 w-full h-32 object-cover rounded" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
