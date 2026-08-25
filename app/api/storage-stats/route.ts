import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';
import { CATEGORY_LIST } from '@/lib/categories';

export const runtime = 'nodejs';

// Each category has its own dedicated ImageKit free-tier account (5GB each,
// per the project's storage plan). Adjust this if your plan changes.
const CAP_BYTES_PER_CATEGORY = 5 * 1024 * 1024 * 1024;

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE.name)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: 'Admin login required.' }, { status: 401 });
  }

  const rows = (await sql`
    SELECT category, COUNT(*)::int AS count, COALESCE(SUM(size_bytes), 0)::bigint AS total_bytes,
           COALESCE(SUM(download_count), 0)::bigint AS total_downloads
    FROM images
    GROUP BY category
  `) as { category: string; count: number; total_bytes: string; total_downloads: string }[];

  const byCategory: Record<string, any> = {};
  for (const category of CATEGORY_LIST) {
    byCategory[category] = { count: 0, usedBytes: 0, capBytes: CAP_BYTES_PER_CATEGORY, downloads: 0 };
  }
  for (const row of rows) {
    byCategory[row.category] = {
      count: row.count,
      usedBytes: Number(row.total_bytes),
      capBytes: CAP_BYTES_PER_CATEGORY,
      downloads: Number(row.total_downloads)
    };
  }

  const totalImages = Object.values(byCategory).reduce((sum: number, c: any) => sum + c.count, 0);
  const totalUsedBytes = Object.values(byCategory).reduce((sum: number, c: any) => sum + c.usedBytes, 0);
  const totalDownloads = Object.values(byCategory).reduce((sum: number, c: any) => sum + c.downloads, 0);

  return NextResponse.json({
    byCategory,
    totalImages,
    totalUsedBytes,
    totalCapBytes: CAP_BYTES_PER_CATEGORY * CATEGORY_LIST.length,
    totalDownloads
  });
}
