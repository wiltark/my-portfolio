"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Hash, LayoutGrid, BookMarked, ChevronRight } from "lucide-react";

interface DocPage     { id: string; title: string; slug: string; }
interface DocCategory { id: string; name: string; slug: string; pages: DocPage[]; }
interface Props { categories: DocCategory[]; uncategorized: DocPage[]; }

const CAT_COLORS = [
  { icon: "text-indigo-400",  bg: "bg-indigo-400/10",   border: "border-indigo-400/20" },
  { icon: "text-emerald-400", bg: "bg-emerald-400/10",  border: "border-emerald-400/20" },
  { icon: "text-sky-400",     bg: "bg-sky-400/10",      border: "border-sky-400/20" },
  { icon: "text-violet-400",  bg: "bg-violet-400/10",   border: "border-violet-400/20" },
  { icon: "text-rose-400",    bg: "bg-rose-400/10",     border: "border-rose-400/20" },
  { icon: "text-amber-400",   bg: "bg-amber-400/10",    border: "border-amber-400/20" },
];

export function DocsSidebar({ categories, uncategorized }: Props) {
  const pathname  = usePathname();
  const slug      = pathname.startsWith("/docs/") ? pathname.slice(6) : null;
  const isIndex   = pathname === "/docs";

  const totalPages = categories.reduce((s, c) => s + c.pages.length, 0) + uncategorized.length;

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1"
      style={{ scrollbarWidth: "none" }}>

      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-5 px-1">
        <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
          <BookMarked size={14} strokeWidth={1.75} className="text-zinc-300" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-zinc-200 tracking-tight">Documentation</p>
          <p className="text-[10px] text-zinc-600">{totalPages} pages</p>
        </div>
      </div>

      {/* ── Overview ── */}
      <NextLink href="/docs"
        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs mb-1 transition-all duration-150 ${
          isIndex ? "text-white bg-white/[0.08] font-semibold" : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
        }`}>
        <LayoutGrid size={12} strokeWidth={1.75} className={isIndex ? "text-zinc-300" : "text-zinc-700"} />
        Vue d&apos;ensemble
        {isIndex && <ChevronRight size={10} strokeWidth={2} className="ml-auto text-zinc-500" />}
      </NextLink>

      <div className="h-px bg-white/[0.05] my-3" />

      {/* ── Categories ── */}
      <nav className="space-y-5">
        {categories.map((cat, ci) => {
          const c = CAT_COLORS[ci % CAT_COLORS.length];
          return (
            <div key={cat.id}>
              {/* Category header */}
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className={`w-5 h-5 rounded-md ${c.bg} border ${c.border} flex items-center justify-center`}>
                  <Hash size={10} strokeWidth={2.5} className={c.icon} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-[0.16em] ${c.icon}`}>
                  {cat.name}
                </span>
                <span className="ml-auto text-[10px] text-zinc-700 font-semibold tabular-nums">
                  {cat.pages.length}
                </span>
              </div>

              {/* Pages */}
              <ul className="space-y-0.5 pl-1">
                {cat.pages.map((p) => {
                  const active = p.slug === slug;
                  return (
                    <li key={p.id}>
                      <NextLink href={`/docs/${p.slug}`}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all duration-150 ${
                          active
                            ? "text-white bg-white/[0.09] font-semibold"
                            : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
                        }`}>
                        <FileText size={11} strokeWidth={1.75}
                          className={`shrink-0 transition-colors ${active ? c.icon : "text-zinc-700"}`} />
                        <span className="truncate">{p.title}</span>
                        {active && <span className={`ml-auto w-1.5 h-1.5 rounded-full shrink-0 ${c.icon.replace("text-", "bg-")}`} />}
                      </NextLink>
                    </li>
                  );
                })}
                {cat.pages.length === 0 && (
                  <li className="px-3 py-2 text-[11px] text-zinc-700 italic">Aucune page</li>
                )}
              </ul>
            </div>
          );
        })}

        {/* Uncategorized */}
        {uncategorized.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="w-5 h-5 rounded-md bg-zinc-800 border border-zinc-700/50 flex items-center justify-center">
                <Hash size={10} strokeWidth={2.5} className="text-zinc-500" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">Général</span>
              <span className="ml-auto text-[10px] text-zinc-700 font-semibold tabular-nums">{uncategorized.length}</span>
            </div>
            <ul className="space-y-0.5 pl-1">
              {uncategorized.map((p) => {
                const active = p.slug === slug;
                return (
                  <li key={p.id}>
                    <NextLink href={`/docs/${p.slug}`}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all duration-150 ${
                        active
                          ? "text-white bg-white/[0.09] font-semibold"
                          : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
                      }`}>
                      <FileText size={11} strokeWidth={1.75} className={`shrink-0 ${active ? "text-zinc-300" : "text-zinc-700"}`} />
                      <span className="truncate">{p.title}</span>
                      {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />}
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
