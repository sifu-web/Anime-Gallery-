'use client';

import { useEffect, useState } from 'react';
import { transformedUrl } from '@/lib/imagekit-url';
import type { ImageItem } from '@/lib/types';
import ProtectedImage from './ProtectedImage';

export default function Lightbox({
  image,
  selected,
  onClose,
  onToggleSelect,
  onDownload
}: {
  image: ImageItem;
  selected: boolean;
  onClose: () => void;
  onToggleSelect: () => void;
  onDownload: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    // Push history entry so mobile back button closes lightbox
    history.pushState({ lightbox: true }, '');
    const onPop = () => onClose();
    window.addEventListener('popstate', onPop);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('popstate', onPop);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Lightbox preview is intentionally capped lower than a "real" download:
  // 1000px / q60 is plenty to judge the wallpaper on a phone screen, but
  // is a noticeably worse file than what the ad-gated download delivers.
  // This narrows the incentive to long-press/screenshot this preview
  // instead of just going through Download.
  const previewUrl = transformedUrl(image.file_url, { width: 1000, quality: 60, crop: false });

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between py-6 bg-void/90 backdrop-blur-md transition-opacity duration-300 ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={image.title}
    >
      <div
        className={`relative flex max-h-[90vh] w-full max-w-4xl flex-col gap-4 px-4 pb-4 transition-transform duration-300 ${
          mounted ? 'scale-100' : 'scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative mx-auto max-h-[70vh] w-fit overflow-hidden rounded-xl bg-surface">
          {!imgLoaded && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface/80">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-edge border-t-sakura" />
            </div>
          )}
          <div className="absolute -inset-6">
            <ProtectedImage
              src={previewUrl}
              alt=""
              fill
              className="object-cover scale-110 blur-2xl opacity-60"
            />
          </div>
          <ProtectedImage
            src={previewUrl}
            alt={image.title}
            onLoad={() => setImgLoaded(true)}
            width={image.width ?? 1600}
            height={image.height ?? 900}
            className="relative mx-auto max-h-[70vh] w-auto object-contain drop-shadow-2xl"
            priority
          />
        </div>

        <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-xl border border-edge px-4 py-3">
          <div>
            <p className="font-display text-sm font-medium text-ink">{image.title}</p>
            <p className="font-mono text-xs text-muted">
              {image.width && image.height ? `${image.width}×${image.height} · ` : ''}
              {(image.size_bytes / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSelect}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                selected ? 'border-sakura bg-sakura text-void' : 'border-edge text-ink hover:border-sakura/60'
              }`}
            >
              {selected ? 'Selected' : 'Select'}
            </button>
            <button
              onClick={onDownload}
              className="rounded-full bg-sakura px-4 py-1.5 text-sm font-medium text-void transition-transform hover:scale-[1.03]"
            >
              Download
            </button>
            <button
              onClick={onClose}
              aria-label="Close preview"
              className="rounded-full border border-edge p-2 text-ink hover:border-white/40"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
