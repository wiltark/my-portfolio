"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { FileText, SquaresFour, BookOpen } from "@phosphor-icons/react";

interface DocPage     { id: string; title: string; slug: string; }
interface DocCategory { id: string; name: string; slug: string; pages: DocPage[]; }
interface Props { categories: DocCategory[]; uncategorized: DocPage[]; }

function PageLink({ page, active }: { page: DocPage; active: boolean }) {
  return (
    <NextLink href={`/docs/${page.slug}`}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors duration-150 ${
        active
          ? "text-zinc-50 bg-white/[0.07] font-semibold"
          : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
      }`}>
      <FileText size={13} className={`shrink-0 ${active ? "text-lime-300" : "text-zinc-700"}`} />
      <span className="truncate">{page.title}</span>
    </NextLink>
  );
}

export function DocsSidebar({ categories, uncategorized }: Props) {
  const pathname = usePathname();
  const slug     = pathname.startsWith("/docs/") ? pathname.slice(6) : null;
  const isIndex  = pathname === "/docs";

  const totalPages = categories.reduce((s, c) => s + c.pages.length, 0) + uncategorized.length;

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1"
      style={{ scrollbarWidth: "none" }}>

      {/* Header */}
      <div className="flex items-center gap-3 mb-5 px-1">
        <span className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
          <BookOpen size={15} className="text-zinc-300" />
        </span>
        <div>
          <p className="text-xs font-semibold text-zinc-200 tracking-tight">Documentation</p>
          <p className="text-[10px] text-zinc-600">{totalPages} page{totalPages > 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Vue d'ensemble */}
      <NextLink href="/docs"
        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs mb-1 transition-colors duration-150 ${
          isIndex ? "text-zinc-50 bg-white/[0.07] font-semibold" : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
        }`}>
        <SquaresFour size={13} className={isIndex ? "text-lime-300" : "text-zinc-700"} />
        Vue d&apos;ensemble
      </NextLink>

      <div className="h-px bg-white/[0.06] my-3" />

      {/* Catégories */}
      <nav className="space-y-5">
        {categories.map((cat) => (
          <div key={cat.id}>
            <div className="flex items-center gap-2 mb-2 px-3">
              <span className="text-[11px] font-medium text-zinc-500 truncate">{cat.name}</span>
              <span className="ml-auto text-[10px] text-zinc-700 tabular-nums">{cat.pages.length}</span>
            </div>
            <ul className="space-y-0.5">
              {cat.pages.map((p) => (
                <li key={p.id}><PageLink page={p} active={p.slug === slug} /></li>
              ))}
              {cat.pages.length === 0 && (
                <li className="px-3 py-2 text-[11px] text-zinc-700">Aucune page</li>
              )}
            </ul>
          </div>
        ))}

        {uncategorized.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2 px-3">
              <span className="text-[11px] font-medium text-zinc-500">Général</span>
              <span className="ml-auto text-[10px] text-zinc-700 tabular-nums">{uncategorized.length}</span>
            </div>
            <ul className="space-y-0.5">
              {uncategorized.map((p) => (
                <li key={p.id}><PageLink page={p} active={p.slug === slug} /></li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </aside>
  );
}
