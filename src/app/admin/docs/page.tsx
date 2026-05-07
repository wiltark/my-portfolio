"use client";

import { useState, useEffect } from "react";
import { BookMarked, Plus, Pencil, Trash2, X, Save, Eye, EyeOff, Hash, FolderOpen } from "lucide-react";

interface DocPage {
  id: string; title: string; slug: string; content: string;
  categoryId: string | null; order: number; published: boolean;
}
interface Category { id: string; name: string; slug: string; order: number; }

const emptyPage: Omit<DocPage, "id"> = { title: "", slug: "", content: "", categoryId: null, order: 0, published: true };
const emptyCat: Omit<Category, "id"> = { name: "", slug: "", order: 0 };

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

function CatModal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
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
const textareaCls = inputCls + " resize-none";
const labelCls = "text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.12em] block mb-1.5";

export default function AdminDocsPage() {
  const [pages,      setPages]      = useState<DocPage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tab,        setTab]        = useState<"pages" | "categories">("pages");
  const [form,       setForm]       = useState<Omit<DocPage, "id"> & { id?: string }>(emptyPage);
  const [catForm,    setCatForm]    = useState<Omit<Category, "id"> & { id?: string }>(emptyCat);
  const [pageOpen,   setPageOpen]   = useState(false);
  const [catOpen,    setCatOpen]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [msg,        setMsg]        = useState("");
  const [delPage,    setDelPage]    = useState<string | null>(null);
  const [delCat,     setDelCat]     = useState<string | null>(null);

  async function load() {
    const [pRes, cRes] = await Promise.all([fetch("/api/admin/docs/pages"), fetch("/api/admin/docs/categories")]);
    setPages(await pRes.json());
    setCategories(await cRes.json());
  }
  useEffect(() => { load(); }, []);

  function openCreatePage() { setForm(emptyPage); setMsg(""); setPageOpen(true); }
  function openEditPage(p: DocPage) { setForm(p); setMsg(""); setPageOpen(true); }
  function openCreateCat() { setCatForm(emptyCat); setCatOpen(true); }
  function openEditCat(c: Category) { setCatForm(c); setCatOpen(true); }

  function set(key: keyof typeof form, val: string | boolean | number | null) { setForm((p) => ({ ...p, [key]: val })); }
  function setc(key: keyof typeof catForm, val: string | number) { setCatForm((p) => ({ ...p, [key]: val })); }

  async function savePage() {
    setSaving(true); setMsg("");
    const method = form.id ? "PUT" : "POST";
    const url    = form.id ? `/api/admin/docs/pages/${form.id}` : "/api/admin/docs/pages";
    const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    if (res.ok) { setPageOpen(false); load(); }
    else { const d = await res.json(); setMsg(d.error || "Erreur."); }
  }

  async function saveCat() {
    setSaving(true);
    const method = catForm.id ? "PUT" : "POST";
    const url    = catForm.id ? `/api/admin/docs/categories/${catForm.id}` : "/api/admin/docs/categories";
    const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(catForm) });
    setSaving(false);
    if (res.ok) { setCatOpen(false); load(); }
  }

  async function deletePage(id: string) {
    await fetch(`/api/admin/docs/pages/${id}`, { method: "DELETE" });
    setDelPage(null); load();
  }

  async function deleteCat(id: string) {
    await fetch(`/api/admin/docs/categories/${id}`, { method: "DELETE" });
    setDelCat(null); load();
  }

  const catName = (id: string | null) => categories.find((c) => c.id === id)?.name ?? null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookMarked size={14} strokeWidth={1.75} className="text-zinc-500" />
            <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.14em]">Contenu</p>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Documentation</h1>
          <p className="text-zinc-600 text-sm mt-1">{pages.length} page{pages.length !== 1 ? "s" : ""} · {categories.length} catégorie{categories.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={openCreateCat}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-300 text-sm font-semibold hover:bg-white/[0.06] transition-colors">
            <Hash size={13} strokeWidth={2} /> Catégorie
          </button>
          <button onClick={openCreatePage}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition-colors">
            <Plus size={14} strokeWidth={2.5} /> Nouvelle page
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
        {(["pages", "categories"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tab === t ? "bg-white/[0.08] text-zinc-100" : "text-zinc-600 hover:text-zinc-300"
            }`}>
            {t === "pages" ? `Pages (${pages.length})` : `Catégories (${categories.length})`}
          </button>
        ))}
      </div>

      {/* Pages list */}
      {tab === "pages" && (
        <div className="space-y-2">
          {pages.map((p) => (
            <div key={p.id}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-semibold text-zinc-100">{p.title}</span>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    p.published ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/20" : "text-zinc-500 bg-white/[0.04] border-white/[0.08]"
                  }`}>
                    {p.published ? <Eye size={9} strokeWidth={2} /> : <EyeOff size={9} strokeWidth={2} />}
                    {p.published ? "Publié" : "Masqué"}
                  </span>
                  {catName(p.categoryId) && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full">
                      <Hash size={8} strokeWidth={2} /> {catName(p.categoryId)}
                    </span>
                  )}
                </div>
                <span className="text-xs text-zinc-600">/docs/{p.slug}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => openEditPage(p)}
                  className="w-8 h-8 rounded-xl border border-white/[0.06] flex items-center justify-center text-zinc-600 hover:text-zinc-200 hover:border-white/[0.12] transition-all">
                  <Pencil size={12} strokeWidth={1.75} />
                </button>
                {delPage === p.id ? (
                  <div className="flex gap-1">
                    <button onClick={() => deletePage(p.id)} className="text-[10px] text-red-400 border border-red-500/25 px-2.5 py-1.5 rounded-xl hover:bg-red-500/10 transition-all">Oui</button>
                    <button onClick={() => setDelPage(null)} className="text-[10px] text-zinc-600 border border-white/[0.06] px-2.5 py-1.5 rounded-xl hover:bg-white/[0.04] transition-all">Non</button>
                  </div>
                ) : (
                  <button onClick={() => setDelPage(p.id)}
                    className="w-8 h-8 rounded-xl border border-white/[0.06] flex items-center justify-center text-zinc-600 hover:text-red-400 hover:border-red-500/25 transition-all">
                    <Trash2 size={12} strokeWidth={1.75} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {pages.length === 0 && <div className="py-20 text-center text-zinc-600 text-sm">Aucune page.</div>}
        </div>
      )}

      {/* Categories list */}
      {tab === "categories" && (
        <div className="space-y-2">
          {categories.map((c) => {
            const pageCount = pages.filter((p) => p.categoryId === c.id).length;
            return (
              <div key={c.id}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                  <FolderOpen size={13} strokeWidth={1.75} className="text-sky-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-zinc-100">{c.name}</span>
                    <span className="text-[10px] text-zinc-600 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-full">
                      {pageCount} page{pageCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-600">/docs/{c.slug} · ordre {c.order}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => openEditCat(c)}
                    className="w-8 h-8 rounded-xl border border-white/[0.06] flex items-center justify-center text-zinc-600 hover:text-zinc-200 hover:border-white/[0.12] transition-all">
                    <Pencil size={12} strokeWidth={1.75} />
                  </button>
                  {delCat === c.id ? (
                    <div className="flex gap-1">
                      <button onClick={() => deleteCat(c.id)} className="text-[10px] text-red-400 border border-red-500/25 px-2.5 py-1.5 rounded-xl hover:bg-red-500/10 transition-all">Oui</button>
                      <button onClick={() => setDelCat(null)} className="text-[10px] text-zinc-600 border border-white/[0.06] px-2.5 py-1.5 rounded-xl hover:bg-white/[0.04] transition-all">Non</button>
                    </div>
                  ) : (
                    <button onClick={() => setDelCat(c.id)}
                      className="w-8 h-8 rounded-xl border border-white/[0.06] flex items-center justify-center text-zinc-600 hover:text-red-400 hover:border-red-500/25 transition-all">
                      <Trash2 size={12} strokeWidth={1.75} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {categories.length === 0 && <div className="py-20 text-center text-zinc-600 text-sm">Aucune catégorie.</div>}
        </div>
      )}

      {/* Page modal */}
      <Modal open={pageOpen} onClose={() => setPageOpen(false)}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] shrink-0">
          <h2 className="text-sm font-bold text-zinc-100">{form.id ? "Modifier la page" : "Nouvelle page"}</h2>
          <button onClick={() => setPageOpen(false)} className="text-zinc-600 hover:text-zinc-300 transition-colors"><X size={16} /></button>
        </div>
        <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelCls}>Titre</label>
              <input className={inputCls} value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value, slug: p.slug || toSlug(e.target.value) }))}
                placeholder="Ma page" />
            </div>
            <div>
              <label className={labelCls}>Slug</label>
              <input className={inputCls} value={form.slug} onChange={(e) => set("slug", toSlug(e.target.value))} placeholder="ma-page" />
            </div>
            <div>
              <label className={labelCls}>Catégorie</label>
              <select className={inputCls} value={form.categoryId ?? ""}
                onChange={(e) => set("categoryId", e.target.value || null)}>
                <option value="">Aucune catégorie</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Contenu Markdown</label>
              <textarea className={textareaCls} rows={12} value={form.content}
                onChange={(e) => set("content", e.target.value)} placeholder="# Ma page&#10;&#10;Contenu..." />
            </div>
            <div>
              <label className={labelCls}>Ordre</label>
              <input className={inputCls} type="number" value={form.order} onChange={(e) => set("order", Number(e.target.value))} />
            </div>
            <div className="flex items-end pb-1">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => set("published", !form.published)}
                  className={`relative w-9 rounded-full transition-colors shrink-0 ${form.published ? "bg-emerald-500" : "bg-white/[0.1]"}`}
                  style={{ height: "20px" }}>
                  <span className="absolute top-0.5 rounded-full bg-white shadow transition-transform"
                    style={{ width: "16px", height: "16px", transform: form.published ? "translateX(18px)" : "translateX(2px)" }} />
                </button>
                <span className="text-sm text-zinc-400">{form.published ? "Publié" : "Masqué"}</span>
              </div>
            </div>
          </div>
          {msg && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl">{msg}</p>}
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-white/[0.07] shrink-0">
          <button onClick={() => setPageOpen(false)} className="px-4 py-2 rounded-xl text-sm text-zinc-500 hover:text-zinc-200 border border-white/[0.06] hover:bg-white/[0.04] transition-all">Annuler</button>
          <button onClick={savePage} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 disabled:opacity-50 transition-colors">
            {saving ? <span className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" /> : <Save size={13} strokeWidth={2} />}
            Sauvegarder
          </button>
        </div>
      </Modal>

      {/* Category modal */}
      <CatModal open={catOpen} onClose={() => setCatOpen(false)}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <h2 className="text-sm font-bold text-zinc-100">{catForm.id ? "Modifier la catégorie" : "Nouvelle catégorie"}</h2>
          <button onClick={() => setCatOpen(false)} className="text-zinc-600 hover:text-zinc-300 transition-colors"><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className={labelCls}>Nom</label>
            <input className={inputCls} value={catForm.name}
              onChange={(e) => setCatForm((p) => ({ ...p, name: e.target.value, slug: p.slug || toSlug(e.target.value) }))}
              placeholder="Nom de la catégorie" />
          </div>
          <div>
            <label className={labelCls}>Slug</label>
            <input className={inputCls} value={catForm.slug} onChange={(e) => setc("slug", toSlug(e.target.value))} placeholder="nom-categorie" />
          </div>
          <div>
            <label className={labelCls}>Ordre</label>
            <input className={inputCls} type="number" value={catForm.order} onChange={(e) => setc("order", Number(e.target.value))} />
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-white/[0.07]">
          <button onClick={() => setCatOpen(false)} className="px-4 py-2 rounded-xl text-sm text-zinc-500 hover:text-zinc-200 border border-white/[0.06] hover:bg-white/[0.04] transition-all">Annuler</button>
          <button onClick={saveCat} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 disabled:opacity-50 transition-colors">
            {saving ? <span className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" /> : <Save size={13} strokeWidth={2} />}
            Sauvegarder
          </button>
        </div>
      </CatModal>
    </div>
  );
}
