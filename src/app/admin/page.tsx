import { prisma } from "@/lib/prisma";
import NextLink from "next/link";
import { FolderOpen, FileText, BookMarked, GraduationCap, ArrowRight, User, Zap } from "lucide-react";

export default async function AdminDashboard() {
  let posts = 0, docs = 0, tutorials = 0, projects = 0;
  let pubPosts = 0, pubDocs = 0, pubTutorials = 0, pubProjects = 0;
  try {
    [posts, docs, tutorials, projects, pubPosts, pubDocs, pubTutorials, pubProjects] = await Promise.all([
      prisma.blogPost.count(),
      prisma.docPage.count(),
      prisma.tutorial.count(),
      prisma.project.count(),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.docPage.count({ where: { published: true } }),
      prisma.tutorial.count({ where: { published: true } }),
      prisma.project.count({ where: { published: true } }),
    ]);
  } catch { /* DB unreachable */ }

  const stats = [
    { label: "Projets",    total: projects,  pub: pubProjects,  icon: FolderOpen,   href: "/admin/projects",  color: "text-indigo-400",  bg: "bg-indigo-500/10",  border: "border-indigo-500/20"  },
    { label: "Articles",   total: posts,     pub: pubPosts,     icon: FileText,     href: "/admin/blog",      color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/20"  },
    { label: "Pages doc",  total: docs,      pub: pubDocs,      icon: BookMarked,   href: "/admin/docs",      color: "text-sky-400",     bg: "bg-sky-500/10",     border: "border-sky-500/20"     },
    { label: "Tutoriels",  total: tutorials, pub: pubTutorials, icon: GraduationCap, href: "/admin/tutorials", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  ];

  const quickActions = [
    { label: "Modifier le profil",   href: "/admin/profile",   icon: User,         desc: "Nom, bio, réseaux, photo" },
    { label: "Gérer les compétences",href: "/admin/skills",    icon: Zap,          desc: "Stack technique et niveaux" },
    { label: "Nouveau projet",       href: "/admin/projects",  icon: FolderOpen,   desc: "Ajouter un projet au portfolio" },
    { label: "Nouvel article",       href: "/admin/blog",      icon: FileText,     desc: "Rédiger un article de blog" },
    { label: "Nouvelle page doc",    href: "/admin/docs",      icon: BookMarked,   desc: "Ajouter une page de documentation" },
    { label: "Nouveau tutoriel",     href: "/admin/tutorials", icon: GraduationCap,desc: "Créer un guide pas à pas" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.16em] mb-2">Administration</p>
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Dashboard</h1>
        <p className="text-zinc-600 text-sm mt-1">Vue d&apos;ensemble de votre portfolio.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {stats.map(({ label, total, pub, icon: Icon, href, color, bg, border }) => (
          <NextLink key={label} href={href}
            className="group p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200">
            <div className={`w-9 h-9 rounded-xl ${bg} border ${border} flex items-center justify-center mb-4`}>
              <Icon size={16} strokeWidth={1.75} className={color} />
            </div>
            <p className="text-3xl font-bold text-zinc-100 tabular-nums tracking-tight">{total}</p>
            <p className="text-xs text-zinc-500 mt-1">{label}</p>
            <div className="mt-3">
              <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                <div className={`h-full rounded-full ${bg.replace("/10", "/60")}`}
                  style={{ width: total > 0 ? `${Math.round((pub / total) * 100)}%` : "0%" }} />
              </div>
              <p className="text-[10px] text-zinc-700 mt-1.5">{pub} / {total} publiés</p>
            </div>
          </NextLink>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.16em] mb-4">Accès rapide</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickActions.map(({ label, href, icon: Icon, desc }) => (
            <NextLink key={href} href={href}
              className="group flex items-center gap-4 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-200">
              <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.07] flex items-center justify-center shrink-0">
                <Icon size={14} strokeWidth={1.75} className="text-zinc-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{label}</p>
                <p className="text-xs text-zinc-600 truncate">{desc}</p>
              </div>
              <ArrowRight size={14} strokeWidth={1.75} className="text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0" />
            </NextLink>
          ))}
        </div>
      </div>
    </div>
  );
}
