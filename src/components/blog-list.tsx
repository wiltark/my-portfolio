import NextLink from "next/link";
import { ArrowUpRight, CalendarBlank } from "@phosphor-icons/react/dist/ssr";

interface Post {
  id: string; title: string; slug: string; excerpt: string | null;
  tags: string; publishedAt: Date | null;
}

const TILE = "rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-colors duration-300";

function formatDate(date: Date, long = false) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    ...(long ? { year: "numeric" } : {}),
  });
}

export function BlogList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] py-24 text-center">
        <p className="text-zinc-500 text-sm">Aucun article pour le moment.</p>
        <p className="text-zinc-600 text-xs mt-2">Les prochains articles apparaîtront ici.</p>
      </div>
    );
  }

  const [featured, ...rest] = posts;
  const featuredTags: string[] = JSON.parse(featured.tags || "[]");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Article à la une : grande tuile accent */}
      <NextLink
        href={`/blog/${featured.slug}`}
        className="group relative block overflow-hidden md:col-span-2 rounded-2xl border border-lime-300/20 bg-lime-300/[0.04] hover:bg-lime-300/[0.07] transition-colors duration-300 p-8"
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        />
        <div className="relative">
          <div className="flex items-start justify-between gap-6 mb-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-zinc-50 tracking-tight leading-snug">
              {featured.title}
            </h2>
            <ArrowUpRight size={20} className="text-zinc-600 group-hover:text-lime-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0 mt-1" />
          </div>
          {featured.excerpt && (
            <p className="text-zinc-400 leading-relaxed mb-6 max-w-2xl line-clamp-2">{featured.excerpt}</p>
          )}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {featuredTags.slice(0, 4).map((tag) => (
                <span key={tag} className="text-[11px] font-medium text-zinc-400 bg-white/[0.04] border border-white/[0.07] px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            {featured.publishedAt && (
              <span className="flex items-center gap-1.5 text-xs text-zinc-500 shrink-0">
                <CalendarBlank size={12} />
                {formatDate(featured.publishedAt, true)}
              </span>
            )}
          </div>
        </div>
      </NextLink>

      {/* Le reste en tuiles neutres */}
      {rest.map((post) => {
        const tags: string[] = JSON.parse(post.tags || "[]");
        return (
          <NextLink key={post.id} href={`/blog/${post.slug}`} className={`group block p-6 ${TILE}`}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2 className="text-base font-semibold text-zinc-100 group-hover:text-zinc-50 transition-colors tracking-tight leading-snug">
                {post.title}
              </h2>
              <ArrowUpRight size={15} className="text-zinc-700 group-hover:text-lime-300 transition-colors shrink-0 mt-0.5" />
            </div>
            {post.excerpt && (
              <p className="text-zinc-500 text-sm leading-relaxed mb-5 line-clamp-2">{post.excerpt}</p>
            )}
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-[10px] font-medium text-zinc-500 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              {post.publishedAt && (
                <span className="text-[11px] text-zinc-600 shrink-0">{formatDate(post.publishedAt)}</span>
              )}
            </div>
          </NextLink>
        );
      })}
    </div>
  );
}
