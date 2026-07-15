import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.docPage.findUnique({ where: { slug } });
  return page ? { title: page.title } : { title: "Introuvable" };
}

export default async function DocSlugPage({ params }: Props) {
  const { slug } = await params;
  let page: Prisma.DocPageGetPayload<{ include: { category: true } }> | null = null;

  try {
    page = await prisma.docPage.findUnique({
      where: { slug, published: true },
      include: { category: true },
    });
  } catch { notFound(); }
  if (!page) notFound();

  const words = (page.content ?? "").split(/\s+/).length;
  const readMin = Math.max(1, Math.round(words / 200));

  return (
    <>
      {/* Retour mobile */}
      <div className="lg:hidden mb-8">
        <NextLink href="/docs"
          className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-lime-300 transition-colors group">
          <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
          Documentation
        </NextLink>
      </div>

      {/* Fil d'Ariane + meta */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {page.category && (
          <>
            <span className="text-xs font-medium text-lime-300">{page.category.name}</span>
            <span className="text-zinc-700 text-xs">/</span>
          </>
        )}
        <span className="text-xs text-zinc-500 truncate max-w-xs">{page.title}</span>
        <span className="flex items-center gap-1.5 ml-auto text-[11px] text-zinc-600">
          <Clock size={11} />
          {readMin} min de lecture
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter text-zinc-50 leading-[1.1] mb-8">
        {page.title}
      </h1>

      <div className="h-px w-full bg-white/[0.07] mb-10" />

      <MarkdownRenderer content={page.content ?? ""} />
    </>
  );
}
