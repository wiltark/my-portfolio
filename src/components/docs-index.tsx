import NextLink from "next/link";
import { FileText, CaretRight } from "@phosphor-icons/react/dist/ssr";

interface DocPageItem { id: string; title: string; slug: string; }
interface Category { id: string; name: string; slug: string; pages: DocPageItem[]; }
interface Props { categories: Category[]; uncategorized: DocPageItem[]; }

function CategoryCard({ label, pages }: { label: string; pages: DocPageItem[] }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] transition-colors duration-300">
      <div className="px-5 pt-5 pb-3 border-b border-white/[0.06]">
        <p className="text-sm font-semibold text-zinc-100 truncate">{label}</p>
        <p className="text-[11px] text-zinc-600 mt-0.5">
          {pages.length} page{pages.length > 1 ? "s" : ""}
        </p>
      </div>

      <ul className="p-3 space-y-0.5">
        {pages.map((page) => (
          <li key={page.id}>
            <NextLink href={`/docs/${page.slug}`}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-zinc-50 hover:bg-white/[0.05] transition-colors duration-150 group/item">
              <FileText size={14} className="text-zinc-600 group-hover/item:text-lime-300 transition-colors shrink-0" />
              <span className="flex-1 truncate">{page.title}</span>
              <CaretRight size={11} className="text-zinc-700 group-hover/item:text-zinc-400 transition-colors shrink-0" />
            </NextLink>
          </li>
        ))}
        {pages.length === 0 && (
          <li className="px-3 py-4 text-xs text-zinc-600 text-center">Aucune page</li>
        )}
      </ul>
    </div>
  );
}

export function DocsIndex({ categories, uncategorized }: Props) {
  if (categories.length === 0 && uncategorized.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] py-24 text-center">
        <p className="text-zinc-500 text-sm">Aucune documentation disponible pour le moment.</p>
        <p className="text-zinc-600 text-xs mt-2">Les prochaines pages apparaîtront ici.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {categories.map((cat) => (
        <CategoryCard key={cat.id} label={cat.name} pages={cat.pages} />
      ))}
      {uncategorized.length > 0 && (
        <CategoryCard label="Général" pages={uncategorized} />
      )}
    </div>
  );
}
