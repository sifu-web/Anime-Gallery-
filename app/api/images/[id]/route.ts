import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { deleteImage } from '@/lib/imagekit';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';
import type { Category } from '@/lib/categories';

export const runtime = 'nodejs';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get(SESSION_COOKIE.name)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: 'Admin login required.' }, { status: 401 });
  }

  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: 'Invalid image id.' }, { status: 400 });
  }

  const rows = (await sql`
    SELECT id, category, imagekit_file_id FROM images WHERE id = ${id}
  `) as { id: number; category: Category; imagekit_file_id: string }[];

  const image = rows[0];
  if (!image) {
    return NextResponse.json({ error: 'Image not found.' }, { status: 404 });
  }

  try {
    await deleteImage(image.category, image.imagekit_file_id);
  } catch (err) {
    // If it's already gone from ImageKit, don't block removing the DB row —
    // but do log it, since this could also mean a config problem.
    console.warn('ImageKit delete failed (continuing to remove DB row):', err);
  }

  await sql`DELETE FROM images WHERE id = ${id}`;

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: 'Invalid image id.' }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const field = body.action === 'download' ? 'download_count' : body.action === 'view' ? 'view_count' : null;

  if (!field) {
    return NextResponse.json({ error: 'action must be "download" or "view".' }, { status: 400 });
  }

  if (field === 'download_count') {
    await sql`UPDATE images SET download_count = download_count + 1 WHERE id = ${id}`;
  } else {
    await sql`UPDATE images SET view_count = view_count + 1 WHERE id = ${id}`;
  }

  return NextResponse.json({ ok: true });
}
