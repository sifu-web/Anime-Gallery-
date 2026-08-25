import ImageKit from 'imagekit';
import type { Category } from './categories';

// Each category is backed by its own ImageKit account so the free 5GB
// storage / 25GB bandwidth tiers add up to roughly 15GB / 75GB total,
// instead of all categories competing for a single account's limit.
function buildClient(prefix: string) {
  const publicKey = process.env[`IMAGEKIT_${prefix}_PUBLIC_KEY`];
  const privateKey = process.env[`IMAGEKIT_${prefix}_PRIVATE_KEY`];
  const urlEndpoint = process.env[`IMAGEKIT_${prefix}_URL_ENDPOINT`];

  if (!publicKey || !privateKey || !urlEndpoint) {
    // Don't throw at import time (breaks `next build`) — throw only when
    // the client is actually used without being configured.
    return null;
  }

  return new ImageKit({ publicKey, privateKey, urlEndpoint });
}

const clients: Record<Category, ImageKit | null> = {
  'profile-pic': buildClient('PROFILE'),
  'anime-wallpaper': buildClient('ANIME'),
  'natural-wallpaper': buildClient('NATURAL')
};

export function getImageKitClient(category: Category): ImageKit {
  const client = clients[category];
  if (!client) {
    throw new Error(
      `ImageKit is not configured for category "${category}". Check the IMAGEKIT_* env vars.`
    );
  }
  return client;
}

export async function uploadImage(
  category: Category,
  opts: { file: Buffer; fileName: string; folder?: string; tags?: string[] }
) {
  const client = getImageKitClient(category);
  return client.upload({
    file: opts.file,
    fileName: opts.fileName,
    folder: opts.folder ?? `/${category}`,
    tags: opts.tags,
    useUniqueFileName: true
  });
}

export async function deleteImage(category: Category, fileId: string) {
  const client = getImageKitClient(category);
  return client.deleteFile(fileId);
}

export async function bulkDeleteImages(category: Category, fileIds: string[]) {
  const client = getImageKitClient(category);
  // ImageKit's bulk delete endpoint accepts up to 100 file IDs per call,
  // which matches this project's own 100-item selection cap.
  return client.bulkDeleteFiles(fileIds);
}

// Re-exported for convenience in server-side code (API routes, server
// components). Client components must import this from
// '@/lib/imagekit-url' directly instead — never from this file, since
// this file also pulls in the server-only ImageKit SDK.
export { transformedUrl } from './imagekit-url';
