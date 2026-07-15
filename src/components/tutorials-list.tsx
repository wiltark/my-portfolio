import NextLink from "next/link";
import { ArrowUpRight, Clock } from "@phosphor-icons/react/dist/ssr";

interface Tutorial {
  id: string; title: string; slug: string; excerpt: string | null;
  tags: string; difficulty: string; duration: number | null;
}

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
};

const TILE = "rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-colors duration-300";

export function TutorialsList({ tutorials }: { tutorials: Tutorial[] }) {
  if (tutorials.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] py-24 text-center">
        <p className="text-zinc-500 text-sm">Aucun tutoriel disponible pour le moment.</p>
        <p className="text-zinc-600 text-xs mt-2">Les prochains guides apparaîtront ici.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {tutorials.map((tuto) => {
        const tags: string[] = JSON.parse(tuto.tags || "[]");
        const difficulty = DIFFICULTY_LABEL[tuto.difficulty];

        return (
          <NextLink key={tuto.id} href={`/tutorials/${tuto.slug}`} className={`group block p-6 ${TILE}`}>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                {difficulty && (
                  <span className="text-[11px] font-medium text-lime-300 border border-lime-300/25 px-2.5 py-1 rounded-full">
                    {difficulty}
                  </span>
                )}
                {tuto.duration && (
                  <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                    <Clock size={12} />
                    {tuto.duration} min
                  </span>
                )}
              </div>
              <ArrowUpRight size={15} className="text-zinc-700 group-hover:text-lime-300 transition-colors shrink-0" />
            </div>

            <h2 className="text-base font-semibold text-zinc-100 group-hover:text-zinc-50 transition-colors mb-2 tracking-tight leading-snug">
              {tuto.title}
            </h2>
            {tuto.excerpt && (
              <p className="text-zinc-500 text-sm leading-relaxed mb-4 line-clamp-2">{tuto.excerpt}</p>
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] font-medium text-zinc-500 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </NextLink>
        );
      })}
    </div>
  );
}
