import { prisma } from "@/lib/prisma";
import { SearchInput } from "@/components/search-input";
import { TutorialsList } from "@/components/tutorials-list";
import { GraduationCap, Zap, Target, Flame } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tutoriels" };

export default async function TutorialsPage() {
  let tutorials: { id: string; title: string; slug: string; excerpt: string | null; tags: string; difficulty: string; duration: number | null }[] = [];
  try {
    tutorials = await prisma.tutorial.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, slug: true, excerpt: true, tags: true, difficulty: true, duration: true },
    });
  } catch { /* DB unreachable */ }

  const beginner     = tutorials.filter((t) => t.difficulty === "beginner").length;
  const intermediate = tutorials.filter((t) => t.difficulty === "intermediate").length;
  const advanced     = tutorials.filter((t) => t.difficulty === "advanced").length;

  return (
    <>
      {/* Header */}
      <div className="mb-12 animate-fade-up">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap size={14} strokeWidth={1.75} className="text-zinc-500" />
          <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.18em]">Tutoriels</p>
        </div>
        <h1 style={{
          background: "linear-gradient(160deg, #ffffff 20%, rgba(255,255,255,0.38) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          fontWeight: 800,
          letterSpacing: "-0.035em",
          lineHeight: 1.05,
        }}>
          Guides pratiques.
        </h1>
        <p className="text-[#6b7280] text-base leading-relaxed mt-3 mb-6 max-w-md">
          Apprenez des concepts et techniques à travers des tutoriels pas à pas.
        </p>
        <div className="max-w-md">
          <SearchInput type="tutorial" placeholder="Rechercher un tutoriel..." />
        </div>
      </div>

      {/* Difficulty stats */}
      {tutorials.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-8 animate-fade-up delay-100">
          {[
            { label: "Débutant",      value: beginner,     icon: Zap,    color: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20" },
            { label: "Intermédiaire", value: intermediate, icon: Target, color: "text-amber-300   bg-amber-500/10   border-amber-500/20" },
            { label: "Avancé",        value: advanced,     icon: Flame,  color: "text-red-300     bg-red-500/10     border-red-500/20" },
          ].map(({ label, value, icon: Icon, color }) => value > 0 ? (
            <div key={label} className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-medium ${color}`}>
              <Icon size={12} strokeWidth={2} />
              {value} {label}{value > 1 ? "s" : ""}
            </div>
          ) : null)}
        </div>
      )}

      <div className="animate-fade-up delay-200">
        <TutorialsList tutorials={tutorials} />
      </div>
    </>
  );
}
