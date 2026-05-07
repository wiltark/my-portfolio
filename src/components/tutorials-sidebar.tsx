"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, BarChart2, LayoutGrid, ChevronRight } from "lucide-react";

interface Tutorial { id: string; title: string; slug: string; difficulty: string; }
interface Props { tutorials: Tutorial[]; }

const DIFF: Record<string, { label: string; dot: string; dotHex: string; icon: string; heading: string; bg: string; border: string }> = {
  beginner:     { label: "Débutant",      dot: "bg-emerald-400", dotHex: "#34d399", icon: "text-emerald-300", heading: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  intermediate: { label: "Intermédiaire", dot: "bg-amber-400",   dotHex: "#fbbf24", icon: "text-amber-300",   heading: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-400/20" },
  advanced:     { label: "Avancé",        dot: "bg-red-400",     dotHex: "#f87171", icon: "text-red-300",     heading: "text-red-400",     bg: "bg-red-400/10",     border: "border-red-400/20" },
};
const DIFF_ORDER = ["beginner", "intermediate", "advanced"];

export function TutorialsSidebar({ tutorials }: Props) {
  const pathname    = usePathname();
  const slug        = pathname.startsWith("/tutorials/") ? pathname.slice(11) : null;
  const isIndex     = pathname === "/tutorials";

  const grouped = DIFF_ORDER.reduce<Record<string, Tutorial[]>>((acc, d) => {
    acc[d] = tutorials.filter((t) => t.difficulty === d);
    return acc;
  }, {});
  const others = tutorials.filter((t) => !DIFF_ORDER.includes(t.difficulty));

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1"
      style={{ scrollbarWidth: "none" }}>

      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-5 px-1">
        <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
          <GraduationCap size={14} strokeWidth={1.75} className="text-zinc-300" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-zinc-200 tracking-tight">Tutoriels</p>
          <p className="text-[10px] text-zinc-600">{tutorials.length} tutoriels</p>
        </div>
      </div>

      {/* ── Overview ── */}
      <NextLink href="/tutorials"
        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs mb-1 transition-all duration-150 ${
          isIndex ? "text-white bg-white/[0.08] font-semibold" : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
        }`}>
        <LayoutGrid size={12} strokeWidth={1.75} className={isIndex ? "text-zinc-300" : "text-zinc-700"} />
        Tous les tutoriels
        {isIndex && <ChevronRight size={10} strokeWidth={2} className="ml-auto text-zinc-500" />}
      </NextLink>

      <div className="h-px bg-white/[0.05] my-3" />

      {/* ── Groups ── */}
      <nav className="space-y-5">
        {DIFF_ORDER.map((diff) => {
          const items = grouped[diff];
          if (!items?.length) return null;
          const cfg = DIFF[diff];
          return (
            <div key={diff}>
              {/* Difficulty header */}
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className={`w-5 h-5 rounded-md ${cfg.bg} border ${cfg.border} flex items-center justify-center`}>
                  <BarChart2 size={10} strokeWidth={2} className={cfg.heading} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-[0.16em] ${cfg.heading}`}>
                  {cfg.label}
                </span>
                <span className="ml-auto text-[10px] text-zinc-700 font-semibold tabular-nums">{items.length}</span>
              </div>

              {/* Tutorials */}
              <ul className="space-y-0.5 pl-1">
                {items.map((t) => {
                  const active = t.slug === slug;
                  return (
                    <li key={t.id}>
                      <NextLink href={`/tutorials/${t.slug}`}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all duration-150 ${
                          active
                            ? "text-white bg-white/[0.09] font-semibold"
                            : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
                        }`}>
                        <BarChart2 size={10} strokeWidth={1.75}
                          className={`shrink-0 ${active ? cfg.icon : "text-zinc-700"}`} />
                        <span className="truncate">{t.title}</span>
                        {active && <span className={`ml-auto w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />}
                      </NextLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {/* Others (unknown difficulty) */}
        {others.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="w-5 h-5 rounded-md bg-zinc-800 border border-zinc-700/50 flex items-center justify-center">
                <BarChart2 size={10} strokeWidth={2} className="text-zinc-500" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">Autre</span>
              <span className="ml-auto text-[10px] text-zinc-700 font-semibold tabular-nums">{others.length}</span>
            </div>
            <ul className="space-y-0.5 pl-1">
              {others.map((t) => {
                const active = t.slug === slug;
                return (
                  <li key={t.id}>
                    <NextLink href={`/tutorials/${t.slug}`}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all duration-150 ${
                        active
                          ? "text-white bg-white/[0.09] font-semibold"
                          : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
                      }`}>
                      <span className="truncate">{t.title}</span>
                    </NextLink>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>
    </aside>
  );
}
