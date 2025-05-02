import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers['x-api-key'];
  if (token !== process.env.JAILTRACKER_SECRET) {
    return res.status(403).json({ error: 'Forbidden: invalid token' });
  }

  const jail = req.body;

  console.log('📥 Jail recibido:', jail);

  if (!jail.uuid || !jail.name || !jail.moderator || !jail.timestamp) {
    console.warn('⚠️ Falta algún campo requerido');
    return res.status(400).json({ error: 'Missing jail data' });
  }

  const { data, error } = await supabase
  .from('jails')
  .insert([
    {
      uuid: jail.uuid,
      name: jail.name,
      moderator: jail.moderator,
      duration: jail.duration,
      timestamp: Number(jail.timestamp),
      server: jail.server,
      type: jail.type || null
    }
  ]);


  if (error) {
    console.error('❌ Error al guardar en Supabase (raw):', error);


    return res.status(500).json({
        error: 'Supabase insert failed',
        raw: error
      });
  }

  return res.status(200).json({ success: true, data });
}
