import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { SearchInput } from "@/components/search-input";
import { DocsIndex } from "@/components/docs-index";
import { BookMarked } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Documentation" };

export default async function DocsPage() {
  type CategoryWithPages = Prisma.DocCategoryGetPayload<{ include: { pages: { select: { id: true; title: true; slug: true } } } }>;
  type PageItem = { id: string; title: string; slug: string };
  let categories: CategoryWithPages[] = [];
  let uncategorized: PageItem[] = [];
  try {
    [categories, uncategorized] = await Promise.all([
      prisma.docCategory.findMany({
        orderBy: { order: "asc" },
        include: {
          pages: {
            where: { published: true },
            orderBy: { order: "asc" },
            select: { id: true, title: true, slug: true },
          },
        },
      }),
      prisma.docPage.findMany({
        where: { published: true, categoryId: null },
        orderBy: { order: "asc" },
        select: { id: true, title: true, slug: true },
      }),
    ]);
  } catch { /* DB unreachable */ }

  const total = categories.reduce((s, c) => s + c.pages.length, 0) + uncategorized.length;

  return (
    <>
      {/* Header */}
      <div className="mb-12 animate-fade-up">
        <div className="flex items-center gap-2 mb-4">
          <BookMarked size={14} strokeWidth={1.75} className="text-zinc-500" />
          <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.18em]">Documentation</p>
        </div>
        <h1 style={{
          background: "linear-gradient(160deg, #ffffff 20%, rgba(255,255,255,0.38) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          fontWeight: 800,
          letterSpacing: "-0.035em",
          lineHeight: 1.05,
        }}>
          Guides &amp; Références.
        </h1>
        <p className="text-[#6b7280] text-base leading-relaxed mt-3 mb-6 max-w-md">
          {total > 0
            ? `${total} page${total > 1 ? "s" : ""} de documentation — guides, références API et tutoriels techniques.`
            : "Documentation technique, guides d'utilisation et références API."}
        </p>

        {/* Search with icon */}
        <div className="flex items-center gap-2 max-w-md">
          <div className="flex-1">
            <SearchInput type="doc" placeholder="Rechercher dans la documentation..." />
          </div>
        </div>
      </div>

      {/* Stats row */}
      {total > 0 && (
        <div className="flex items-center gap-4 mb-8 animate-fade-up delay-100">
          {[
            { label: "Catégories",        value: categories.length },
            { label: "Pages",             value: total },
            { label: "Non catégorisées",  value: uncategorized.length },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <span className="text-lg font-bold text-zinc-200 tabular-nums">{value}</span>
              <span className="text-[11px] text-zinc-600">{label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="animate-fade-up delay-200">
        <DocsIndex categories={categories} uncategorized={uncategorized} />
      </div>
    </>
  );
}
