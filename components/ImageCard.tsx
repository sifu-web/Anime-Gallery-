'use client';

import Image from 'next/image';
import { transformedUrl } from '@/lib/imagekit-url';
import type { ImageItem } from '@/lib/types';

export default function ImageCard({
  image,
  selected,
  onToggleSelect,
  onOpen,
  onDirectDownload,
  onSetCover
}: {
  image: ImageItem;
  selected: boolean;
  onToggleSelect: () => void;
  onOpen: () => void;
  onDirectDownload: () => void;
  onSetCover?: () => void;
}) {
  const thumb = transformedUrl(image.thumbnail_url, { width: 480, quality: 65 });

  return (
    <div className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-surface">
      {onSetCover && (
        <button
          onClick={(e) => { e.stopPropagation(); onSetCover(); }}
          className="absolute top-2 right-2 z-20 rounded-full bg-black/60 px-2 py-1 text-xs font-bold text-yellow-300 border border-yellow-400/40 hover:bg-yellow-400/20 transition-colors"
        >
          Cover
        </button>
      )}
      <button onClick={onOpen} className="absolute inset-0" aria-label={`Open ${image.title}`}>
        <Image
          src={thumb}
          alt={image.title}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </button>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect();
        }}
        aria-pressed={selected}
        aria-label="Select image"
        className={`absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-md border transition-colors ${
          selected ? 'border-sakura bg-sakura text-void' : 'border-white/30 bg-black/30 text-transparent group-hover:border-white/60'
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDirectDownload();
        }}
        aria-label="Download image"
        className="absolute bottom-2 right-2 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-black/50 text-ink opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 2v8m0 0l-3-3m3 3l3-3M3 13h10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
