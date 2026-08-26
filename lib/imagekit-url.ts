/**
 * Builds a resized/compressed ImageKit delivery URL from a base file URL.
 * Pure string manipulation — safe to import from client components.
 */
export function transformedUrl(
  baseUrl: string,
  opts: { width?: number; height?: number; quality?: number; format?: 'auto' | 'webp'; background?: string } = {}
) {
  const { width = 480, height, quality = 70, format = 'auto', background = '000000' } = opts;
  const params = [`w-${width}`, ...(height ? [`h-${height}`] : []), `q-${quality}`, `f-${format}`, `c-force`].join(',');
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}tr=${params}`;
}
