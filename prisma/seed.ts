import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.profile.upsert({
    where: { id: "main" },
    create: {
      id: "main",
      name: "Karl",
      title: "Développeur Full Stack & Bot Creator",
      bio: "Passionné par le développement web, la création d'outils innovants et l'open source. Fondateur d'AlfyCore.",
      longBio: "Je suis Karl, développeur full stack basé à Paris. Je crée des applications web, des frameworks Node.js et des bots Discord. Toujours à la recherche de nouveaux défis techniques.",
      location: "Paris, France",
      email: "contact@karl.dev",
      github: "wiltark",
      avatar: "https://avatars.githubusercontent.com/u/78685616",
    },
    update: {},
  });

  const skillsData = [
    { name: "TypeScript", level: 90, category: "Languages", order: 1 },
    { name: "JavaScript", level: 95, category: "Languages", order: 2 },
    { name: "Python", level: 70, category: "Languages", order: 3 },
    { name: "Next.js", level: 85, category: "Frontend", order: 1 },
    { name: "React", level: 88, category: "Frontend", order: 2 },
    { name: "Tailwind CSS", level: 92, category: "Frontend", order: 3 },
    { name: "Node.js", level: 90, category: "Backend", order: 1 },
    { name: "Prisma", level: 80, category: "Backend", order: 2 },
    { name: "MySQL", level: 75, category: "Backend", order: 3 },
    { name: "Discord.js", level: 95, category: "Backend", order: 4 },
    { name: "Git", level: 88, category: "Outils", order: 1 },
    { name: "Docker", level: 65, category: "Outils", order: 2 },
  ];

  for (const skill of skillsData) {
    await prisma.skill.create({ data: skill }).catch(() => {});
  }

  await prisma.project.create({
    data: {
      title: "Veko.js",
      description: "Framework Node.js léger et performant pour créer des applications web rapidement.",
      tags: JSON.stringify(["Node.js", "TypeScript", "Framework"]),
      github: "https://github.com/wiltark/veko.js",
      featured: true,
      published: true,
      order: 1,
    },
  }).catch(() => {});

  await prisma.project.create({
    data: {
      title: "CosmoChat",
      description: "Alternative moderne à Discord avec des fonctionnalités avancées de communication.",
      tags: JSON.stringify(["React", "Node.js", "WebSocket", "TypeScript"]),
      featured: true,
      published: true,
      order: 2,
    },
  }).catch(() => {});

  await prisma.project.create({
    data: {
      title: "GLaDOS",
      description: "Bot Discord multifonction pour la gestion de serveurs et l'automatisation.",
      tags: JSON.stringify(["Discord.js", "TypeScript", "Bot"]),
      github: "https://github.com/wiltark/glados",
      published: true,
      order: 3,
    },
  }).catch(() => {});

  console.log("✅ Seed completed!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
