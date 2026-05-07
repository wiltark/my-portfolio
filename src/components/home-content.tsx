"use client";

import NextLink from "next/link";
import { Mail, MapPin, ArrowRight, ExternalLink, BookOpen, GraduationCap, FileText } from "lucide-react";

/* ── Social icons ───────────────────────────────────────────── */
function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
function XIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function LinkedinIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* ── Types ──────────────────────────────────────────────────── */
interface Skill { id: string; name: string; level: number; category: string; order: number; }
interface Project {
  id: string; title: string; description: string | null; tags: string;
  github: string | null; demo: string | null; featured: boolean;
}
interface Profile {
  name: string | null; title: string | null; bio: string | null; longBio: string | null;
  location: string | null; email: string | null; github: string | null;
  twitter: string | null; linkedin: string | null; avatar: string | null;
}
interface Props { profile: Profile | null; skills: Skill[]; projects: Project[]; }

/* ── Constants ──────────────────────────────────────────────── */
const CARD_GRADIENTS = [
  { bg: "from-indigo-600/25 to-purple-600/10",  dot: "bg-indigo-400" },
  { bg: "from-emerald-600/25 to-teal-600/10",   dot: "bg-emerald-400" },
  { bg: "from-rose-600/25 to-orange-600/10",    dot: "bg-rose-400" },
  { bg: "from-sky-600/25 to-blue-600/10",       dot: "bg-sky-400" },
  { bg: "from-violet-600/25 to-pink-600/10",    dot: "bg-violet-400" },
  { bg: "from-amber-600/25 to-yellow-600/10",   dot: "bg-amber-400" },
];

const CATEGORY_STYLE: Record<string, string> = {
  Frontend:  "text-blue-300   bg-blue-500/10   border-blue-500/25",
  Backend:   "text-violet-300 bg-violet-500/10 border-violet-500/25",
  DevOps:    "text-orange-300 bg-orange-500/10 border-orange-500/25",
  Database:  "text-emerald-300 bg-emerald-500/10 border-emerald-500/25",
  Mobile:    "text-pink-300   bg-pink-500/10   border-pink-500/25",
  Tools:     "text-yellow-300 bg-yellow-500/10 border-yellow-500/25",
};

/* ── Shared style helpers ───────────────────────────────────── */
const gradientHeading: React.CSSProperties = {
  background: "linear-gradient(160deg, #ffffff 20%, rgba(255,255,255,0.38) 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  letterSpacing: "-0.035em",
  lineHeight: 1.05,
};

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.18em] mb-3">
      {children}
    </p>
  );
}

/* ── Component ──────────────────────────────────────────────── */
export function HomeContent({ profile, skills, projects }: Props) {
  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <>
      {/* Ambient glow — fixed, stays behind all content */}
      <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position: "absolute", top: "-10%", left: "50%",
          transform: "translateX(-50%)",
          width: "900px", height: "700px",
          background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.045) 0%, transparent 65%)",
        }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">

        {/* ════════════════════ HERO ════════════════════ */}
        <section className="flex flex-col justify-center min-h-[90vh] pt-20 pb-24">

          {/* Badge */}
          <div className="animate-fade-up mb-10">
            <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/25 bg-emerald-500/8 rounded-full px-4 py-1.5 tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Disponible pour des missions
            </span>
          </div>

          {/* Name */}
          <h1
            className="animate-fade-up delay-100"
            style={{
              ...gradientHeading,
              fontSize: "clamp(5rem, 13vw, 10rem)",
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: "-0.05em",
            }}
          >
            {profile?.name ?? "Karl"}
          </h1>

          {/* Title */}
          <p
            className="animate-fade-up delay-200"
            style={{
              fontSize: "clamp(1.375rem, 3.5vw, 2.5rem)",
              fontWeight: 300,
              letterSpacing: "-0.025em",
              color: "#52525b",
              marginTop: "1rem",
              marginBottom: "2rem",
              lineHeight: 1.2,
            }}
          >
            {profile?.title ?? "Développeur Full Stack"}
          </p>

          {/* Bio */}
          <p className="animate-fade-up delay-300 text-[#6b7280] text-[1.0625rem] leading-[1.8] max-w-[480px] mb-10">
            {profile?.bio ?? "Passionné par le développement web et la création d'outils innovants."}
          </p>

          {/* CTA row */}
          <div className="animate-fade-up delay-400 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 bg-white text-zinc-900 text-sm font-semibold px-6 py-3 rounded-full hover:bg-zinc-50 active:scale-95 transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              Voir mes projets <ArrowRight size={14} strokeWidth={2.5} />
            </a>
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 text-zinc-300 text-sm font-medium px-6 py-3 rounded-full border border-zinc-800 hover:border-zinc-600 hover:text-white transition-all duration-200"
              >
                <Mail size={14} strokeWidth={1.75} /> Me contacter
              </a>
            )}

            <div className="flex items-center gap-2">
              {profile?.github && (
                <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 transition-all duration-200">
                  <GithubIcon size={15} />
                </a>
              )}
              {profile?.twitter && (
                <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 transition-all duration-200">
                  <XIcon size={14} />
                </a>
              )}
              {profile?.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 transition-all duration-200">
                  <LinkedinIcon size={14} />
                </a>
              )}
            </div>

            {profile?.location && (
              <span className="flex items-center gap-1.5 text-xs text-zinc-600">
                <MapPin size={11} strokeWidth={1.75} /> {profile.location}
              </span>
            )}
          </div>
        </section>

        {/* ════════════════ BENTO QUICK NAV ════════════════ */}
        <section className="pb-28">
          <div className="grid grid-cols-3 gap-3">
            {([
              { href: "/blog",      Icon: BookOpen,      label: "Blog",          desc: "Articles & retours d'expérience", glow: "hover:shadow-[0_0_40px_rgba(96,165,250,0.08)]", border: "hover:border-blue-500/20",   text: "group-hover:text-blue-300"   },
              { href: "/docs",      Icon: FileText,      label: "Documentation", desc: "Guides & références",              glow: "hover:shadow-[0_0_40px_rgba(167,139,250,0.08)]", border: "hover:border-violet-500/20", text: "group-hover:text-violet-300" },
              { href: "/tutorials", Icon: GraduationCap, label: "Tutoriels",     desc: "Guides pratiques pas à pas",       glow: "hover:shadow-[0_0_40px_rgba(52,211,153,0.08)]", border: "hover:border-emerald-500/20",text: "group-hover:text-emerald-300"},
            ] as const).map(({ href, Icon, label, desc, glow, border, text }) => (
              <NextLink key={href} href={href}
                className={`group col-span-1 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] ${border} ${glow} transition-all duration-300 hover:-translate-y-0.5`}>
                <Icon size={20} strokeWidth={1.5} className={`text-zinc-600 mb-5 transition-colors duration-200 ${text}`} />
                <p className="text-sm font-semibold text-zinc-200 mb-1.5 group-hover:text-white transition-colors">{label}</p>
                <p className="text-xs text-zinc-600 leading-relaxed">{desc}</p>
              </NextLink>
            ))}
          </div>
        </section>

        {/* ════════════════ PROJECTS BENTO ════════════════ */}
        {projects.length > 0 && (
          <section id="projects" className="pb-32">
            <div className="mb-14">
              <SectionEyebrow>Projets</SectionEyebrow>
              <h2 style={{ ...gradientHeading, fontSize: "clamp(2.25rem, 5vw, 3.75rem)", fontWeight: 700 }}>
                Réalisations récentes.
              </h2>
            </div>

            {/* Bento grid: first card is big, rest 2-col */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project, i) => {
                const tags: string[] = JSON.parse(project.tags || "[]");
                const g = CARD_GRADIENTS[i % CARD_GRADIENTS.length];
                const isFeatured = i === 0 && project.featured;

                return (
                  <article
                    key={project.id}
                    className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.035] hover:border-white/[0.1] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] ${isFeatured ? "md:col-span-2" : ""}`}
                  >
                    {/* Gradient header */}
                    <div className={`relative h-32 w-full bg-gradient-to-br ${g.bg}`}>
                      {/* Subtle dot pattern via radial */}
                      <div className="absolute inset-0 opacity-30"
                        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                      {/* Glow dot */}
                      <div className={`absolute bottom-4 left-6 w-2 h-2 rounded-full ${g.dot} opacity-60`} />
                      {project.featured && (
                        <span className="absolute top-4 right-4 text-[10px] font-semibold text-white/60 bg-white/8 border border-white/12 px-2.5 py-1 rounded-full tracking-wide uppercase">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-6">
                      <h3 className="text-[0.9375rem] font-semibold text-zinc-100 group-hover:text-white transition-colors mb-2">
                        {project.title}
                      </h3>
                      <p className="text-zinc-500 text-sm leading-relaxed mb-5 line-clamp-2">
                        {project.description ?? ""}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {tags.slice(0, 4).map((t) => (
                          <span key={t} className="text-[11px] font-medium text-zinc-500 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-5 pt-4 border-t border-white/[0.05]">
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-200 transition-colors">
                            <GithubIcon size={12} /> Code source
                          </a>
                        )}
                        {project.demo && (
                          <a href={project.demo} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors">
                            <ExternalLink size={11} strokeWidth={2} /> Demo live
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* ════════════════ SKILLS BENTO ════════════════ */}
        {Object.keys(skillsByCategory).length > 0 && (
          <section className="pb-32">
            <div className="mb-14">
              <SectionEyebrow>Stack technique</SectionEyebrow>
              <h2 style={{ ...gradientHeading, fontSize: "clamp(2.25rem, 5vw, 3.75rem)", fontWeight: 700 }}>
                Ce que je maîtrise.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(skillsByCategory).map(([category, catSkills]) => {
                const pill = CATEGORY_STYLE[category] ?? "text-zinc-400 bg-white/[0.03] border-white/[0.06]";
                return (
                  <div key={category}
                    className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                    <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.16em] mb-4">
                      {category}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {catSkills.map((s) => (
                        <span key={s.id}
                          className={`px-3.5 py-1.5 rounded-full text-sm font-medium border ${pill} transition-all duration-200 hover:brightness-125`}>
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ════════════════ ABOUT ════════════════ */}
        {profile?.longBio && (
          <section className="pb-32">
            <div className="mb-14">
              <SectionEyebrow>À propos</SectionEyebrow>
              <h2 style={{ ...gradientHeading, fontSize: "clamp(2.25rem, 5vw, 3.75rem)", fontWeight: 700 }}>
                Qui suis-je.
              </h2>
            </div>
            <div className="max-w-2xl">
              <p className="text-[#6b7280] text-[1.0625rem] leading-[1.9] whitespace-pre-wrap">
                {profile.longBio}
              </p>
            </div>
          </section>
        )}

        {/* ════════════════ CONTACT ════════════════ */}
        {(profile?.email || profile?.github || profile?.twitter || profile?.linkedin) && (
          <section className="pb-32">
            <div className="relative rounded-3xl border border-white/[0.07] bg-white/[0.015] overflow-hidden">
              {/* Center glow */}
              <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div style={{
                  width: "700px", height: "400px",
                  background: "radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 65%)",
                }} />
              </div>

              <div className="relative px-8 py-20 text-center">
                <SectionEyebrow>Contact</SectionEyebrow>
                <h2
                  style={{
                    ...gradientHeading,
                    fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                    fontWeight: 700,
                    marginBottom: "1rem",
                  }}
                >
                  Travaillons ensemble.
                </h2>
                <p className="text-[#52525b] text-base max-w-sm mx-auto mb-10 leading-relaxed">
                  Disponible pour des projets freelance, des collaborations ou simplement pour échanger.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {profile?.email && (
                    <a href={`mailto:${profile.email}`}
                      className="inline-flex items-center gap-2 bg-white text-zinc-900 text-sm font-semibold px-6 py-3 rounded-full hover:bg-zinc-50 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.12)]">
                      <Mail size={14} strokeWidth={1.75} /> {profile.email}
                    </a>
                  )}
                  {profile?.github && (
                    <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-zinc-300 text-sm font-medium px-6 py-3 rounded-full border border-zinc-800 hover:border-zinc-600 hover:text-white transition-all">
                      <GithubIcon size={14} /> GitHub
                    </a>
                  )}
                  {profile?.twitter && (
                    <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-zinc-300 text-sm font-medium px-6 py-3 rounded-full border border-zinc-800 hover:border-zinc-600 hover:text-white transition-all">
                      <XIcon size={13} /> Twitter / X
                    </a>
                  )}
                  {profile?.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-zinc-300 text-sm font-medium px-6 py-3 rounded-full border border-zinc-800 hover:border-zinc-600 hover:text-white transition-all">
                      <LinkedinIcon size={13} /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

      </div>
    </>
  );
}
