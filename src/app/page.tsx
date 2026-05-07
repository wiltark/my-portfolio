import { prisma } from "@/lib/prisma";
import { SiteNavbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HomeContent } from "@/components/home-content";

async function getData() {
  try {
    const [profile, skills, projects] = await Promise.all([
      prisma.profile.findUnique({ where: { id: "main" } }),
      prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] }),
      prisma.project.findMany({
        where: { published: true },
        orderBy: [{ featured: "desc" }, { order: "asc" }],
        take: 6,
      }),
    ]);
    return { profile, skills, projects };
  } catch {
    return { profile: null, skills: [], projects: [] };
  }
}

export default async function HomePage() {
  const { profile, skills, projects } = await getData();
  return (
    <div className="min-h-screen">
      <SiteNavbar />
      <HomeContent profile={profile} skills={skills} projects={projects} />
      <Footer />
    </div>
  );
}
