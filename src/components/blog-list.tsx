"use client";

import NextLink from "next/link";
import { ArrowUpRight, Calendar } from "lucide-react";

interface Post {
  id: string; title: string; slug: string; excerpt: string | null;
  tags: string; publishedAt: Date | null;
}

const POST_GRADIENTS = [
  "from-indigo-600/20 to-purple-600/5",
  "from-emerald-600/20 to-teal-600/5",
  "from-rose-600/20 to-orange-600/5",
  "from-sky-600/20 to-blue-600/5",
  "from-violet-600/20 to-pink-600/5",
  "from-amber-600/20 to-yellow-600/5",
];

export function BlogList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="py-32 text-center">
        <p className="text-zinc-600 text-sm">Aucun article pour le moment.</p>
      </div>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <div className="space-y-4">
      {/* Featured post — full width */}
      {featured && (() => {
        const tags: string[] = JSON.parse(featured.tags || "[]");
        return (
          <NextLink href={`/blog/${featured.slug}`}
            className="group relative block overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <div className={`h-36 w-full bg-gradient-to-br ${POST_GRADIENTS[0]} relative`}>
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
              <span className="absolute top-4 left-6 text-[10px] font-semibold text-white/50 bg-white/8 border border-white/12 px-2.5 py-1 rounded-full tracking-wider uppercase">
                À la une
              </span>
            </div>
            <div className="p-7">
              <div className="flex items-start justify-between gap-6 mb-4">
                <h2 className="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors tracking-tight leading-snug">
                  {featured.title}
                </h2>
                <ArrowUpRight size={18} strokeWidth={1.75} className="text-zinc-700 group-hover:text-zinc-300 transition-colors shrink-0 mt-0.5" />
              </div>
              {featured.excerpt && (
                <p className="text-zinc-500 text-sm leading-relaxed mb-5 line-clamp-2">{featured.excerpt}</p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="text-[11px] font-medium text-zinc-500 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                {featured.publishedAt && (
                  <span className="flex items-center gap-1.5 text-[11px] text-zinc-600 shrink-0">
                    <Calendar size={10} strokeWidth={1.75} />
                    {new Date(featured.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                )}
              </div>
            </div>
          </NextLink>
        );
      })()}

      {/* Grid for the rest */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rest.map((post, i) => {
            const tags: string[] = JSON.parse(post.tags || "[]");
            const gradient = POST_GRADIENTS[(i + 1) % POST_GRADIENTS.length];
            return (
              <NextLink key={post.id} href={`/blog/${post.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                <div className={`h-24 w-full bg-gradient-to-br ${gradient} relative`}>
                  <div className="absolute inset-0 opacity-15"
                    style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors tracking-tight leading-snug">
                      {post.title}
                    </h2>
                    <ArrowUpRight size={14} strokeWidth={1.75} className="text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0" />
                  </div>
                  {post.excerpt && (
                    <p className="text-zinc-500 text-xs leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] font-medium text-zinc-600 bg-white/[0.03] border border-white/[0.05] px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {post.publishedAt && (
                      <span className="text-[10px] text-zinc-700">
                        {new Date(post.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                      </span>
                    )}
                  </div>
                </div>
              </NextLink>
            );
          })}
        </div>
      )}
    </div>
  );
}
