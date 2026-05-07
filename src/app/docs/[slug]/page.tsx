import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Hash, FileText, Clock } from "lucide-react";
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

  // Estimate reading time
  const words = (page.content ?? "").split(/\s+/).length;
  const readMin = Math.max(1, Math.round(words / 200));

  return (
    <>
      {/* Mobile back */}
      <div className="lg:hidden mb-8">
        <NextLink href="/docs"
          className="inline-flex items-center gap-2 text-xs text-zinc-600 hover:text-zinc-300 transition-colors group">
          <ArrowLeft size={12} strokeWidth={1.75} className="group-hover:-translate-x-0.5 transition-transform" />
          Documentation
        </NextLink>
      </div>

      {/* Breadcrumb + meta */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {page.category && (
          <>
            <div className="flex items-center gap-1.5">
              <Hash size={11} strokeWidth={2} className="text-indigo-400" />
              <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-[0.14em]">
                {page.category.name}
              </span>
            </div>
            <span className="text-zinc-700 text-xs">/</span>
          </>
        )}
        <div className="flex items-center gap-1.5">
          <FileText size={11} strokeWidth={1.75} className="text-zinc-600" />
          <span className="text-[11px] text-zinc-600 truncate max-w-xs">{page.title}</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <Clock size={10} strokeWidth={1.75} className="text-zinc-700" />
          <span className="text-[10px] text-zinc-700">{readMin} min de lecture</span>
        </div>
      </div>

      {/* Title */}
      <h1 style={{
        background: "linear-gradient(160deg, #ffffff 20%, rgba(255,255,255,0.5) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
        fontWeight: 800,
        letterSpacing: "-0.035em",
        lineHeight: 1.1,
        marginBottom: "2rem",
      }}>
        {page.title}
      </h1>

      {/* Gradient divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-10" />

      <MarkdownRenderer content={page.content ?? ""} />
    </>
  );
}
