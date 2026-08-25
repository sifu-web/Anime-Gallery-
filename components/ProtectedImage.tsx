'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';

/**
 * Wraps next/image with:
 *  1. The long-press/right-click deterrents (see prior version's notes).
 *  2. A network-aware loading state: a shimmer placeholder covers the
 *     image until the browser actually fires onLoad. There's no fake
 *     minimum delay — on a fast connection/cache hit this resolves in
 *     a frame or two and the shimmer never really registers; on a slow
 *     connection it stays up for as long as the real download takes.
 *     This directly replaces the old behaviour where a slow-loading
 *     image just showed as a flat black box (bg-surface is #000000)
 *     until it popped in, which read as a broken/glitchy screen.
 *  3. A soft opacity fade-in once the image is ready, instead of a
 *     hard pop-in.
 */
export default function ProtectedImage(props: ImageProps) {
  const { className, onLoad, onError, ...rest } = props;
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {!loaded && !failed && (
        <div className="skeleton absolute inset-0 z-0" aria-hidden />
      )}

      {failed ? (
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-surface text-xs text-muted">
          Image failed to load
        </div>
      ) : (
        <Image
          {...rest}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          onLoad={(e) => {
            setLoaded(true);
            onLoad?.(e);
          }}
          onError={(e) => {
            setFailed(true);
            onError?.(e);
          }}
          className={`protected-img relative z-[1] transition-opacity duration-500 ease-out ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${className ?? ''}`}
        />
      )}

      {!failed && (
        <div
          className="protected-img-shield"
          onContextMenu={(e) => e.preventDefault()}
        />
      )}
    </div>
  );
}
