"use client";

import { useState, useEffect } from "react";
import { FolderOpen, Plus, Pencil, Trash2, X, Save, Eye, EyeOff, Star, GitBranch, ExternalLink } from "lucide-react";

interface Project {
  id: string; title: string; description: string; content: string;
  image: string; tags: string; github: string; demo: string;
  featured: boolean; published: boolean; order: number;
}
const EMPTY: Omit<Project, "id"> = {
  title: "", description: "", content: "", image: "", tags: "",
  github: "", demo: "", featured: false, published: true, order: 0,
};

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-white/[0.1] bg-[#111116] shadow-2xl">
        {children}
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={() => onChange(!checked)}
        className={`relative w-9 rounded-full transition-colors shrink-0 ${checked ? "bg-emerald-500" : "bg-white/[0.1]"}`}
        style={{ height: "20px" }}>
        <span className="absolute top-0.5 rounded-full bg-white shadow transition-transform"
          style={{ width: "16px", height: "16px", transform: checked ? "translateX(18px)" : "translateX(2px)" }} />
      </button>
      <span className="text-sm text-zinc-400">{label}</span>
    </div>
  );
}

const inputCls = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-white/[0.2] transition-colors";
const textareaCls = inputCls + " resize-none";
const labelCls = "text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.12em] block mb-1.5";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form,     setForm]     = useState<Omit<Project, "id"> & { id?: string }>(EMPTY);
  const [open,     setOpen]     = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() { const r = await fetch("/api/admin/projects"); setProjects(await r.json()); }
  useEffect(() => { load(); }, []);

  function openCreate() { setForm(EMPTY); setMsg(""); setOpen(true); }
  function openEdit(p: Project) { setForm({ ...p, tags: JSON.parse(p.tags || "[]").join(", ") }); setMsg(""); setOpen(true); }
  function set(key: keyof typeof form, val: string | boolean | number) { setForm((p) => ({ ...p, [key]: val })); }

  async function save() {
    setSaving(true); setMsg("");
    const payload = { ...form, tags: JSON.stringify(form.tags.split(",").map((t) => t.trim()).filter(Boolean)) };
    const method  = form.id ? "PUT" : "POST";
    const url     = form.id ? `/api/admin/projects/${form.id}` : "/api/admin/projects";
    const res     = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) { setOpen(false); load(); } else setMsg("Erreur lors de la sauvegarde.");
  }

  async function del(id: string) {
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    setDeleting(null); load();
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderOpen size={14} strokeWidth={1.75} className="text-zinc-500" />
            <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.14em]">Portfolio</p>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Projets</h1>
          <p className="text-zinc-600 text-sm mt-1">{projects.length} projet{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition-colors">
          <Plus size={14} strokeWidth={2.5} /> Nouveau projet
        </button>
      </div>

      <div className="space-y-2">
        {projects.map((p) => {
          const tags: string[] = JSON.parse(p.tags || "[]");
          return (
            <div key={p.id}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-semibold text-zinc-100">{p.title}</span>
                  {p.featured && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                      <Star size={9} strokeWidth={2} /> Featured
                    </span>
                  )}
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    p.published ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/20" : "text-zinc-500 bg-white/[0.04] border-white/[0.08]"
                  }`}>
                    {p.published ? <Eye size={9} strokeWidth={2} /> : <EyeOff size={9} strokeWidth={2} />}
                    {p.published ? "Publié" : "Masqué"}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {p.description && <span className="text-xs text-zinc-600 truncate max-w-xs">{p.description}</span>}
                  {p.github && <span className="flex items-center gap-1 text-[10px] text-zinc-700"><GitBranch size={9} /> GitHub</span>}
                  {p.demo && <span className="flex items-center gap-1 text-[10px] text-zinc-700"><ExternalLink size={9} /> Demo</span>}
                  {tags.slice(0, 3).map((t) => (
                    <span key={t} className="text-[10px] text-zinc-600 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-xl border border-white/[0.06] flex items-center justify-center text-zinc-600 hover:text-zinc-200 hover:border-white/[0.12] transition-all">
                  <Pencil size={12} strokeWidth={1.75} />
                </button>
                {deleting === p.id ? (
                  <div className="flex gap-1">
                    <button onClick={() => del(p.id)} className="text-[10px] text-red-400 border border-red-500/25 px-2.5 py-1.5 rounded-xl hover:bg-red-500/10 transition-all">Oui</button>
                    <button onClick={() => setDeleting(null)} className="text-[10px] text-zinc-600 border border-white/[0.06] px-2.5 py-1.5 rounded-xl hover:bg-white/[0.04] transition-all">Non</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleting(p.id)} className="w-8 h-8 rounded-xl border border-white/[0.06] flex items-center justify-center text-zinc-600 hover:text-red-400 hover:border-red-500/25 transition-all">
                    <Trash2 size={12} strokeWidth={1.75} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {projects.length === 0 && <div className="py-20 text-center text-zinc-600 text-sm">Aucun projet.</div>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] shrink-0">
          <h2 className="text-sm font-bold text-zinc-100">{form.id ? "Modifier le projet" : "Nouveau projet"}</h2>
          <button onClick={() => setOpen(false)} className="text-zinc-600 hover:text-zinc-300 transition-colors"><X size={16} /></button>
        </div>
        <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
          <div>
            <label className={labelCls}>Titre</label>
            <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Mon projet" />
          </div>
          <div>
            <label className={labelCls}>Description courte</label>
            <textarea className={textareaCls} rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Contenu Markdown</label>
            <textarea className={textareaCls} rows={8} value={form.content} onChange={(e) => set("content", e.target.value)} placeholder="Description détaillée..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>GitHub URL</label>
              <input className={inputCls} value={form.github} onChange={(e) => set("github", e.target.value)} placeholder="https://github.com/..." />
            </div>
            <div>
              <label className={labelCls}>Demo URL</label>
              <input className={inputCls} value={form.demo} onChange={(e) => set("demo", e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className={labelCls}>Tags (virgules)</label>
              <input className={inputCls} value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="react, nextjs" />
            </div>
            <div>
              <label className={labelCls}>Image (URL)</label>
              <input className={inputCls} value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className={labelCls}>Ordre</label>
              <input className={inputCls} type="number" value={form.order} onChange={(e) => set("order", Number(e.target.value))} />
            </div>
          </div>
          <div className="flex gap-6 pt-1">
            <Toggle checked={form.featured}  onChange={(v) => set("featured", v)}  label="Featured" />
            <Toggle checked={form.published} onChange={(v) => set("published", v)} label="Publié" />
          </div>
          {msg && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl">{msg}</p>}
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-white/[0.07] shrink-0">
          <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-xl text-sm text-zinc-500 hover:text-zinc-200 border border-white/[0.06] hover:bg-white/[0.04] transition-all">Annuler</button>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 disabled:opacity-50 transition-colors">
            {saving ? <span className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" /> : <Save size={13} strokeWidth={2} />}
            Sauvegarder
          </button>
        </div>
      </Modal>
    </div>
  );
}
