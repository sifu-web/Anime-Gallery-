/**
 * Builds a resized/compressed ImageKit delivery URL from a base file URL.
 * Pure string manipulation — safe to import from client components.
 * (Kept separate from lib/imagekit.ts, which pulls in the server-only
 * ImageKit SDK and must never end up in a client bundle.)
 */
export function transformedUrl(
  baseUrl: string,
  opts: { width?: number; quality?: number; format?: 'auto' | 'webp' } = {}
) {
  const { width = 480, quality = 70, format = 'auto' } = opts;
  const params = [`w-${width}`, `q-${quality}`, `f-${format}`].join(',');
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}tr=${params}`;
}
