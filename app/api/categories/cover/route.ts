import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE.name)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: 'Admin login required.' }, { status: 401 });
  }

  const { category, cover_url } = await req.json().catch(() => ({}));
  if (!category || !cover_url) {
    return NextResponse.json({ error: 'category and cover_url required.' }, { status: 400 });
  }

  try {
    await sql`
      INSERT INTO category_covers (category, cover_url, updated_at)
      VALUES (${category}, ${cover_url}, now())
      ON CONFLICT (category) DO UPDATE SET cover_url = ${cover_url}, updated_at = now()
    `;
  } catch (err) {
    console.error('cover update failed', err);
    return NextResponse.json({ error: 'DB error: ' + (err instanceof Error ? err.message : String(err)) }, { status: 500 });
  }

  revalidatePath('/');

  return NextResponse.json({ success: true });
}
