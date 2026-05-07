"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@heroui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

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
      <Input
        value={query}
        onValueChange={setQuery}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        classNames={{
          input: "bg-transparent text-slate-200 placeholder:text-slate-500",
          inputWrapper:
            "bg-white/5 border-white/10 hover:border-white/20 focus-within:border-indigo-500",
        }}
        startContent={
          <span className="text-slate-500 text-sm">
            {loading ? "⏳" : "🔍"}
          </span>
        }
        onKeyDown={(e) => {
          if (e.key === "Enter" && query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}&type=${type}`);
            setOpen(false);
          }
        }}
      />

      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full z-50 glass rounded-xl overflow-hidden shadow-xl">
          {results.map((r) => (
            <NextLink
              key={r.id}
              href={typeHref(r)}
              className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
            >
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded mt-0.5 shrink-0">
                {typeLabel[r.type]}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-200">{r.title}</p>
                <p className="text-xs text-slate-500 line-clamp-1">{r.excerpt}</p>
              </div>
            </NextLink>
          ))}
        </div>
      )}

      {open && results.length === 0 && query.trim() && !loading && (
        <div className="absolute top-full mt-2 w-full z-50 glass rounded-xl px-4 py-3 text-sm text-slate-500">
          Aucun résultat pour &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
