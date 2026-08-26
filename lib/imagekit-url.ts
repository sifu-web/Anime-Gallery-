/**
 * Builds a resized/compressed ImageKit delivery URL from a base file URL.
 * Pure string manipulation — safe to import from client components.
 */
export function transformedUrl(
  baseUrl: string,
  opts: { width?: number; quality?: number; format?: 'auto' | 'webp'; background?: string } = {}
) {
  const { width = 480, quality = 70, format = 'auto', background = '000000' } = opts;
  const params = [`w-${width}`, `q-${quality}`, `f-${format}`].join(',');
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}tr=${params}`;
}
