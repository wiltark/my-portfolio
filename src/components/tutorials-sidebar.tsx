"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, SquaresFour, Notebook } from "@phosphor-icons/react";

interface Tutorial { id: string; title: string; slug: string; difficulty: string; }
interface Props { tutorials: Tutorial[]; }

const DIFF_LABEL: Record<string, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
};
const DIFF_ORDER = ["beginner", "intermediate", "advanced"];

function TutorialLink({ tutorial, active }: { tutorial: Tutorial; active: boolean }) {
  return (
    <NextLink href={`/tutorials/${tutorial.slug}`}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors duration-150 ${
        active
          ? "text-zinc-50 bg-white/[0.07] font-semibold"
          : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
      }`}>
      <Notebook size={13} className={`shrink-0 ${active ? "text-lime-300" : "text-zinc-700"}`} />
      <span className="truncate">{tutorial.title}</span>
    </NextLink>
  );
}

export function TutorialsSidebar({ tutorials }: Props) {
  const pathname = usePathname();
  const slug     = pathname.startsWith("/tutorials/") ? pathname.slice(11) : null;
  const isIndex  = pathname === "/tutorials";

  const grouped = DIFF_ORDER.reduce<Record<string, Tutorial[]>>((acc, d) => {
    acc[d] = tutorials.filter((t) => t.difficulty === d);
    return acc;
  }, {});
  const others = tutorials.filter((t) => !DIFF_ORDER.includes(t.difficulty));

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1"
      style={{ scrollbarWidth: "none" }}>

      {/* Header */}
      <div className="flex items-center gap-3 mb-5 px-1">
        <span className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
          <GraduationCap size={15} className="text-zinc-300" />
        </span>
        <div>
          <p className="text-xs font-semibold text-zinc-200 tracking-tight">Tutoriels</p>
          <p className="text-[10px] text-zinc-600">{tutorials.length} tutoriel{tutorials.length > 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Vue d'ensemble */}
      <NextLink href="/tutorials"
        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs mb-1 transition-colors duration-150 ${
          isIndex ? "text-zinc-50 bg-white/[0.07] font-semibold" : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
        }`}>
        <SquaresFour size={13} className={isIndex ? "text-lime-300" : "text-zinc-700"} />
        Tous les tutoriels
      </NextLink>

      <div className="h-px bg-white/[0.06] my-3" />

      {/* Groupes par difficulté */}
      <nav className="space-y-5">
        {DIFF_ORDER.map((diff) => {
          const items = grouped[diff];
          if (!items?.length) return null;
          return (
            <div key={diff}>
              <div className="flex items-center gap-2 mb-2 px-3">
                <span className="text-[11px] font-medium text-zinc-500">{DIFF_LABEL[diff]}</span>
                <span className="ml-auto text-[10px] text-zinc-700 tabular-nums">{items.length}</span>
              </div>
              <ul className="space-y-0.5">
                {items.map((t) => (
                  <li key={t.id}><TutorialLink tutorial={t} active={t.slug === slug} /></li>
                ))}
              </ul>
            </div>
          );
        })}

        {others.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2 px-3">
              <span className="text-[11px] font-medium text-zinc-500">Autre</span>
              <span className="ml-auto text-[10px] text-zinc-700 tabular-nums">{others.length}</span>
            </div>
            <ul className="space-y-0.5">
              {others.map((t) => (
                <li key={t.id}><TutorialLink tutorial={t} active={t.slug === slug} /></li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </aside>
  );
}
