"use client";

import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, User, Zap, FolderOpen, FileText,
  BookMarked, GraduationCap, LogOut, ExternalLink, ChevronRight,
} from "lucide-react";

const NAV = [
  { label: "Dashboard",   href: "/admin",           icon: LayoutDashboard },
  { label: "Profil",      href: "/admin/profile",   icon: User },
  { label: "Compétences", href: "/admin/skills",    icon: Zap },
  { label: "Projets",     href: "/admin/projects",  icon: FolderOpen },
  { label: "Blog",        href: "/admin/blog",      icon: FileText },
  { label: "Docs",        href: "/admin/docs",      icon: BookMarked },
  { label: "Tutoriels",   href: "/admin/tutorials", icon: GraduationCap },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-[#0a0a0f]">

      {/* ── Sidebar ─────────────────────────────── */}
      <aside className="w-56 shrink-0 border-r border-white/[0.06] flex flex-col">

        {/* Brand */}
        <div className="px-4 py-5 border-b border-white/[0.06]">
          <NextLink href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              <span className="text-[#0a0a0f] font-black text-[11px]">K</span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-100 leading-none tracking-tight">Portfolio</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">Administration</p>
            </div>
          </NextLink>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <NextLink key={href} href={href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all duration-150 ${
                  active
                    ? "bg-white/[0.09] text-white font-semibold"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
                }`}>
                <Icon size={13} strokeWidth={active ? 2.25 : 1.75}
                  className={active ? "text-white" : "text-zinc-600"} />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight size={10} strokeWidth={2} className="text-zinc-600" />}
              </NextLink>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-white/[0.06] space-y-0.5">
          <NextLink href="/" target="_blank"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04] transition-all">
            <ExternalLink size={12} strokeWidth={1.75} />
            Voir le site
          </NextLink>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-zinc-600 hover:text-red-400 hover:bg-red-500/[0.06] transition-all text-left">
            <LogOut size={12} strokeWidth={1.75} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-4xl">
          {children}
        </div>
      </main>
    </div>
  );
}
