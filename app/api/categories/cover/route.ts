import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE.name)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const { category, cover_url } = await req.json().catch(() => ({}));

  await sql`
    INSERT INTO category_covers (category, cover_url, updated_at)
    VALUES (${category}, ${cover_url}, now())
    ON CONFLICT (category) DO UPDATE SET cover_url = ${cover_url}, updated_at = now()
  `;

  return NextResponse.json({ success: true });
}
