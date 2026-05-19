import { createClient } from '@supabase/supabase-js';

const TOURNAMENT_STATE_ID = process.env.TOURNAMENT_STATE_ID || '2026-cj-cup-byron-nelson';

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(url, key);
}

export async function GET() {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('tournament_state')
      .select('current_ranks, previous_ranks, locked_eliminated, cut_locked')
      .eq('id', TOURNAMENT_STATE_ID)
      .single();

    if (error) throw error;

    return Response.json(data || {});
  } catch (err) {
    return Response.json({
      error: err?.message || String(err),
      current_ranks: {},
      previous_ranks: {},
      locked_eliminated: [],
      cut_locked: false
    });
  }
}

export async function POST(req) {
  try {
    const supabase = getSupabase();
    const body = await req.json();

    const { error } = await supabase
      .from('tournament_state')
      .upsert({
        id: TOURNAMENT_STATE_ID,
        tournament_name: body.tournament_name || TOURNAMENT_STATE_ID,
        previous_ranks: body.previous_ranks || {},
        current_ranks: body.current_ranks || {},
        locked_eliminated: body.locked_eliminated || [],
        cut_locked: Boolean(body.cut_locked),
        updated_at: new Date().toISOString()
      });

    if (error) throw error;

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: err?.message || String(err) });
  }
}
