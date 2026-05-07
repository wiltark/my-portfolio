"use client";

import NextLink from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";

interface Tutorial {
  id: string; title: string; slug: string; excerpt: string | null;
  tags: string; difficulty: string; duration: number | null;
}

const DIFF_STYLE: Record<string, { pill: string; bar: string; label: string }> = {
  beginner:     { pill: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20", bar: "bg-emerald-500", label: "Débutant" },
  intermediate: { pill: "text-amber-300   bg-amber-500/10   border-amber-500/20",   bar: "bg-amber-500",   label: "Intermédiaire" },
  advanced:     { pill: "text-red-300     bg-red-500/10     border-red-500/20",     bar: "bg-red-500",     label: "Avancé" },
};
const FALLBACK = { pill: "text-zinc-400 bg-white/[0.04] border-white/[0.07]", bar: "bg-zinc-500", label: "?" };

const CARD_GRADIENTS = [
  "from-indigo-600/15 to-purple-600/5",
  "from-emerald-600/15 to-teal-600/5",
  "from-rose-600/15 to-orange-600/5",
  "from-sky-600/15 to-blue-600/5",
  "from-violet-600/15 to-pink-600/5",
  "from-amber-600/15 to-yellow-600/5",
];

export function TutorialsList({ tutorials }: { tutorials: Tutorial[] }) {
  if (tutorials.length === 0) {
    return (
      <div className="py-32 text-center">
        <p className="text-zinc-600 text-sm">Aucun tutoriel disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tutorials.map((tuto, i) => {
        const tags: string[] = JSON.parse(tuto.tags || "[]");
        const d = DIFF_STYLE[tuto.difficulty] ?? FALLBACK;
        const gradient = CARD_GRADIENTS[i % CARD_GRADIENTS.length];

        return (
          <NextLink key={tuto.id} href={`/tutorials/${tuto.slug}`}
            className="group relative block overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">

            {/* Gradient header */}
            <div className={`h-24 w-full bg-gradient-to-br ${gradient} relative`}>
              <div className="absolute inset-0 opacity-15"
                style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
              {/* Difficulty bar accent */}
              <div className={`absolute bottom-0 left-0 h-0.5 w-full ${d.bar} opacity-50`} />
            </div>

            <div className="p-5">
              {/* Meta row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${d.pill}`}>
                    {d.label}
                  </span>
                  {tuto.duration && (
                    <span className="flex items-center gap-1 text-[11px] text-zinc-600">
                      <Clock size={10} strokeWidth={1.75} />
                      {tuto.duration} min
                    </span>
                  )}
                </div>
                <ArrowUpRight size={14} strokeWidth={1.75} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
              </div>

              <h2 className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors mb-2 tracking-tight leading-snug">
                {tuto.title}
              </h2>
              {tuto.excerpt && (
                <p className="text-zinc-500 text-xs leading-relaxed mb-4 line-clamp-2">{tuto.excerpt}</p>
              )}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] font-medium text-zinc-600 bg-white/[0.03] border border-white/[0.05] px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </NextLink>
        );
      })}
    </div>
  );
}
