import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/lib/categories';

const ACCENT_CLASSES: Record<string, { ring: string; text: string; glow: string; badge: string }> = {
  sakura: {
    ring: 'group-hover:ring-violet-500/60',
    text: 'text-violet-400',
    glow: 'hover:shadow-[0_20px_60px_-12px_rgba(124,58,237,0.5),0_0_0_1px_rgba(124,58,237,0.15)]',
    badge: 'bg-violet-500/15 text-violet-300'
  },
  aurora: {
    ring: 'group-hover:ring-cyan-500/60',
    text: 'text-cyan-400',
    glow: 'hover:shadow-[0_20px_60px_-12px_rgba(6,182,212,0.5),0_0_0_1px_rgba(6,182,212,0.15)]',
    badge: 'bg-cyan-500/15 text-cyan-300'
  },
  amber: {
    ring: 'group-hover:ring-emerald-500/60',
    text: 'text-emerald-400',
    glow: 'hover:shadow-[0_20px_60px_-12px_rgba(16,185,129,0.5),0_0_0_1px_rgba(16,185,129,0.15)]',
    badge: 'bg-emerald-500/15 text-emerald-300'
  }
};

export default function CategoryCard({
  category,
  label,
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
      className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-surface ring-1 ring-transparent transition-all duration-500 ${a.glow} h-[420px] md:h-[480px]`}
      style={{
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'perspective(1000px) rotateX(3deg) rotateY(-3deg) translateY(-8px) scale(1.02)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
      }}
    >
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={label}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
            priority={index === 0}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-surface-2 via-surface to-void" />
        )}
        {/* Dark gradient overlay — stronger at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      {/* Ring border */}
      <div className={`absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 transition-all duration-500 ${a.ring}`} />

      {/* Content — bottom */}
      <div className="relative z-10 flex flex-col gap-3 p-6">
        <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-mono font-bold tracking-widest backdrop-blur-sm ${a.badge}`}>
          0{index + 1}
        </span>

        <h3 className="font-display text-3xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
          {label}
        </h3>

        <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${a.text}`}>
          Browse gallery
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
            className="transition-transform duration-300 group-hover:translate-x-1">
            <path d="M3 8h10m0 0L9 4m4 4L9 12"
              stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </Link>
  );
}
