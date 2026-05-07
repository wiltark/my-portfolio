import { prisma } from "@/lib/prisma";
import { SiteNavbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { notFound } from "next/navigation";
import NextLink from "next/link";
import { ArrowLeft, Calendar, Tag as TagIcon, Clock, BookOpen } from "lucide-react";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  return post ? { title: post.title, description: post.excerpt ?? undefined } : { title: "Introuvable" };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  let post: Awaited<ReturnType<typeof prisma.blogPost.findUnique>> = null;
  try {
    post = await prisma.blogPost.findUnique({ where: { slug, published: true } });
  } catch { notFound(); }
  if (!post) notFound();

  const tags: string[] = JSON.parse(post.tags || "[]");
  const words   = (post.content ?? "").split(/\s+/).length;
  const readMin = Math.max(1, Math.round(words / 200));

  return (
    <div className="min-h-screen">
      <SiteNavbar />

      <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "500px",
          background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.025) 0%, transparent 65%)",
        }} />
      </div>

      <main className="relative max-w-3xl mx-auto px-6 pt-32 pb-24">
        {/* Back */}
        <NextLink href="/blog"
          className="inline-flex items-center gap-2 text-xs text-zinc-600 hover:text-zinc-300 transition-colors mb-12 group">
          <ArrowLeft size={13} strokeWidth={1.75} className="group-hover:-translate-x-0.5 transition-transform" />
          <BookOpen size={12} strokeWidth={1.75} />
          Retour aux articles
        </NextLink>

        {/* Header */}
        <header className="mb-12 animate-fade-up">
          {/* Meta row */}
          <div className="flex items-center gap-4 mb-5 flex-wrap">
            {post.publishedAt && (
              <span className="flex items-center gap-1.5 text-xs text-zinc-600">
                <Calendar size={11} strokeWidth={1.75} />
                {new Date(post.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-zinc-600">
              <Clock size={11} strokeWidth={1.75} />
              {readMin} min de lecture
            </span>
          </div>

          <h1 style={{
            background: "linear-gradient(160deg, #ffffff 20%, rgba(255,255,255,0.5) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontSize: "clamp(2rem, 5vw, 3.25rem)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
            marginBottom: "1rem",
          }}>
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-[#6b7280] text-lg leading-relaxed">{post.excerpt}</p>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-6">
              <TagIcon size={11} strokeWidth={1.75} className="text-zinc-700" />
              {tags.map((tag) => (
                <span key={tag} className="text-[11px] font-medium text-zinc-500 bg-white/[0.04] border border-white/[0.07] px-3 py-1.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-12" />

        <MarkdownRenderer content={post.content ?? ""} />
      </main>

      <Footer />
    </div>
  );
}
