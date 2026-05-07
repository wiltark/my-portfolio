import { prisma } from "@/lib/prisma";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, BarChart2, Tag as TagIcon } from "lucide-react";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tuto = await prisma.tutorial.findUnique({ where: { slug } });
  return tuto ? { title: tuto.title, description: tuto.excerpt ?? undefined } : { title: "Introuvable" };
}

const DIFF: Record<string, { label: string; pill: string; bar: string }> = {
  beginner:     { label: "Débutant",      pill: "text-emerald-300 bg-emerald-500/10 border-emerald-500/25", bar: "from-emerald-500/40 to-emerald-500/5" },
  intermediate: { label: "Intermédiaire", pill: "text-amber-300   bg-amber-500/10   border-amber-500/25",   bar: "from-amber-500/40   to-amber-500/5" },
  advanced:     { label: "Avancé",        pill: "text-red-300     bg-red-500/10     border-red-500/25",     bar: "from-red-500/40     to-red-500/5" },
};
const FALLBACK = { label: "?", pill: "text-zinc-400 bg-white/[0.04] border-white/[0.07]", bar: "from-zinc-500/30 to-zinc-500/5" };

export default async function TutorialSlugPage({ params }: Props) {
  const { slug } = await params;
  let tuto: Awaited<ReturnType<typeof prisma.tutorial.findUnique>> = null;

  try {
    tuto = await prisma.tutorial.findUnique({ where: { slug, published: true } });
  } catch { notFound(); }
  if (!tuto) notFound();

  const tags: string[] = JSON.parse(tuto.tags || "[]");
  const d = DIFF[tuto.difficulty] ?? FALLBACK;
  const words = (tuto.content ?? "").split(/\s+/).length;
  const readMin = tuto.duration ?? Math.max(1, Math.round(words / 200));

  return (
    <>
      {/* Mobile back */}
      <div className="lg:hidden mb-8">
        <NextLink href="/tutorials"
          className="inline-flex items-center gap-2 text-xs text-zinc-600 hover:text-zinc-300 transition-colors group">
          <ArrowLeft size={12} strokeWidth={1.75} className="group-hover:-translate-x-0.5 transition-transform" />
          Tutoriels
        </NextLink>
      </div>

      {/* Meta bar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border ${d.pill}`}>
          <BarChart2 size={10} strokeWidth={2} />
          {d.label}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-zinc-600">
          <Clock size={11} strokeWidth={1.75} />
          {readMin} min de lecture
        </span>
        {tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <TagIcon size={10} strokeWidth={1.75} className="text-zinc-700" />
            {tags.map((tag) => (
              <span key={tag} className="text-[10px] font-medium text-zinc-500 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Difficulty accent bar */}
      <div className={`h-0.5 w-24 rounded-full bg-gradient-to-r ${d.bar} mb-5`} />

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
        marginBottom: "1rem",
      }}>
        {tuto.title}
      </h1>

      {tuto.excerpt && (
        <p className="text-[#6b7280] text-base leading-relaxed mb-8">{tuto.excerpt}</p>
      )}

      {/* Gradient divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-10" />

      <MarkdownRenderer content={tuto.content ?? ""} />
    </>
  );
}
