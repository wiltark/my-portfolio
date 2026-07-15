"use client";

import { useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Article, BookOpen, GraduationCap, List, X, GearSix } from "@phosphor-icons/react";

const navItems = [
  { label: "Blog",      href: "/blog",      icon: Article },
  { label: "Docs",      href: "/docs",      icon: BookOpen },
  { label: "Tutoriels", href: "/tutorials", icon: GraduationCap },
];

export function SiteNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="absolute inset-0 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.07]" />

      <div className="relative max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <NextLink href="/" className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-md bg-lime-300 flex items-center justify-center">
            <span className="text-zinc-950 font-bold text-[12px] tracking-tighter">K</span>
          </span>
          <span className="text-sm font-semibold text-zinc-100 tracking-tight">Karl</span>
        </NextLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <NextLink key={href} href={href}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm transition-colors duration-150 ${
                  active
                    ? "text-zinc-50 bg-white/[0.07]"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
                }`}>
                <Icon size={15} />
                {label}
              </NextLink>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-1">
          <NextLink href="/admin"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors">
            <GearSix size={13} />
            Admin
          </NextLink>
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05] transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Menu">
            {open ? <X size={18} /> : <List size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden relative border-t border-white/[0.07] bg-[#09090b]/95 px-4 py-3 space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <NextLink key={href} href={href} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-2xl text-sm transition-colors ${
                pathname.startsWith(href) ? "text-zinc-50 bg-white/[0.07]" : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`}>
              <Icon size={16} />
              {label}
            </NextLink>
          ))}
          <NextLink href="/admin" onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-3 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
            <GearSix size={14} />
            Admin
          </NextLink>
        </div>
      )}
    </header>
  );
}
