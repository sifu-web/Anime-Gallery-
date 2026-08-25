'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES, CATEGORY_LIST } from '@/lib/categories';

type Stats = {
  byCategory: Record<string, { count: number; usedBytes: number; capBytes: number; downloads: number }>;
  totalImages: number;
  totalUsedBytes: number;
  totalCapBytes: number;
  totalDownloads: number;
};

function gb(bytes: number) {
  return (bytes / (1024 * 1024 * 1024)).toFixed(2);
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/storage-stats')
      .then((r) => r.json())
      .then(setStats);
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 pb-24 pt-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <button onClick={logout} className="rounded-full border border-edge px-4 py-1.5 text-sm text-muted hover:text-ink">
          Log out
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total images" value={stats?.totalImages ?? '—'} />
        <StatCard label="Total downloads" value={stats?.totalDownloads ?? '—'} />
        <StatCard label="Storage used" value={stats ? `${gb(stats.totalUsedBytes)} GB` : '—'} />
        <StatCard label="Storage cap" value={stats ? `${gb(stats.totalCapBytes)} GB` : '—'} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {CATEGORY_LIST.map((category) => {
          const c = stats?.byCategory[category];
          const pct = c ? Math.min(100, (c.usedBytes / c.capBytes) * 100) : 0;
          const nearCap = pct > 85;
          return (
            <a
              key={category}
              href={`/admin/${category}`}
              className="block rounded-xl border border-edge bg-surface p-5 transition-colors hover:border-white/30"
            >
              <p className="font-display text-lg font-medium">{CATEGORIES[category].label}</p>
              <p className="mt-1 text-sm text-muted">{c ? `${c.count} images` : '—'}</p>

              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className={`h-full rounded-full ${nearCap ? 'bg-amber' : 'bg-aurora'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1 font-mono text-xs text-muted">
                {c ? `${gb(c.usedBytes)} / ${gb(c.capBytes)} GB` : '—'}
              </p>
              {nearCap && <p className="mt-2 text-xs text-amber">⚠ Approaching storage limit</p>}
            </a>
          );
        })}
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-edge bg-surface p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}
