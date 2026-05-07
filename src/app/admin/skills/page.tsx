"use client";

import { useState, useEffect } from "react";
import { Zap, Plus, Pencil, Trash2, X, Save } from "lucide-react";

interface Skill { id: string; name: string; level: number; category: string; order: number; }
const EMPTY: Omit<Skill, "id"> = { name: "", level: 80, category: "", order: 0 };

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#111116] shadow-2xl">
        {children}
      </div>
    </div>
  );
}

const inputCls = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-white/[0.2] transition-colors";

export default function AdminSkillsPage() {
  const [skills,  setSkills]  = useState<Skill[]>([]);
  const [form,    setForm]    = useState<Omit<Skill, "id"> & { id?: string }>(EMPTY);
  const [open,    setOpen]    = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [deleting,setDeleting]= useState<string | null>(null);

  async function load() {
    const r = await fetch("/api/admin/skills");
    setSkills(await r.json());
  }
  useEffect(() => { load(); }, []);

  function openCreate() { setForm(EMPTY); setOpen(true); }
  function openEdit(s: Skill) { setForm(s); setOpen(true); }
  function set(key: keyof typeof form, val: string | number) { setForm((p) => ({ ...p, [key]: val })); }

  async function save() {
    setSaving(true);
    const method = form.id ? "PUT" : "POST";
    const url    = form.id ? `/api/admin/skills/${form.id}` : "/api/admin/skills";
    const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    if (res.ok) { setOpen(false); load(); }
  }

  async function del(id: string) {
    await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
    setDeleting(null); load();
  }

  const categories = [...new Set(skills.map((s) => s.category))].sort();

  const LEVEL_COLOR = (n: number) =>
    n >= 80 ? "bg-emerald-500" : n >= 50 ? "bg-amber-500" : "bg-zinc-500";

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} strokeWidth={1.75} className="text-zinc-500" />
            <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.14em]">Stack</p>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Compétences</h1>
          <p className="text-zinc-600 text-sm mt-1">{skills.length} compétence{skills.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition-colors">
          <Plus size={14} strokeWidth={2.5} /> Ajouter
        </button>
      </div>

      {/* Groups */}
      <div className="space-y-8">
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.18em] mb-3 px-1">{cat || "Sans catégorie"}</p>
            <div className="space-y-2">
              {skills.filter((s) => s.category === cat).sort((a, b) => a.order - b.order).map((s) => (
                <div key={s.id}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-zinc-200">{s.name}</span>
                      <span className="text-xs text-zinc-600 tabular-nums">{s.level}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className={`h-full rounded-full ${LEVEL_COLOR(s.level)} transition-all`}
                        style={{ width: `${s.level}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => openEdit(s)}
                      className="w-7 h-7 rounded-lg border border-white/[0.06] flex items-center justify-center text-zinc-600 hover:text-zinc-200 hover:border-white/[0.12] transition-all">
                      <Pencil size={11} strokeWidth={1.75} />
                    </button>
                    {deleting === s.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => del(s.id)} className="text-[10px] text-red-400 border border-red-500/25 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-all">Oui</button>
                        <button onClick={() => setDeleting(null)} className="text-[10px] text-zinc-600 border border-white/[0.06] px-2 py-1 rounded-lg hover:bg-white/[0.04] transition-all">Non</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleting(s.id)}
                        className="w-7 h-7 rounded-lg border border-white/[0.06] flex items-center justify-center text-zinc-600 hover:text-red-400 hover:border-red-500/25 transition-all">
                        <Trash2 size={11} strokeWidth={1.75} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {skills.length === 0 && (
          <div className="py-20 text-center text-zinc-600 text-sm">Aucune compétence. Commencez par en ajouter.</div>
        )}
      </div>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <h2 className="text-sm font-bold text-zinc-100">{form.id ? "Modifier" : "Nouvelle compétence"}</h2>
          <button onClick={() => setOpen(false)} className="text-zinc-600 hover:text-zinc-300 transition-colors">
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.12em] block mb-2">Nom</label>
            <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="TypeScript" />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.12em] block mb-2">Catégorie</label>
            <input className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="Frontend, Backend, DevOps..." list="cat-list" />
            <datalist id="cat-list">{categories.map((c) => <option key={c} value={c} />)}</datalist>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.12em]">Niveau</label>
              <span className="text-xs text-zinc-400 tabular-nums font-semibold">{form.level}%</span>
            </div>
            <input type="range" min={0} max={100} step={5} value={form.level}
              onChange={(e) => set("level", Number(e.target.value))}
              className="w-full h-1.5 bg-white/[0.06] rounded-full appearance-none cursor-pointer accent-white" />
            <div className="flex justify-between text-[10px] text-zinc-700 mt-1">
              <span>0</span><span>50</span><span>100</span>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.12em] block mb-2">Ordre</label>
            <input className={inputCls} type="number" value={form.order} onChange={(e) => set("order", Number(e.target.value))} />
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-white/[0.07]">
          <button onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-xl text-sm text-zinc-500 hover:text-zinc-200 border border-white/[0.06] hover:bg-white/[0.04] transition-all">
            Annuler
          </button>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 disabled:opacity-50 transition-colors">
            {saving ? <span className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" /> : <Save size={13} strokeWidth={2} />}
            Sauvegarder
          </button>
        </div>
      </Modal>
    </div>
  );
}
