import { prisma } from "@/lib/prisma";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tuto = await prisma.tutorial.findUnique({ where: { slug } });
  return tuto ? { title: tuto.title, description: tuto.excerpt ?? undefined } : { title: "Introuvable" };
}

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
};

export default async function TutorialSlugPage({ params }: Props) {
  const { slug } = await params;
  let tuto: Awaited<ReturnType<typeof prisma.tutorial.findUnique>> = null;

  try {
    tuto = await prisma.tutorial.findUnique({ where: { slug, published: true } });
  } catch { notFound(); }
  if (!tuto) notFound();

  const tags: string[] = JSON.parse(tuto.tags || "[]");
  const difficulty = DIFFICULTY_LABEL[tuto.difficulty];
  const words = (tuto.content ?? "").split(/\s+/).length;
  const readMin = tuto.duration ?? Math.max(1, Math.round(words / 200));

  return (
    <>
      {/* Retour mobile */}
      <div className="lg:hidden mb-8">
        <NextLink href="/tutorials"
          className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-lime-300 transition-colors group">
          <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
          Tutoriels
        </NextLink>
      </div>

      {/* Barre de meta */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        {difficulty && (
          <span className="text-[11px] font-medium text-lime-300 border border-lime-300/25 px-3 py-1.5 rounded-full">
            {difficulty}
          </span>
        )}
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Clock size={12} />
          {readMin} min de lecture
        </span>
        {tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {tags.map((tag) => (
              <span key={tag} className="text-[10px] font-medium text-zinc-500 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter text-zinc-50 leading-[1.1] mb-4">
        {tuto.title}
      </h1>

      {tuto.excerpt && (
        <p className="text-zinc-400 leading-relaxed mb-8">{tuto.excerpt}</p>
      )}

      <div className="h-px w-full bg-white/[0.07] mb-10" />

      <MarkdownRenderer content={tuto.content ?? ""} />
    </>
  );
}
