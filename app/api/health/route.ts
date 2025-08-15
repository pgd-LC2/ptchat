import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = supabaseServer();
    const { data } = await supabase.auth.getSession();
    return NextResponse.json({
      ok: true,
      supabase: 'configured',
      session: !!data.session,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'unknown';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
