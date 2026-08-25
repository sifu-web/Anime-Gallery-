'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { CATEGORIES, isCategory } from '@/lib/categories';
import UploadDropzone from '@/components/UploadDropzone';
import GalleryGrid from '@/components/GalleryGrid';

export default function AdminCategoryPage({ params }: { params: { category: string } }) {
  const [refreshKey, setRefreshKey] = useState(0);

  if (!isCategory(params.category)) notFound();
  const meta = CATEGORIES[params.category];

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 pb-32 pt-10">
      <a href="/admin/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        ← Dashboard
      </a>
      <h1 className="font-display text-2xl font-semibold">{meta.label} · Admin</h1>

      <div className="mt-6">
        <UploadDropzone category={params.category} onUploaded={() => setRefreshKey((k) => k + 1)} />
      </div>

      <div className="mt-8">
        <GalleryGrid key={refreshKey} category={params.category} isAdmin />
      </div>
    </main>
  );
}
