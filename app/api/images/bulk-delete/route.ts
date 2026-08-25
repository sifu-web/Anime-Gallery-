import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { bulkDeleteImages } from '@/lib/imagekit';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';
import { MAX_SELECTION } from '@/lib/categories';
import type { Category } from '@/lib/categories';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE.name)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: 'Admin login required.' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const ids: number[] = Array.isArray(body?.ids) ? body.ids.filter((n: any) => Number.isInteger(n)) : [];

  if (!ids.length) {
    return NextResponse.json({ error: 'No image ids provided.' }, { status: 400 });
  }
  if (ids.length > MAX_SELECTION) {
    return NextResponse.json({ error: `You can delete at most ${MAX_SELECTION} images at once.` }, { status: 400 });
  }

  const rows = (await sql`
    SELECT id, category, imagekit_file_id FROM images WHERE id = ANY(${ids})
  `) as { id: number; category: Category; imagekit_file_id: string }[];

  if (!rows.length) {
    return NextResponse.json({ error: 'None of the selected images were found.' }, { status: 404 });
  }

  const byCategory = new Map<Category, string[]>();
  for (const row of rows) {
    const list = byCategory.get(row.category) ?? [];
    list.push(row.imagekit_file_id);
    byCategory.set(row.category, list);
  }

  const imagekitErrors: string[] = [];
  for (const [category, fileIds] of byCategory) {
    try {
      await bulkDeleteImages(category, fileIds);
    } catch (err) {
      console.warn(`Bulk delete on ImageKit failed for category ${category}:`, err);
      imagekitErrors.push(category);
    }
  }

  const foundIds = rows.map((r) => r.id);
  await sql`DELETE FROM images WHERE id = ANY(${foundIds})`;

  return NextResponse.json({
    deleted: foundIds.length,
    notFound: ids.length - foundIds.length,
    imagekitWarnings: imagekitErrors
  });
}
