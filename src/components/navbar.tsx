"use client";

import { useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FileText, GraduationCap, Menu, X, Settings } from "lucide-react";

const navItems = [
  { label: "Blog",       href: "/blog",      icon: BookOpen },
  { label: "Docs",       href: "/docs",      icon: FileText },
  { label: "Tutoriels",  href: "/tutorials", icon: GraduationCap },
];

export function SiteNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.06]" />

      <div className="relative max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <NextLink href="/" className="flex items-center gap-2.5 group">
          <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center shadow-[0_0_12px_rgba(255,255,255,0.2)]">
            <span className="text-[#0a0a0f] font-black text-[11px] tracking-tighter">K</span>
          </div>
          <span className="text-sm font-semibold text-zinc-100 tracking-tight">Karl</span>
        </NextLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <NextLink key={href} href={href}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm transition-all duration-150 ${
                  active
                    ? "text-zinc-100 bg-white/[0.08]"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05]"
                }`}>
                <Icon size={13} strokeWidth={1.75} />
                {label}
              </NextLink>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-1">
          <NextLink href="/admin"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-zinc-700 hover:text-zinc-400 hover:bg-white/[0.04] transition-all">
            <Settings size={12} strokeWidth={1.75} />
            Admin
          </NextLink>
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05] transition-all"
            onClick={() => setOpen(!open)}
            aria-label="Menu">
            {open ? <X size={16} strokeWidth={1.75} /> : <Menu size={16} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden relative border-t border-white/[0.06] bg-[#0a0a0f]/95 px-4 py-3 space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <NextLink key={href} href={href} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-colors ${
                pathname.startsWith(href) ? "text-zinc-100 bg-white/[0.07]" : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`}>
              <Icon size={15} strokeWidth={1.75} />
              {label}
            </NextLink>
          ))}
          <NextLink href="/admin" onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-3 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
            <Settings size={13} strokeWidth={1.75} />
            Admin
          </NextLink>
        </div>
      )}
    </header>
  );
}
