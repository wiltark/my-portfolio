import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { SearchInput } from "@/components/search-input";
import { DocsIndex } from "@/components/docs-index";
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
      <div className="mb-10 animate-fade-up">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter text-zinc-50">
          Guides &amp; Références.
        </h1>
        <p className="text-zinc-500 leading-relaxed mt-4 mb-6 max-w-md">
          {total > 0
            ? `${total} page${total > 1 ? "s" : ""} de documentation : guides, références API et notes techniques.`
            : "Documentation technique, guides d'utilisation et références API."}
        </p>
        <div className="max-w-md">
          <SearchInput type="doc" placeholder="Rechercher dans la documentation..." />
        </div>
      </div>

      <div className="animate-fade-up delay-100">
        <DocsIndex categories={categories} uncategorized={uncategorized} />
      </div>
    </>
  );
}
