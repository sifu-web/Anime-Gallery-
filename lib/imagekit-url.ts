/**
 * Builds a resized/compressed ImageKit delivery URL from a base file URL.
 * Pure string manipulation — safe to import from client components.
 */
export function transformedUrl(
  baseUrl: string,
  opts: { width?: number; height?: number; quality?: number; format?: 'auto' | 'webp'; background?: string; crop?: boolean } = {}
) {
  const { width = 480, height, quality = 70, format = 'auto', background = '000000', crop = true } = opts;
  const params = [`w-${width}`, ...(height ? [`h-${height}`] : []), `q-${quality}`, `f-${format}`, ...(crop && height ? ['c-force'] : [])].join(',');
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}tr=${params}`;
}
