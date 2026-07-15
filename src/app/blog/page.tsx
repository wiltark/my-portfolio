import { prisma } from "@/lib/prisma";
import { SiteNavbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlogList } from "@/components/blog-list";
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

      <main className="relative max-w-6xl mx-auto px-4 md:px-6 pt-32 pb-8">
        <div className="mb-12 animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter text-zinc-50">
            Articles.
          </h1>
          <p className="text-zinc-500 leading-relaxed mt-4 max-w-md">
            Réflexions, retours d&apos;expérience et découvertes techniques.
          </p>
        </div>

        <div className="animate-fade-up delay-100">
          <BlogList posts={posts} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
