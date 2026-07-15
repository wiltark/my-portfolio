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

  const blogPostsData = [
    {
      title: "Pourquoi j'ai créé Veko.js",
      slug: "pourquoi-jai-cree-vekojs",
      excerpt: "Retour d'expérience sur la genèse d'un framework Node.js pensé pour la simplicité et la performance.",
      content: `# Pourquoi j'ai créé Veko.js\n\nAprès des années à construire des applications avec Express et d'autres frameworks, j'ai voulu quelque chose de plus léger et plus proche du DX moderne.\n\n## Les objectifs\n\n- Un routage simple et intuitif\n- Un rechargement à chaud performant\n- Une empreinte mémoire minimale\n\n## Ce que j'ai appris\n\nConstruire un framework de zéro apprend énormément sur les compromis entre flexibilité et simplicité.`,
      tags: JSON.stringify(["Node.js", "Framework", "Open Source"]),
      published: true,
      publishedAt: new Date("2026-01-10"),
    },
    {
      title: "Discord.js en 2026 : ce qui a changé",
      slug: "discordjs-en-2026",
      excerpt: "Un tour d'horizon des nouveautés de Discord.js et de leur impact sur GLaDOS.",
      content: `# Discord.js en 2026\n\nDiscord.js continue d'évoluer avec de nouvelles API pour les interactions et les composants.\n\n## Nouveautés notables\n\n1. Nouveaux composants d'interface\n2. Meilleure gestion du cache\n3. Support natif de TypeScript amélioré\n\nCes changements m'ont poussé à revoir une partie de l'architecture de GLaDOS.`,
      tags: JSON.stringify(["Discord.js", "Bot", "TypeScript"]),
      published: true,
      publishedAt: new Date("2026-03-22"),
    },
    {
      title: "Mon setup de développement",
      slug: "mon-setup-de-developpement",
      excerpt: "Les outils, extensions et raccourcis que j'utilise au quotidien pour coder efficacement.",
      content: `# Mon setup de développement\n\nUn aperçu rapide de mon environnement de travail.\n\n## Éditeur\n\nVS Code avec quelques extensions essentielles : ESLint, Prisma, GitLens.\n\n## Terminal\n\nJ'utilise un terminal customisé avec des alias pour accélérer mon workflow git et npm.`,
      tags: JSON.stringify(["Productivité", "Outils"]),
      published: true,
      publishedAt: new Date("2026-05-02"),
    },
  ];

  for (const post of blogPostsData) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      create: post,
      update: {},
    });
  }

  const docsData = [
    {
      category: { name: "Démarrage", slug: "demarrage", order: 1 },
      pages: [
        {
          title: "Introduction",
          slug: "introduction",
          order: 1,
          content: `# Introduction\n\nBienvenue dans la documentation. Ce guide vous aide à démarrer rapidement avec les outils présentés sur ce portfolio.`,
        },
        {
          title: "Installation",
          slug: "installation",
          order: 2,
          content: `# Installation\n\n\`\`\`bash\nnpm install\nnpm run db:push\nnpm run db:seed\n\`\`\`\n\nCes commandes installent les dépendances, synchronisent le schéma de base de données et injectent des données d'exemple.`,
        },
      ],
    },
    {
      category: { name: "Guides", slug: "guides", order: 2 },
      pages: [
        {
          title: "Configuration de la base de données",
          slug: "configuration-base-de-donnees",
          order: 1,
          content: `# Configuration de la base de données\n\nCe projet utilise Prisma avec MySQL. Le schéma se trouve dans \`prisma/schema.prisma\`.\n\n## Modifier le schéma\n\n1. Éditez \`schema.prisma\`\n2. Lancez \`npm run db:push\`\n3. Régénérez le client avec \`npm run db:generate\``,
        },
        {
          title: "Créer un bot Discord",
          slug: "creer-un-bot-discord",
          order: 2,
          content: `# Créer un bot Discord\n\nUn guide pas à pas pour créer votre premier bot avec Discord.js.\n\n## Étapes\n\n- Créer une application sur le portail développeur\n- Générer un token\n- Initialiser le client avec les intents nécessaires`,
        },
      ],
    },
  ];

  for (const { category, pages } of docsData) {
    const createdCategory = await prisma.docCategory.upsert({
      where: { slug: category.slug },
      create: category,
      update: {},
    });

    for (const page of pages) {
      await prisma.docPage.upsert({
        where: { slug: page.slug },
        create: { ...page, categoryId: createdCategory.id, published: true },
        update: {},
      });
    }
  }

  const tutorialsData = [
    {
      title: "Créer une API REST avec Next.js",
      slug: "creer-une-api-rest-avec-nextjs",
      excerpt: "Apprenez à construire une API REST complète avec les route handlers de Next.js.",
      content: `# Créer une API REST avec Next.js\n\nDans ce tutoriel, nous allons construire une API REST simple avec les route handlers de Next.js 15.\n\n## Étape 1 : Créer un route handler\n\n\`\`\`ts\nexport async function GET() {\n  return Response.json({ message: "Hello world" });\n}\n\`\`\`\n\n## Étape 2 : Connecter Prisma\n\nUtilisez Prisma Client pour interagir avec votre base de données depuis vos handlers.`,
      tags: JSON.stringify(["Next.js", "API", "TypeScript"]),
      difficulty: "beginner",
      duration: 20,
      published: true,
    },
    {
      title: "Construire un bot Discord de A à Z",
      slug: "construire-un-bot-discord-de-a-a-z",
      excerpt: "Un tutoriel complet pour créer, héberger et déployer votre premier bot Discord.",
      content: `# Construire un bot Discord de A à Z\n\n## Prérequis\n\n- Node.js 18+\n- Un compte Discord Developer\n\n## Étape 1 : Initialiser le projet\n\n\`\`\`bash\nnpm init -y\nnpm install discord.js\n\`\`\`\n\n## Étape 2 : Créer le client\n\n\`\`\`ts\nimport { Client, GatewayIntentBits } from "discord.js";\n\nconst client = new Client({ intents: [GatewayIntentBits.Guilds] });\nclient.login(process.env.TOKEN);\n\`\`\`\n\n## Étape 3 : Déployer\n\nHébergez votre bot sur un VPS ou un service comme Railway.`,
      tags: JSON.stringify(["Discord.js", "Node.js", "Bot"]),
      difficulty: "intermediate",
      duration: 45,
      published: true,
    },
    {
      title: "Optimiser les performances d'une app React",
      slug: "optimiser-les-performances-dune-app-react",
      excerpt: "Techniques avancées de mémoïsation, code splitting et profiling pour des applications React rapides.",
      content: `# Optimiser les performances d'une app React\n\n## Mémoïsation\n\nUtilisez \`useMemo\` et \`useCallback\` avec parcimonie, uniquement quand le profiling le justifie.\n\n## Code splitting\n\n\`\`\`ts\nconst LazyComponent = React.lazy(() => import("./HeavyComponent"));\n\`\`\`\n\n## Profiling\n\nUtilisez le React DevTools Profiler pour identifier les re-renders inutiles.`,
      tags: JSON.stringify(["React", "Performance"]),
      difficulty: "advanced",
      duration: 35,
      published: true,
    },
  ];

  for (const tutorial of tutorialsData) {
    await prisma.tutorial.upsert({
      where: { slug: tutorial.slug },
      create: tutorial,
      update: {},
    });
  }

  console.log("✅ Seed completed!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
