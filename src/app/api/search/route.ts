import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const type = searchParams.get("type") ?? "all";

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results: { id: string; title: string; excerpt: string; slug: string; type: string }[] = [];

  try {
    if (type === "all" || type === "blog") {
      const posts = await prisma.$queryRaw<
        { id: string; title: string; excerpt: string; slug: string }[]
      >`
        SELECT id, title, excerpt, slug
        FROM BlogPost
        WHERE published = true
          AND MATCH(title, excerpt, content) AGAINST(${q} IN BOOLEAN MODE)
        LIMIT 5
      `;
      results.push(...posts.map((p) => ({ ...p, type: "blog" as const })));
    }

    if (type === "all" || type === "doc") {
      const docs = await prisma.$queryRaw<
        { id: string; title: string; content: string; slug: string }[]
      >`
        SELECT id, title, LEFT(content, 200) as content, slug
        FROM DocPage
        WHERE published = true
          AND MATCH(title, content) AGAINST(${q} IN BOOLEAN MODE)
        LIMIT 5
      `;
      results.push(...docs.map((d) => ({ id: d.id, title: d.title, excerpt: d.content, slug: d.slug, type: "doc" as const })));
    }

    if (type === "all" || type === "tutorial") {
      const tutorials = await prisma.$queryRaw<
        { id: string; title: string; excerpt: string; slug: string }[]
      >`
        SELECT id, title, excerpt, slug
        FROM Tutorial
        WHERE published = true
          AND MATCH(title, excerpt, content) AGAINST(${q} IN BOOLEAN MODE)
        LIMIT 5
      `;
      results.push(...tutorials.map((t) => ({ ...t, type: "tutorial" as const })));
    }
  } catch {
    // Fallback to LIKE if FULLTEXT not available
    try {
      if (type === "all" || type === "blog") {
        const posts = await prisma.blogPost.findMany({
          where: { published: true, OR: [{ title: { contains: q } }, { excerpt: { contains: q } }] },
          select: { id: true, title: true, excerpt: true, slug: true },
          take: 5,
        });
        results.push(...posts.map((p) => ({ ...p, excerpt: p.excerpt ?? "", type: "blog" as const })));
      }
      if (type === "all" || type === "doc") {
        const docs = await prisma.docPage.findMany({
          where: { published: true, OR: [{ title: { contains: q } }, { content: { contains: q } }] },
          select: { id: true, title: true, content: true, slug: true },
          take: 5,
        });
        results.push(...docs.map((d) => ({ id: d.id, title: d.title, excerpt: (d.content ?? "").slice(0, 200), slug: d.slug, type: "doc" as const })));
      }
      if (type === "all" || type === "tutorial") {
        const tutos = await prisma.tutorial.findMany({
          where: { published: true, OR: [{ title: { contains: q } }, { excerpt: { contains: q } }] },
          select: { id: true, title: true, excerpt: true, slug: true },
          take: 5,
        });
        results.push(...tutos.map((t) => ({ ...t, excerpt: t.excerpt ?? "", type: "tutorial" as const })));
      }
    } catch { /* DB unreachable — return empty results */ }
  }

  return NextResponse.json({ results });
}
