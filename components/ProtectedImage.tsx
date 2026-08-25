'use client';

import Image, { type ImageProps } from 'next/image';

/**
 * Wraps next/image with the strongest *frontend* deterrents against
 * "long-press / right-click → save image" on the visible preview.
 *
 * Layers used (each one is bypassable on its own — stacking them is what
 * raises the effort required):
 *  1. protected-img CSS: kills iOS long-press callout, drag-out-to-save,
 *     and disables pointer-events on the <img> itself.
 *  2. A transparent shield <div> placed ON TOP of the image, so the
 *     browser's context menu / long-press targets that div, not an
 *     <img> element — most mobile browsers only offer "Save image"
 *     when the touch target IS an <img>.
 *  3. onContextMenu / onDragStart preventDefault() for desktop
 *     right-click and click-drag saving.
 *
 * NOTE: none of this stops screenshots, and it must NOT be relied on as
 * the actual access control — that has to happen server-side (don't ship
 * the real file_url to the client before the ad step; see lib/ads.ts +
 * the download routes).
 */
export default function ProtectedImage(props: ImageProps) {
  const { className, ...rest } = props;

  return (
    <div className="relative h-full w-full">
      <Image
        {...rest}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        className={`protected-img ${className ?? ''}`}
      />
      {/* The shield absorbs the actual long-press/right-click gesture. */}
      <div
        className="protected-img-shield"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}
