import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { isCategory } from '@/lib/categories';
import { uploadImage } from '@/lib/imagekit';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';

const PAGE_SIZE = 30;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || '';
  const page = Math.max(1, Number(searchParams.get('page') || '1'));

  if (!isCategory(category)) {
    return NextResponse.json({ error: 'Invalid or missing category.' }, { status: 400 });
  }

  const offset = (page - 1) * PAGE_SIZE;

  try {
    const rows = (await sql`
      SELECT id, category, title, file_url, thumbnail_url, width, height,
             size_bytes, download_count, created_at
      FROM images
      WHERE category = ${category}
      ORDER BY created_at DESC
      LIMIT ${PAGE_SIZE + 1}
      OFFSET ${offset}
    `) as any[];

    const hasMore = rows.length > PAGE_SIZE;
    const items = rows.slice(0, PAGE_SIZE);

    return NextResponse.json({ items, hasMore, page });
  } catch (err) {
    console.error('GET /api/images failed', err);
    return NextResponse.json({ error: 'Could not load images right now.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE.name)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: 'Admin login required.' }, { status: 401 });
  }

  const form = await req.formData();
  const category = String(form.get('category') || '');
  const title = String(form.get('title') || '');
  const files = form.getAll('files') as File[];

  if (!isCategory(category)) {
    return NextResponse.json({ error: 'Invalid category.' }, { status: 400 });
  }
  if (!files.length) {
    return NextResponse.json({ error: 'No files were provided.' }, { status: 400 });
  }

  const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
  const MAX_BYTES = 15 * 1024 * 1024; // 15MB per original file

  const results: any[] = [];
  const errors: { fileName: string; reason: string }[] = [];

  for (const file of files) {
    if (!ALLOWED_TYPES.has(file.type)) {
      errors.push({ fileName: file.name, reason: 'Unsupported file type.' });
      continue;
    }
    if (file.size > MAX_BYTES) {
      errors.push({ fileName: file.name, reason: 'File exceeds the 15MB limit.' });
      continue;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploaded = await uploadImage(category, {
        file: buffer,
        fileName: file.name,
        tags: title ? [title] : undefined
      });

      const inserted = (await sql`
        INSERT INTO images
          (category, imagekit_file_id, title, file_url, thumbnail_url, width, height, size_bytes, uploaded_by)
        VALUES (
          ${category},
          ${uploaded.fileId},
          ${title || file.name},
          ${uploaded.url},
          ${uploaded.url},
          ${uploaded.width ?? null},
          ${uploaded.height ?? null},
          ${uploaded.size ?? file.size},
          ${session.username}
        )
        RETURNING id, category, title, file_url, thumbnail_url, width, height, size_bytes, created_at
      `) as any[];

      results.push(inserted[0]);
    } catch (err: any) {
      console.error('Upload failed for', file.name, err);
      errors.push({ fileName: file.name, reason: 'Upload failed. Check server logs.' });
    }
  }

  return NextResponse.json({ uploaded: results, errors }, { status: errors.length && !results.length ? 400 : 200 });
}
