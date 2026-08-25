import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CATEGORIES, isCategory } from '@/lib/categories';
import GalleryPageClient from '@/components/GalleryPageClient';

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  if (!isCategory(params.category)) return {};
  const meta = CATEGORIES[params.category];
  return {
    title: meta.label,
    description: meta.description,
    openGraph: { title: meta.label, description: meta.description }
  };
}

export default function GalleryCategoryPage({ params }: { params: { category: string } }) {
  if (!isCategory(params.category)) notFound();
  const meta = CATEGORIES[params.category];

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 pb-32 pt-10 md:pt-16">
      <a href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        ← All categories
      </a>
      <h1 className="font-display text-3xl font-semibold md:text-4xl">{meta.label}</h1>
      

      <div className="mt-8">
        <GalleryPageClient category={params.category} />
      </div>
    </main>
  );
}
