import { prisma } from "@/lib/prisma";
import { SiteNavbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { notFound } from "next/navigation";
import NextLink from "next/link";
import { ArrowLeft, CalendarBlank, Clock } from "@phosphor-icons/react/dist/ssr";
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

      <main className="relative max-w-3xl mx-auto px-4 md:px-6 pt-32 pb-8">
        {/* Retour */}
        <NextLink href="/blog"
          className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-lime-300 transition-colors mb-12 group">
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
          Retour aux articles
        </NextLink>

        {/* En-tête */}
        <header className="mb-12 animate-fade-up">
          <div className="flex items-center gap-4 mb-5 flex-wrap">
            {post.publishedAt && (
              <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                <CalendarBlank size={12} />
                {new Date(post.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Clock size={12} />
              {readMin} min de lecture
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-semibold tracking-tighter text-zinc-50 leading-[1.1] mb-4">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-zinc-400 text-lg leading-relaxed">{post.excerpt}</p>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-6">
              {tags.map((tag) => (
                <span key={tag} className="text-[11px] font-medium text-zinc-400 bg-white/[0.04] border border-white/[0.07] px-3 py-1.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="h-px w-full bg-white/[0.07] mb-12" />

        <MarkdownRenderer content={post.content ?? ""} />
      </main>

      <Footer />
    </div>
  );
}
