import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const token = req.headers['x-api-key'];
  if (token !== process.env.SYNC_TOKEN) {
    return res.status(403).json({ error: 'Token inválido' });
  }

  const payload = req.body;

  const requiredFields = ['uid', 'uuid', 'nivel', 'xp_actual', 'playtime'];
  for (let field of requiredFields) {
    if (!payload[field]) {
      return res.status(400).json({ error: `Falta el campo: ${field}` });
    }
  }

  const { uid, uuid, nivel, xp_actual, playtime, bloques_mined, mobs_killed, muertes } = payload;

  const { data, error } = await supabase
    .from('usuarios')
    .upsert([
      {
        uid,
        uuid,
        nivel,
        xp_actual,
        playtime,
        bloques_mined: bloques_mined || {},
        mobs_killed: mobs_killed || {},
        muertes: muertes || 0,
        updated_at: new Date().toISOString()
      }
    ]);

  if (error) {
    console.error('❌ Error Supabase:', error);
    return res.status(500).json({ error: 'Error interno' });
  }

  return res.status(200).json({ success: true, data });
}
