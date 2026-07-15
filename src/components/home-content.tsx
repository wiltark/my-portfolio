import NextLink from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Article,
  BookOpen,
  EnvelopeSimple,
  GithubLogo,
  GraduationCap,
  LinkedinLogo,
  MapPin,
  XLogo,
} from "@phosphor-icons/react/dist/ssr";

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

/*
  Système de rayons: tuiles rounded-2xl, éléments interactifs pill (rounded-full).
  Accent unique: lime-300.
*/
const TILE = "rounded-2xl border border-white/[0.07] bg-white/[0.02]";
const TILE_HOVER = "hover:bg-white/[0.04] hover:border-white/[0.12] transition-colors duration-300";

const DOT_PATTERN: React.CSSProperties = {
  backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)",
  backgroundSize: "20px 20px",
};

/* Répartition des tuiles projet sur une grille 6 colonnes, sans cellule vide */
function projectSpans(n: number): string[] {
  switch (n) {
    case 1: return ["md:col-span-6"];
    case 2: return ["md:col-span-4", "md:col-span-2"];
    case 3: return ["md:col-span-6", "md:col-span-3", "md:col-span-3"];
    case 4: return ["md:col-span-4", "md:col-span-2", "md:col-span-2", "md:col-span-4"];
    case 5: return ["md:col-span-4", "md:col-span-2", "md:col-span-2", "md:col-span-2", "md:col-span-2"];
    default: return ["md:col-span-4", "md:col-span-2", "md:col-span-3", "md:col-span-3", "md:col-span-2", "md:col-span-4"];
  }
}

/* Même logique pour les catégories de compétences */
function skillSpan(i: number, n: number): string {
  if (i === n - 1 && n % 2 === 1) return "md:col-span-6";
  const pattern = ["md:col-span-3", "md:col-span-3", "md:col-span-2", "md:col-span-4", "md:col-span-4", "md:col-span-2"];
  return pattern[i % pattern.length];
}

const SOCIAL_BTN =
  "w-10 h-10 rounded-full border border-white/[0.09] flex items-center justify-center text-zinc-500 hover:text-lime-300 hover:border-lime-300/40 transition-colors duration-200";

/* ── Component ──────────────────────────────────────────────── */
export function HomeContent({ profile, skills, projects }: Props) {
  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});
  const categories = Object.entries(skillsByCategory);
  const spans = projectSpans(projects.length);
  const avatarSrc = profile?.avatar ?? "https://picsum.photos/seed/karl-portfolio-portrait/800/1000";

  return (
    <>
      {/* Halo d'ambiance, fixe derrière tout le contenu */}
      <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[900px] h-[650px]"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(190,242,100,0.05) 0%, transparent 65%)" }}
        />
      </div>

      <main className="relative max-w-6xl mx-auto px-4 md:px-6 pt-24 pb-8">

        {/* ════════════ BENTO IDENTITÉ ════════════ */}
        <section className="grid grid-cols-1 md:grid-cols-6 gap-3 animate-fade-up">

          {/* Héro */}
          <div className={`${TILE} md:col-span-4 md:row-span-2 p-8 md:p-12 flex flex-col justify-between gap-12`}>
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-medium text-lime-300 border border-lime-300/25 bg-lime-300/[0.06] rounded-full px-3.5 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-300" />
                Disponible pour des missions
              </span>
            </div>

            <div>
              <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-zinc-50 leading-[0.95]">
                {profile?.name ?? "Karl"}
              </h1>
              <p className="mt-3 text-xl md:text-2xl font-light text-zinc-400 tracking-tight">
                {profile?.title ?? "Développeur Full Stack"}
              </p>
              <p className="mt-6 text-zinc-500 leading-relaxed max-w-md">
                {profile?.bio ?? "Passionné par le développement web et la création d'outils innovants."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 bg-lime-300 text-zinc-950 text-sm font-semibold px-6 py-3 rounded-full hover:bg-lime-200 active:scale-[0.98] transition-all duration-200"
              >
                Voir mes projets <ArrowRight size={15} weight="bold" />
              </a>
              <div className="flex items-center gap-2">
                {profile?.github && (
                  <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer"
                    aria-label="GitHub" className={SOCIAL_BTN}>
                    <GithubLogo size={17} />
                  </a>
                )}
                {profile?.twitter && (
                  <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer"
                    aria-label="X" className={SOCIAL_BTN}>
                    <XLogo size={16} />
                  </a>
                )}
                {profile?.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                    aria-label="LinkedIn" className={SOCIAL_BTN}>
                    <LinkedinLogo size={17} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Portrait */}
          <div className={`${TILE} md:col-span-2 md:row-span-2 overflow-hidden relative min-h-[320px]`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarSrc}
              alt={`Portrait de ${profile?.name ?? "Karl"}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Accès rapides */}
          {([
            { href: "/blog", Icon: Article, label: "Blog", desc: "Articles et retours d'expérience", variant: "pattern" },
            { href: "/docs", Icon: BookOpen, label: "Documentation", desc: "Guides et références", variant: "plain" },
            { href: "/tutorials", Icon: GraduationCap, label: "Tutoriels", desc: "Guides pratiques pas à pas", variant: "accent" },
          ] as const).map(({ href, Icon, label, desc, variant }) => (
            <NextLink
              key={href}
              href={href}
              className={`group md:col-span-2 p-6 relative overflow-hidden ${
                variant === "accent"
                  ? "rounded-2xl border border-lime-300/20 bg-lime-300/[0.05] hover:bg-lime-300/[0.09] hover:border-lime-300/30 transition-colors duration-300"
                  : `${TILE} ${TILE_HOVER}`
              }`}
            >
              {variant === "pattern" && <div aria-hidden className="absolute inset-0" style={DOT_PATTERN} />}
              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <Icon size={22} className={variant === "accent" ? "text-lime-300" : "text-zinc-500"} />
                  <ArrowUpRight size={16} className="text-zinc-700 group-hover:text-lime-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                </div>
                <p className="text-sm font-semibold text-zinc-100 mb-1">{label}</p>
                <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            </NextLink>
          ))}
        </section>

        {/* ════════════ PROJETS ════════════ */}
        {projects.length > 0 && (
          <section id="projects" className="pt-24">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter text-zinc-50 mb-8">
              Projets récents.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              {projects.map((project, i) => {
                const tags: string[] = JSON.parse(project.tags || "[]");
                const big = spans[i]?.includes("span-6") || spans[i]?.includes("span-4");

                return (
                  <article
                    key={project.id}
                    className={`group relative overflow-hidden flex flex-col ${spans[i] ?? "md:col-span-2"} ${
                      project.featured && big
                        ? "rounded-2xl border border-lime-300/20 bg-lime-300/[0.04] hover:bg-lime-300/[0.07] transition-colors duration-300"
                        : `${TILE} ${TILE_HOVER}`
                    } ${big ? "p-8" : "p-6"}`}
                  >
                    {project.featured && big && <div aria-hidden className="absolute inset-0" style={DOT_PATTERN} />}

                    <div className="relative flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className={`font-semibold text-zinc-50 tracking-tight ${big ? "text-2xl" : "text-base"}`}>
                          {project.title}
                        </h3>
                        {project.featured && (
                          <span className="shrink-0 text-[10px] font-semibold text-lime-300 border border-lime-300/25 px-2.5 py-1 rounded-full uppercase tracking-wide">
                            Phare
                          </span>
                        )}
                      </div>

                      <p className={`text-zinc-500 leading-relaxed mb-6 ${big ? "text-base max-w-lg" : "text-sm line-clamp-3"}`}>
                        {project.description ?? ""}
                      </p>

                      <div className="mt-auto">
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {tags.slice(0, 4).map((t) => (
                            <span key={t} className="text-[11px] font-medium text-zinc-400 bg-white/[0.04] border border-white/[0.07] px-2.5 py-1 rounded-full">
                              {t}
                            </span>
                          ))}
                        </div>
                        {(project.github || project.demo) && (
                          <div className="flex gap-5 pt-4 border-t border-white/[0.06]">
                            {project.github && (
                              <a href={project.github} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-100 transition-colors">
                                <GithubLogo size={14} /> Code source
                              </a>
                            )}
                            {project.demo && (
                              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs font-medium text-lime-300 hover:text-lime-200 transition-colors">
                                <ArrowUpRight size={13} weight="bold" /> Démo live
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* ════════════ STACK ════════════ */}
        {categories.length > 0 && (
          <section className="pt-24">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter text-zinc-50 mb-8">
              Stack technique.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              {categories.map(([category, catSkills], i) => (
                <div key={category} className={`${TILE} p-6 ${skillSpan(i, categories.length)}`}>
                  <p className="text-sm font-medium text-zinc-400 mb-4">{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {catSkills.map((s) => (
                      <span
                        key={s.id}
                        className="px-3.5 py-1.5 rounded-full text-sm text-zinc-300 border border-white/[0.08] bg-white/[0.03] hover:border-lime-300/40 hover:text-lime-300 transition-colors duration-200"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ════════════ À PROPOS + CONTACT ════════════ */}
        <section className="pt-24">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            {profile?.longBio && (
              <div className={`${TILE} md:col-span-3 p-8`}>
                <p className="text-sm font-medium text-zinc-400 mb-4">À propos</p>
                <p className="text-zinc-400 leading-[1.9] whitespace-pre-wrap">
                  {profile.longBio}
                </p>
              </div>
            )}

            <div className={`relative overflow-hidden rounded-2xl bg-lime-300 p-8 md:p-10 flex flex-col justify-between gap-10 ${profile?.longBio ? "md:col-span-3" : "md:col-span-6"}`}>
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  backgroundImage: "radial-gradient(rgba(9,9,11,0.12) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter text-zinc-950">
                  Travaillons ensemble.
                </h2>
                <p className="mt-3 text-zinc-800 text-sm leading-relaxed max-w-xs">
                  Missions freelance, collaborations ou simple échange technique.
                </p>
              </div>
              <div className="relative flex flex-wrap items-center gap-4">
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-2 bg-zinc-950 text-lime-300 text-sm font-semibold px-6 py-3 rounded-full hover:bg-zinc-900 active:scale-[0.98] transition-all duration-200"
                  >
                    <EnvelopeSimple size={16} /> {profile.email}
                  </a>
                )}
                {profile?.location && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-800">
                    <MapPin size={13} weight="fill" /> {profile.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
