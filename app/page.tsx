import { sql } from '@/lib/db';
import { CATEGORIES, CATEGORY_LIST } from '@/lib/categories';
import { transformedUrl } from '@/lib/imagekit-url';
import CategoryCard from '@/components/CategoryCard';
import Reveal from '@/components/Reveal';

const DEFAULT_COVERS: Record<string, string> = {
  'profile-pic': '/covers/profile-pic.jpg',
  'anime-wallpaper': '/covers/anime-wallpaper.jpg',
  'natural-wallpaper': '/covers/natural-wallpaper.jpg',
};

export const revalidate = 60;

async function getPreviewUrls() {
  const previews: Record<string, string | null> = {};
  for (const category of CATEGORY_LIST) {
    try {
      const rows = (await sql`
        SELECT file_url FROM images
        WHERE category = ${category}
        ORDER BY created_at DESC
        LIMIT 1
      `) as { file_url: string }[];
      previews[category] = rows[0] ? transformedUrl(rows[0].file_url, { width: 800, quality: 65 }) : DEFAULT_COVERS[category];
    } catch {
      previews[category] = DEFAULT_COVERS[category]; // DB not configured yet / empty table — show default cover
    }
  }
  return previews;
}

export default async function HomePage() {
  const previews = await getPreviewUrls();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 pb-24 pt-16 md:pt-24">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Anime Gallery</p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight md:text-6xl">
          Wallpapers that feel like a still from your favorite scene.
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Fast-loading, high-resolution profile pictures and wallpapers — pick a category to start
          browsing.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
        {CATEGORY_LIST.map((category, i) => (
          <Reveal key={category} delayMs={i * 90}>
            <CategoryCard
              category={category}
              label={CATEGORIES[category].label}
              description={CATEGORIES[category].description}
              accent={CATEGORIES[category].accent}
              previewUrl={previews[category]}
              index={i}
            />
          </Reveal>
        ))}
      </div>

      <footer className="mt-24 flex items-center justify-between border-t border-edge pt-6 text-xs text-muted">
        <span>© {new Date().getFullYear()} Anime Gallery</span>
        <a href="/admin/login" className="opacity-40 transition-opacity hover:opacity-80">
          Admin
        </a>
      </footer>
    </main>
  );
}
