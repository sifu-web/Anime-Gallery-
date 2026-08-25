import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/lib/categories';

const ACCENT_CLASSES: Record<string, { ring: string; text: string; glow: string; badge: string }> = {
  sakura: {
    ring: 'group-hover:ring-sakura/60',
    text: 'text-sakura',
    glow: 'group-hover:shadow-glow',
    badge: 'bg-sakura/10 text-sakura'
  },
  aurora: {
    ring: 'group-hover:ring-aurora/60',
    text: 'text-aurora',
    glow: 'group-hover:shadow-glow-aurora',
    badge: 'bg-aurora/10 text-aurora'
  },
  amber: {
    ring: 'group-hover:ring-amber/60',
    text: 'text-amber',
    glow: 'group-hover:shadow-[0_0_0_1px_rgba(255,180,84,0.15),0_8px_40px_-8px_rgba(255,180,84,0.25)]',
    badge: 'bg-amber/10 text-amber'
  }
};

export default function CategoryCard({
  category,
  label,
  description,
  accent,
  previewUrl,
  index
}: {
  category: Category;
  label: string;
  description: string;
  accent: 'sakura' | 'aurora' | 'amber';
  previewUrl: string | null;
  index: number;
}) {
  const a = ACCENT_CLASSES[accent];

  return (
    <Link
      href={`/gallery/${category}`}
      className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-edge bg-surface ring-1 ring-transparent transition-shadow duration-500 ${a.glow} h-[420px] md:h-[480px]`}
    >
      <div className="absolute inset-0 overflow-hidden">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={label}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            priority={index === 0}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-surface-2 via-surface to-void" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent" />
      </div>

      <div className={`absolute inset-0 rounded-2xl ring-1 ring-inset ring-edge transition-all duration-500 ${a.ring}`} />

      <div className="relative z-10 flex flex-col gap-2 p-6">
        <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-mono ${a.badge}`}>
          0{index + 1}
        </span>
        <h3 className="font-display text-2xl font-semibold text-ink">{label}</h3>
        <p className="max-w-[34ch] text-sm text-muted">{description}</p>
        <span className={`mt-2 inline-flex items-center gap-1 text-sm font-medium ${a.text}`}>
          Browse gallery
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path
              d="M3 8h10m0 0L9 4m4 4L9 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
