"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Plus, Pencil, Trash2, X, Save, Eye, EyeOff, Clock, Zap, Target, Flame } from "lucide-react";

interface Tutorial {
  id: string; title: string; slug: string; excerpt: string; content: string;
  image: string; tags: string; difficulty: string; duration: number | null; published: boolean;
}

const EMPTY: Omit<Tutorial, "id"> = {
  title: "", slug: "", excerpt: "", content: "", image: "", tags: "",
  difficulty: "beginner", duration: null, published: false,
};

function toSlug(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

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

const DIFF: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  beginner:     { label: "Débutant",      color: "text-emerald-300", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: Zap    },
  intermediate: { label: "Intermédiaire", color: "text-amber-300",   bg: "bg-amber-500/10",   border: "border-amber-500/20",   icon: Target },
  advanced:     { label: "Avancé",        color: "text-red-300",     bg: "bg-red-500/10",     border: "border-red-500/20",     icon: Flame  },
};

const inputCls = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-white/[0.2] transition-colors";
const textareaCls = inputCls + " resize-none";
const labelCls = "text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.12em] block mb-1.5";

export default function AdminTutorialsPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [form,      setForm]      = useState<Omit<Tutorial, "id"> & { id?: string }>(EMPTY);
  const [open,      setOpen]      = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [msg,       setMsg]       = useState("");
  const [deleting,  setDeleting]  = useState<string | null>(null);

  async function load() { const r = await fetch("/api/admin/tutorials"); setTutorials(await r.json()); }
  useEffect(() => { load(); }, []);

  function openCreate() { setForm(EMPTY); setMsg(""); setOpen(true); }
  function openEdit(t: Tutorial) {
    setForm({ ...t, tags: JSON.parse(t.tags || "[]").join(", ") });
    setMsg(""); setOpen(true);
  }
  function set(key: keyof typeof form, val: string | boolean | number | null) { setForm((p) => ({ ...p, [key]: val })); }

  async function save() {
    setSaving(true); setMsg("");
    const payload = { ...form, tags: JSON.stringify(form.tags.split(",").map((t) => t.trim()).filter(Boolean)) };
    const method  = form.id ? "PUT" : "POST";
    const url     = form.id ? `/api/admin/tutorials/${form.id}` : "/api/admin/tutorials";
    const res     = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) { setOpen(false); load(); }
    else { const d = await res.json(); setMsg(d.error || "Erreur."); }
  }

  async function del(id: string) {
    await fetch(`/api/admin/tutorials/${id}`, { method: "DELETE" });
    setDeleting(null); load();
  }

  const byDiff = (d: string) => tutorials.filter((t) => t.difficulty === d);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap size={14} strokeWidth={1.75} className="text-zinc-500" />
            <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.14em]">Contenu</p>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Tutoriels</h1>
          <p className="text-zinc-600 text-sm mt-1">{tutorials.length} tutoriel{tutorials.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition-colors">
          <Plus size={14} strokeWidth={2.5} /> Nouveau tutoriel
        </button>
      </div>

      {/* Difficulty stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {(["beginner", "intermediate", "advanced"] as const).map((d) => {
          const { label, color, bg, border, icon: Icon } = DIFF[d];
          const count = byDiff(d).length;
          return (
            <div key={d} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${border} ${bg}`}>
              <Icon size={14} strokeWidth={1.75} className={color} />
              <div>
                <p className={`text-sm font-bold ${color} tabular-nums`}>{count}</p>
                <p className="text-[10px] text-zinc-600">{label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* List */}
      <div className="space-y-2">
        {tutorials.map((t) => {
          const tags: string[] = JSON.parse(t.tags || "[]");
          const d = DIFF[t.difficulty] ?? DIFF.beginner;
          const DIcon = d.icon;
          return (
            <div key={t.id}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-semibold text-zinc-100">{t.title}</span>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${d.color} ${d.bg} ${d.border}`}>
                    <DIcon size={8} strokeWidth={2} /> {d.label}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    t.published ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/20" : "text-zinc-500 bg-white/[0.04] border-white/[0.08]"
                  }`}>
                    {t.published ? <Eye size={9} strokeWidth={2} /> : <EyeOff size={9} strokeWidth={2} />}
                    {t.published ? "Publié" : "Brouillon"}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs text-zinc-600">/tutorials/{t.slug}</span>
                  {t.duration && (
                    <span className="flex items-center gap-1 text-[10px] text-zinc-700">
                      <Clock size={9} strokeWidth={1.75} /> {t.duration} min
                    </span>
                  )}
                  {tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] text-zinc-600 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => openEdit(t)}
                  className="w-8 h-8 rounded-xl border border-white/[0.06] flex items-center justify-center text-zinc-600 hover:text-zinc-200 hover:border-white/[0.12] transition-all">
                  <Pencil size={12} strokeWidth={1.75} />
                </button>
                {deleting === t.id ? (
                  <div className="flex gap-1">
                    <button onClick={() => del(t.id)} className="text-[10px] text-red-400 border border-red-500/25 px-2.5 py-1.5 rounded-xl hover:bg-red-500/10 transition-all">Oui</button>
                    <button onClick={() => setDeleting(null)} className="text-[10px] text-zinc-600 border border-white/[0.06] px-2.5 py-1.5 rounded-xl hover:bg-white/[0.04] transition-all">Non</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleting(t.id)}
                    className="w-8 h-8 rounded-xl border border-white/[0.06] flex items-center justify-center text-zinc-600 hover:text-red-400 hover:border-red-500/25 transition-all">
                    <Trash2 size={12} strokeWidth={1.75} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {tutorials.length === 0 && <div className="py-20 text-center text-zinc-600 text-sm">Aucun tutoriel.</div>}
      </div>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] shrink-0">
          <h2 className="text-sm font-bold text-zinc-100">{form.id ? "Modifier le tutoriel" : "Nouveau tutoriel"}</h2>
          <button onClick={() => setOpen(false)} className="text-zinc-600 hover:text-zinc-300 transition-colors"><X size={16} /></button>
        </div>
        <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelCls}>Titre</label>
              <input className={inputCls} value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value, slug: p.slug || toSlug(e.target.value) }))}
                placeholder="Mon tutoriel" />
            </div>
            <div>
              <label className={labelCls}>Slug</label>
              <input className={inputCls} value={form.slug} onChange={(e) => set("slug", toSlug(e.target.value))} placeholder="mon-tutoriel" />
            </div>
            <div>
              <label className={labelCls}>Tags (virgules)</label>
              <input className={inputCls} value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="react, nextjs" />
            </div>
            <div>
              <label className={labelCls}>Difficulté</label>
              <select className={inputCls} value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)}>
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Durée (minutes)</label>
              <input className={inputCls} type="number" value={form.duration ?? ""} placeholder="30"
                onChange={(e) => set("duration", e.target.value ? Number(e.target.value) : null)} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Extrait</label>
              <textarea className={textareaCls} rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Résumé du tutoriel..." />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Contenu Markdown</label>
              <textarea className={textareaCls} rows={10} value={form.content} onChange={(e) => set("content", e.target.value)} placeholder="# Mon tutoriel&#10;&#10;Contenu..." />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Image (URL)</label>
              <input className={inputCls} value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://..." />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <button type="button" onClick={() => set("published", !form.published)}
                className={`relative w-9 rounded-full transition-colors shrink-0 ${form.published ? "bg-emerald-500" : "bg-white/[0.1]"}`}
                style={{ height: "20px" }}>
                <span className="absolute top-0.5 rounded-full bg-white shadow transition-transform"
                  style={{ width: "16px", height: "16px", transform: form.published ? "translateX(18px)" : "translateX(2px)" }} />
              </button>
              <span className="text-sm text-zinc-400">{form.published ? "Publié" : "Brouillon"}</span>
            </div>
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
