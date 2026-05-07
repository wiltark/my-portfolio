"use client";

import NextLink from "next/link";
import { FileText, ChevronRight, Hash } from "lucide-react";

interface DocPageItem { id: string; title: string; slug: string; }
interface Category { id: string; name: string; slug: string; pages: DocPageItem[]; }
interface Props { categories: Category[]; uncategorized: DocPageItem[]; }

const CAT_GRADIENTS = [
  "from-indigo-600/15 to-purple-600/5",
  "from-emerald-600/15 to-teal-600/5",
  "from-sky-600/15 to-blue-600/5",
  "from-violet-600/15 to-pink-600/5",
  "from-rose-600/15 to-orange-600/5",
  "from-amber-600/15 to-yellow-600/5",
];

function CategoryCard({ label, pages, gradient }: { label: string; pages: DocPageItem[]; gradient: string }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] transition-all duration-300">
      {/* Color accent header */}
      <div className={`h-12 w-full bg-gradient-to-br ${gradient} relative flex items-center px-5`}>
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <Hash size={13} strokeWidth={2} className="text-white/40 relative mr-2 shrink-0" />
        <p className="text-xs font-semibold text-white/60 uppercase tracking-[0.14em] relative truncate">{label}</p>
      </div>

      <ul className="p-3 space-y-0.5">
        {pages.map((page) => (
          <li key={page.id}>
            <NextLink href={`/docs/${page.slug}`}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all duration-150 group/item">
              <FileText size={12} strokeWidth={1.75} className="text-zinc-700 group-hover/item:text-zinc-400 transition-colors shrink-0" />
              <span className="flex-1 truncate">{page.title}</span>
              <ChevronRight size={11} strokeWidth={2} className="text-zinc-800 group-hover/item:text-zinc-500 transition-colors shrink-0" />
            </NextLink>
          </li>
        ))}
        {pages.length === 0 && (
          <li className="px-3 py-4 text-xs text-zinc-700 text-center">Aucune page</li>
        )}
      </ul>
    </div>
  );
}

export function DocsIndex({ categories, uncategorized }: Props) {
  if (categories.length === 0 && uncategorized.length === 0) {
    return (
      <div className="py-32 text-center">
        <p className="text-zinc-600 text-sm">Aucune documentation disponible pour le moment.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat, i) => (
        <CategoryCard
          key={cat.id}
          label={cat.name}
          pages={cat.pages}
          gradient={CAT_GRADIENTS[i % CAT_GRADIENTS.length]}
        />
      ))}
      {uncategorized.length > 0 && (
        <CategoryCard
          label="Général"
          pages={uncategorized}
          gradient={CAT_GRADIENTS[categories.length % CAT_GRADIENTS.length]}
        />
      )}
    </div>
  );
}
