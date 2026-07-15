"use client";

import { useState, useEffect, useRef } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { MagnifyingGlass, CircleNotch } from "@phosphor-icons/react";

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  type: "blog" | "doc" | "tutorial";
}

interface Props {
  type?: "blog" | "doc" | "tutorial" | "all";
  placeholder?: string;
}

export function SearchInput({ type = "all", placeholder = "Rechercher..." }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&type=${type}`
        );
        const data = await res.json();
        setResults(data.results ?? []);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [query, type]);

  const typeLabel: Record<string, string> = {
    blog: "Article",
    doc: "Doc",
    tutorial: "Tutoriel",
  };

  const typeHref = (r: SearchResult) => {
    if (r.type === "blog") return `/blog/${r.slug}`;
    if (r.type === "doc") return `/docs/${r.slug}`;
    return `/tutorials/${r.slug}`;
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2.5 px-4 h-11 rounded-full border border-white/[0.09] bg-white/[0.03] focus-within:border-lime-300/40 transition-colors duration-200">
        {loading
          ? <CircleNotch size={15} className="text-zinc-500 animate-spin shrink-0" />
          : <MagnifyingGlass size={15} className="text-zinc-500 shrink-0" />}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          className="flex-1 min-w-0 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) {
              router.push(`/search?q=${encodeURIComponent(query)}&type=${type}`);
              setOpen(false);
            }
          }}
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full z-50 rounded-2xl overflow-hidden border border-white/[0.09] bg-[#101012] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          {results.map((r) => (
            <NextLink
              key={r.id}
              href={typeHref(r)}
              className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors border-b border-white/[0.05] last:border-0"
            >
              <span className="text-[11px] font-medium text-lime-300 border border-lime-300/25 px-2 py-0.5 rounded-full mt-0.5 shrink-0">
                {typeLabel[r.type]}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-100 truncate">{r.title}</p>
                <p className="text-xs text-zinc-500 line-clamp-1">{r.excerpt}</p>
              </div>
            </NextLink>
          ))}
        </div>
      )}

      {open && results.length === 0 && query.trim() && !loading && (
        <div className="absolute top-full mt-2 w-full z-50 rounded-2xl border border-white/[0.09] bg-[#101012] px-4 py-3 text-sm text-zinc-500 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          Aucun résultat pour &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
