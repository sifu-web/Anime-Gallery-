'use client';

import { transformedUrl } from '@/lib/imagekit-url';
import type { ImageItem } from '@/lib/types';
import ProtectedImage from './ProtectedImage';

// Shared "3D" button treatment: a soft gradient face + a hard offset shadow
// that reads as a raised chip, plus a pressed-in state on tap/click so it
// gives real tactile feedback on touch screens (not just :hover, which
// mobile browsers never fire).
const chip3d =
  'shadow-[0_2px_0_rgba(0,0,0,0.55),0_4px_8px_rgba(0,0,0,0.45)] ' +
  'active:shadow-[0_0px_0_rgba(0,0,0,0.55)] active:translate-y-[2px] ' +
  'transition-all duration-150';

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
  const isProfilePic = image.category === "profile-pic";
  const thumb = transformedUrl(image.thumbnail_url, { width: 480, height: isProfilePic ? undefined : 640, quality: 65, crop: !isProfilePic });

  return (
    <div className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-surface ring-1 ring-white/10">
      <button onClick={onOpen} className="absolute inset-0" aria-label={`Open ${image.title}`}>
        <ProtectedImage
          src={thumb}
          alt={image.title}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </button>

      {/* Always-on bottom gradient so icons stay readable over bright/white
          parts of an image, not just on hover (hover never fires on touch). */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/40" />

      {/* Select checkbox — top-left, always visible */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect();
        }}
        aria-pressed={selected}
        aria-label="Select image"
        className={`absolute left-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-md border ${chip3d} ${
          selected
            ? 'border-sakura bg-sakura text-void'
            : 'border-white/40 bg-black/55 text-white/80 backdrop-blur-sm'
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Set-as-cover — top-right, admin only, always visible */}
      {onSetCover && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSetCover();
          }}
          className={`absolute right-2 top-2 z-20 rounded-full border border-yellow-400/50 bg-gradient-to-b from-yellow-400/30 to-black/60 px-2.5 py-1 text-xs font-bold text-yellow-300 backdrop-blur-sm ${chip3d}`}
        >
          Cover
        </button>
      )}

      {/* Download — bottom-right, always visible */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDirectDownload();
        }}
        aria-label="Download image"
        className={`absolute bottom-2 right-2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-gradient-to-b from-white/25 to-black/50 text-white backdrop-blur-sm ${chip3d}`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 2v8m0 0l-3-3m3 3l3-3M3 13h10"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
