'use client';

import type { Category } from '@/lib/categories';
import { useAdminSession } from './useAdminSession';
import GalleryGrid from './GalleryGrid';

export default function GalleryPageClient({ category }: { category: Category }) {
  const { authenticated } = useAdminSession();
  return <GalleryGrid category={category} isAdmin={authenticated} />;
}
