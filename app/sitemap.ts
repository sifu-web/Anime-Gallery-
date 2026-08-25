import type { MetadataRoute } from 'next';
import { CATEGORY_LIST } from '@/lib/categories';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const routes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'daily', priority: 1 }
  ];

  for (const category of CATEGORY_LIST) {
    routes.push({
      url: `${siteUrl}/gallery/${category}`,
      changeFrequency: 'daily',
      priority: 0.8
    });
  }

  return routes;
}
