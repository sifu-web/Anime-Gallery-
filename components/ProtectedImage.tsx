'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';

export default function ProtectedImage(props: ImageProps) {
  const { className, onLoad, onError, fill, ...rest } = props;
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className={fill ? 'relative h-full w-full overflow-hidden' : 'relative inline-block overflow-hidden'} style={{ transform: 'translateZ(0)' }}>
      {!loaded && !failed && (
        <div className="skeleton absolute inset-0 z-0 flex items-center justify-center" aria-hidden>
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
        </div>
      )}

      {failed ? (
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-surface text-xs text-muted">
          Image failed to load
        </div>
      ) : (
        <Image
          {...rest}
          fill={fill}
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
        <div className="protected-img-shield" onContextMenu={(e) => e.preventDefault()} />
      )}
    </div>
  );
}
