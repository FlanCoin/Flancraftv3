import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const token = req.headers['authorization']?.split(' ')[1];
  if (token !== process.env.SYNC_TOKEN) return res.status(403).json({ error: 'Token inválido' });

  const { uid, mission_id, progress } = req.body;
  if (!uid || !mission_id || typeof progress !== 'number') {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }

  const { data, error } = await supabase
    .from('player_missions')
    .upsert([{ uid, mission_id, progress, updated_at: new Date().toISOString() }], {
      onConflict: ['uid', 'mission_id']
    });

  if (error) return res.status(500).json({ error: 'Supabase error', details: error });

  return res.status(200).json({ success: true, data });
}
