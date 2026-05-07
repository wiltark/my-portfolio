import { prisma } from "@/lib/prisma";
import { SiteNavbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TutorialsSidebar } from "@/components/tutorials-sidebar";

async function getSidebarData() {
  try {
    const tutorials = await prisma.tutorial.findMany({
      where: { published: true },
      orderBy: [{ difficulty: "asc" }, { createdAt: "asc" }],
      select: { id: true, title: true, slug: true, difficulty: true },
    });
    return { tutorials };
  } catch {
    return { tutorials: [] };
  }
}

export default async function TutorialsLayout({ children }: { children: React.ReactNode }) {
  const { tutorials } = await getSidebarData();

  return (
    <div className="min-h-screen">
      <SiteNavbar />

      {/* Ambient glow */}
      <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "600px",
          background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.032) 0%, transparent 65%)",
        }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-24 flex gap-10 items-start">
        <TutorialsSidebar tutorials={tutorials} />
        <main className="flex-1 min-w-0 pt-6">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
