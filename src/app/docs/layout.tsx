import { prisma } from "@/lib/prisma";
import { SiteNavbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DocsSidebar } from "@/components/docs-sidebar";

async function getSidebarData() {
  try {
    const [categories, uncategorized] = await Promise.all([
      prisma.docCategory.findMany({
        orderBy: { order: "asc" },
        include: {
          pages: {
            where: { published: true },
            orderBy: { order: "asc" },
            select: { id: true, title: true, slug: true },
          },
        },
      }),
      prisma.docPage.findMany({
        where: { published: true, categoryId: null },
        orderBy: { order: "asc" },
        select: { id: true, title: true, slug: true },
      }),
    ]);
    return { categories, uncategorized };
  } catch {
    return { categories: [], uncategorized: [] };
  }
}

export default async function DocsLayout({ children }: { children: React.ReactNode }) {
  const { categories, uncategorized } = await getSidebarData();

  return (
    <div className="min-h-screen">
      <SiteNavbar />

      {/* Halo d'ambiance */}
      <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "600px",
          background: "radial-gradient(ellipse at 50% 0%, rgba(190,242,100,0.04) 0%, transparent 65%)",
        }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 md:px-6 pt-28 pb-8 flex gap-10 items-start">
        <DocsSidebar categories={categories} uncategorized={uncategorized} />
        <main className="flex-1 min-w-0 pt-6">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
