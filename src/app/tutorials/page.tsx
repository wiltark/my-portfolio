import { prisma } from "@/lib/prisma";
import { SearchInput } from "@/components/search-input";
import { TutorialsList } from "@/components/tutorials-list";
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

  return (
    <>
      <div className="mb-10 animate-fade-up">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter text-zinc-50">
          Guides pratiques.
        </h1>
        <p className="text-zinc-500 leading-relaxed mt-4 mb-6 max-w-md">
          Apprenez des concepts et techniques à travers des tutoriels pas à pas.
        </p>
        <div className="max-w-md">
          <SearchInput type="tutorial" placeholder="Rechercher un tutoriel..." />
        </div>
      </div>

      <div className="animate-fade-up delay-100">
        <TutorialsList tutorials={tutorials} />
      </div>
    </>
  );
}
