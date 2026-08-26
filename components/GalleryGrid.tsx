'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Category } from '@/lib/categories';
import { MAX_SELECTION } from '@/lib/categories';
import type { ImageItem } from '@/lib/types';
import { runAdExperience } from '@/lib/ads';
import ImageCard from './ImageCard';
import Lightbox from './Lightbox';
import SelectionBar from './SelectionBar';
import LoadingSkeleton from './LoadingSkeleton';

async function downloadBlobResponse(res: Response, filename: string) {
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function GalleryGrid({ category, isAdmin, onSetCover }: { category: Category; isAdmin: boolean; onSetCover?: (url: string) => void }) {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [lightboxId, setLightboxId] = useState<number | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadPage = useCallback(
    async (p: number) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/images?category=${category}&page=${p}`);
        if (!res.ok) throw new Error('Request failed');
        const data = await res.json();
        setItems((prev) => (p === 1 ? data.items : [...prev, ...data.items]));
        setHasMore(data.hasMore);
      } catch {
        setError('Could not load images. Check your connection and try again.');
      } finally {
        setLoading(false);
      }
    },
    [category]
  );

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    loadPage(1);
  }, [category, loadPage]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const next = page + 1;
          setPage(next);
          loadPage(next);
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [page, hasMore, loading, loadPage]);

  function toggleSelect(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX_SELECTION) {
        next.add(id);
      }
      return next;
    });
  }

  async function directDownload(image: ImageItem) {
    if (!isAdmin) await runAdExperience();
    fetch(`/api/images/${image.id}`, { method: 'PATCH', body: JSON.stringify({ action: 'download' }) }).catch(() => {});

    // Fetch the file as a blob and save it via a blob: URL instead of
    // pointing an <a> straight at image.file_url. This matters for two
    // reasons: (1) with target="_blank" + a real CDN URL, some mobile
    // browsers just open the image in a new tab where it's trivially
    // long-press-saved anyway, bypassing the ad step entirely; (2) it
    // keeps the download behaviour identical to bulkDownload's blob flow,
    // so there's one consistent, harder-to-intercept path.
    try {
      const res = await fetch(image.file_url);
      if (!res.ok) throw new Error('fetch failed');
      await downloadBlobResponse(res, `${image.title || 'wallpaper'}.jpg`);
    } catch {
      // Fallback so a network hiccup doesn't leave the user with nothing —
      // worst case they get the old open-in-new-tab behaviour.
      const a = document.createElement('a');
      a.href = image.file_url;
      a.download = `${image.title || 'wallpaper'}.jpg`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  async function bulkDownload() {
    if (!isAdmin) await runAdExperience();
    setBulkBusy(true);
    try {
      const selectedItems = items.filter(img => selected.has(img.id));
      for (let i = 0; i < selectedItems.length; i++) {
        const img = selectedItems[i];
        try {
          const res = await fetch(img.file_url);
          if (res.ok) {
            await downloadBlobResponse(res, `${img.title || 'wallpaper'}.jpg`);
          }
        } catch {
          const a = document.createElement('a');
          a.href = img.file_url;
          a.download = `${img.title || 'wallpaper'}.jpg`;
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        if (i < selectedItems.length - 1) await new Promise(r => setTimeout(r, 800));
      }
      setSelected(new Set());
    } catch {
      setError('Bulk download failed.');
    } finally {
      setBulkBusy(false);
    }
  }

  async function deleteSingle(id: number) {
    const res = await fetch(`/api/images/${id}`, { method: 'DELETE' });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function bulkDelete() {
    if (!confirm(`Are you sure you want to delete ${selected.size} images? This cannot be undone.`)) return;
    setBulkBusy(true);
    try {
      const res = await fetch('/api/images/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selected) })
      });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => !selected.has(i.id)));
        setSelected(new Set());
      }
    } finally {
      setBulkBusy(false);
    }
  }

  const lightboxImage = items.find((i) => i.id === lightboxId) ?? null;

  return (
    <div>
      {error && <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

      {items.length === 0 && !loading && !error && (
        <div className="rounded-xl border border-dashed border-edge p-12 text-center text-muted">
          No images here yet.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {items.map((image) => (
          <div key={image.id} className="group/tile relative">
            <ImageCard
              image={image}
              selected={selected.has(image.id)}
              onToggleSelect={() => toggleSelect(image.id)}
              onOpen={() => setLightboxId(image.id)}
              onDirectDownload={() => directDownload(image)}
              onSetCover={isAdmin && onSetCover ? () => onSetCover(image.file_url) : undefined}
              index={items.indexOf(image)}
            />
            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSingle(image.id);
                }}
                aria-label="Delete image"
                className="absolute bottom-2 left-2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-red-400/50 bg-gradient-to-b from-red-500/70 to-red-800/80 text-base font-bold text-white shadow-[0_2px_0_rgba(0,0,0,0.55),0_4px_8px_rgba(0,0,0,0.45)] transition-all duration-150 active:translate-y-[2px] active:shadow-[0_0px_0_rgba(0,0,0,0.55)]"
              >
                ×
              </button>
          )}
          </div>
        ))}
      </div>

      {loading && <div className="mt-3"><LoadingSkeleton count={8} /></div>}
      <div ref={sentinelRef} className="h-1" />

      {lightboxImage && (
        <Lightbox
          image={lightboxImage}
          selected={selected.has(lightboxImage.id)}
          onClose={() => setLightboxId(null)}
          onToggleSelect={() => toggleSelect(lightboxImage.id)}
          onDownload={() => directDownload(lightboxImage)}
        />
      )}

      <SelectionBar
        count={selected.size}
        onClear={() => setSelected(new Set())}
        onDownload={bulkDownload}
        onDelete={isAdmin ? bulkDelete : undefined}
        isAdmin={isAdmin}
        busy={bulkBusy}
      />
    </div>
  );
}
