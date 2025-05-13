import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const rawToken = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || null;
  const userAgent = req.headers['user-agent'] || '';

  const {
    uuid,
    name,
    deaths,
    blocks_mined,
    mobs_killed,
    playtime_ticks,
    advancements
  } = req.body;

  // 🧩 Preparar payload para insertar en player_stats
  const statPayload = {
    uuid,
    name,
    deaths: deaths ?? 0,
    blocks_mined: blocks_mined ?? {},
    mobs_killed: mobs_killed ?? {},
    playtime_ticks: playtime_ticks ?? 0,
    advancements: advancements ?? [],
    updated_at: new Date().toISOString()
  };

  // 🧠 Registrar intento web en sync_logs_web
  await supabase.from('sync_logs_web').insert([
    {
      uuid,
      name,
      ip,
      token: rawToken,
      user_agent: userAgent,
      payload: statPayload
    }
  ]);

  // 🔐 Validación de token
  if (rawToken !== process.env.SYNC_TOKEN) {
    return res.status(403).json({ error: 'Token inválido' });
  }

  // 💾 Insertar/actualizar stats reales
  const { data, error } = await supabase
    .from('player_stats')
    .upsert(statPayload, { onConflict: ['uuid'] });

  if (error) {
    console.error('❌ Error al insertar en Supabase:', error);
    return res.status(500).json({ error: 'Error interno al guardar datos' });
  }

  return res.status(200).json({ success: true, data });
}
