import { prisma } from "@/lib/prisma";
import { SiteNavbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlogList } from "@/components/blog-list";
import { BookOpen, PenLine, Rss } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blog" };

export default async function BlogPage() {
  let posts: { id: string; title: string; slug: string; excerpt: string | null; tags: string; publishedAt: Date | null; }[] = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      select: { id: true, title: true, slug: true, excerpt: true, tags: true, publishedAt: true },
    });
  } catch { /* DB unreachable */ }

  return (
    <div className="min-h-screen">
      <SiteNavbar />

      <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "600px",
          background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.032) 0%, transparent 65%)",
        }} />
      </div>

      <main className="relative max-w-5xl mx-auto px-6 pt-36 pb-24">
        <div className="mb-16 animate-fade-up">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={14} strokeWidth={1.75} className="text-zinc-500" />
            <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.18em]">Blog</p>
          </div>

          <h1 style={{
            background: "linear-gradient(160deg, #ffffff 20%, rgba(255,255,255,0.38) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontSize: "clamp(3rem, 7vw, 5.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1.05,
          }}>
            Articles.
          </h1>
          <p className="text-[#6b7280] text-base leading-relaxed mt-4 max-w-md">
            Réflexions, retours d&apos;expérience et découvertes techniques.
          </p>

          {/* Stats row */}
          {posts.length > 0 && (
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <PenLine size={12} strokeWidth={1.75} className="text-zinc-500" />
                <span className="text-sm font-bold text-zinc-200 tabular-nums">{posts.length}</span>
                <span className="text-[11px] text-zinc-600">article{posts.length > 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <Rss size={12} strokeWidth={1.75} className="text-zinc-500" />
                <span className="text-[11px] text-zinc-600">Mis à jour régulièrement</span>
              </div>
            </div>
          )}
        </div>

        <div className="animate-fade-up delay-100">
          <BlogList posts={posts} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
