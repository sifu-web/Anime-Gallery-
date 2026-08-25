import { sql } from '../lib/db';
import { CATEGORIES, CATEGORY_LIST } from '../lib/categories';
import { transformedUrl } from '../lib/imagekit-url';
import CategoryCard from '../components/CategoryCard';
import Reveal from '../components/Reveal';

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
      // An admin-picked cover always wins. Only when nothing has been
      // manually set for this category do we fall back to the most
      // recently uploaded image, then to the static default asset.
      const coverRows = (await sql`
        SELECT cover_url FROM category_covers WHERE category = ${category}
      `) as { cover_url: string }[];

      if (coverRows[0]) {
        previews[category] = transformedUrl(coverRows[0].cover_url, { width: 800, quality: 65 });
        continue;
      }

      const rows = (await sql`
        SELECT file_url FROM images
        WHERE category = ${category}
        ORDER BY created_at DESC
        LIMIT 1
      `) as { file_url: string }[];
      previews[category] = rows[0] ? transformedUrl(rows[0].file_url, { width: 800, quality: 65 }) : DEFAULT_COVERS[category];
    } catch {
      previews[category] = DEFAULT_COVERS[category];
    }
  }
  return previews;
}

export default async function HomePage() {
  const previews = await getPreviewUrls();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 pb-24 pt-16 md:pt-24">
      <Reveal>
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Premium Gallery</p>
        </div>

        <h1 className="mt-2 font-display leading-none">
          <span className="block text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent" style={{WebkitTextFillColor: 'transparent', textShadow: 'none'}}>
            ANIME
          </span>
          <span className="block text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent" style={{WebkitTextFillColor: 'transparent', textShadow: 'none'}}>
            GALLERY
          </span>
        </h1>
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
