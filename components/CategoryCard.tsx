import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/categories";

const ACCENT: Record<string, {ring:string;text:string;badge:string}> = {
  sakura: {ring:"group-hover:ring-violet-500/60",text:"text-violet-400",badge:"bg-violet-500/15 text-violet-300"},
  aurora: {ring:"group-hover:ring-cyan-500/60",text:"text-cyan-400",badge:"bg-cyan-500/15 text-cyan-300"},
  amber:  {ring:"group-hover:ring-emerald-500/60",text:"text-emerald-400",badge:"bg-emerald-500/15 text-emerald-300"},
};

export default function CategoryCard({category,label,description,accent,previewUrl,index}:{category:Category;label:string;description:string;accent:"sakura"|"aurora"|"amber";previewUrl:string|null;index:number;}) {
  const a = ACCENT[accent];
  return (
    <Link href={`/gallery/${category}`}
      className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-surface ring-1 ring-transparent transition-all duration-500 h-[420px] md:h-[480px] hover:-translate-y-2 hover:scale-[1.02] ${a.ring}`}
      style={{boxShadow:"0 4px 32px -8px rgba(0,0,0,0.5)"}}>
      <div className="absolute inset-0 overflow-hidden">
        {previewUrl ? (
          <Image src={previewUrl} alt={label} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.08]" priority={index===0}/>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-surface-2 via-surface to-void"/>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10"/>
      </div>
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-all duration-500"/>
      <div className="relative z-10 flex flex-col gap-3 p-6 pb-7">
        <span className={`w-fit rounded-full px-3 py-1 text-xs font-mono font-bold tracking-widest backdrop-blur-sm ${a.badge}`}>0{index+1}</span>
        <h3 className="font-display text-3xl font-black text-white leading-tight tracking-tight" style={{textShadow:"0 2px 20px rgba(0,0,0,0.8)"}}>{label}</h3>
        <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${a.text}`}>
          Browse gallery
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
            <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </Link>
  );
}
