import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'node:stream';
import archiver from 'archiver';
import { sql } from '@/lib/db';
import { MAX_SELECTION } from '@/lib/categories';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const ids: number[] = Array.isArray(body?.ids) ? body.ids.filter((n: any) => Number.isInteger(n)) : [];

  if (!ids.length) {
    return NextResponse.json({ error: 'No image ids provided.' }, { status: 400 });
  }
  if (ids.length > MAX_SELECTION) {
    return NextResponse.json({ error: `You can download at most ${MAX_SELECTION} images at once.` }, { status: 400 });
  }

  const rows = (await sql`
    SELECT id, title, file_url FROM images WHERE id = ANY(${ids})
  `) as { id: number; title: string; file_url: string }[];

  if (!rows.length) {
    return NextResponse.json({ error: 'None of the selected images were found.' }, { status: 404 });
  }

  const archive = archiver('zip', { zlib: { level: 6 } });

  // Fetch and append one file at a time — each remote file is streamed
  // straight into the archive instead of being buffered fully in memory.
  (async () => {
    const usedNames = new Set<string>();
    for (const row of rows) {
      try {
        const res = await fetch(row.file_url);
        if (!res.ok || !res.body) continue;

        let baseName = (row.title || `image-${row.id}`).replace(/[^a-z0-9-_ ]/gi, '_').trim() || `image-${row.id}`;
        const ext = row.file_url.split('.').pop()?.split('?')[0]?.slice(0, 4) || 'jpg';
        let name = `${baseName}.${ext}`;
        let suffix = 1;
        while (usedNames.has(name)) {
          name = `${baseName}-${suffix++}.${ext}`;
        }
        usedNames.add(name);

        archive.append(Readable.fromWeb(res.body as any), { name });
      } catch (err) {
        console.warn(`Skipping file ${row.id} in bulk download:`, err);
      }
    }
    archive.finalize();
  })();

  const idsFound = rows.map((r) => r.id);
  sql`UPDATE images SET download_count = download_count + 1 WHERE id = ANY(${idsFound})`.catch((err) =>
    console.warn('Failed to bump download counts', err)
  );

  return new NextResponse(Readable.toWeb(archive) as any, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="anime-gallery-${Date.now()}.zip"`
    }
  });
}
