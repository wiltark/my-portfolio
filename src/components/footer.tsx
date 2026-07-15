import NextLink from "next/link";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-white/[0.07]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 rounded bg-lime-300 flex items-center justify-center">
            <span className="text-zinc-950 font-bold text-[10px]">K</span>
          </span>
          <span className="text-xs text-zinc-600 tracking-tight">
            © {new Date().getFullYear()} Karl. Tous droits réservés.
          </span>
        </div>
        <nav className="flex items-center gap-6">
          {[
            { href: "/blog", label: "Blog" },
            { href: "/docs", label: "Docs" },
            { href: "/tutorials", label: "Tutoriels" },
          ].map(({ href, label }) => (
            <NextLink key={href} href={href}
              className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors duration-200">
              {label}
            </NextLink>
          ))}
        </nav>
      </div>
    </footer>
  );
}
