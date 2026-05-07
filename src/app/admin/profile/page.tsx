"use client";

import { useState, useEffect } from "react";
import { User, MapPin, Mail, AtSign, Link2, Globe, ImageIcon, Save, Check, AlertCircle, FileText } from "lucide-react";

interface Profile {
  name: string; title: string; bio: string; longBio: string;
  location: string; email: string; github: string; twitter: string;
  linkedin: string; website: string; avatar: string;
}

const EMPTY: Profile = {
  name: "", title: "", bio: "", longBio: "", location: "",
  email: "", github: "", twitter: "", linkedin: "", website: "", avatar: "",
};

function Field({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.12em] mb-2">
        <Icon size={11} strokeWidth={1.75} />
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-white/[0.2] transition-colors";
const textareaCls = inputCls + " resize-none";

export default function AdminProfilePage() {
  const [form, setForm] = useState<Profile>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [status,  setStatus]  = useState<"idle" | "ok" | "err">("idle");

  useEffect(() => {
    fetch("/api/admin/profile").then((r) => r.json()).then((d) => {
      setForm({
        name: d.name ?? "", title: d.title ?? "", bio: d.bio ?? "",
        longBio: d.longBio ?? "", location: d.location ?? "",
        email: d.email ?? "", github: d.github ?? "",
        twitter: d.twitter ?? "", linkedin: d.linkedin ?? "",
        website: d.website ?? "", avatar: d.avatar ?? "",
      });
      setLoading(false);
    });
  }, []);

  function set(key: keyof Profile, val: string) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  async function save() {
    setSaving(true); setStatus("idle");
    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setStatus(res.ok ? "ok" : "err");
    setTimeout(() => setStatus("idle"), 3000);
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-zinc-600 text-sm">
        <span className="w-4 h-4 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
        Chargement...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User size={14} strokeWidth={1.75} className="text-zinc-500" />
            <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.14em]">Profil</p>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Mon profil</h1>
          <p className="text-zinc-600 text-sm mt-1">Informations affichées sur le portfolio.</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 disabled:opacity-50 transition-colors">
          {saving ? (
            <span className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
          ) : status === "ok" ? (
            <Check size={14} strokeWidth={2.5} className="text-emerald-600" />
          ) : status === "err" ? (
            <AlertCircle size={14} strokeWidth={2} className="text-red-500" />
          ) : (
            <Save size={13} strokeWidth={2} />
          )}
          {status === "ok" ? "Sauvegardé" : status === "err" ? "Erreur" : "Sauvegarder"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column — main info */}
        <div className="space-y-4 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.14em] mb-5">Informations principales</p>
          <Field label="Nom" icon={User}>
            <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Karl Dupont" />
          </Field>
          <Field label="Titre / Poste" icon={FileText}>
            <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Développeur Full Stack" />
          </Field>
          <Field label="Bio courte" icon={FileText}>
            <textarea className={textareaCls} rows={2} value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Une phrase de présentation..." />
          </Field>
          <Field label="À propos (longue)" icon={FileText}>
            <textarea className={textareaCls} rows={5} value={form.longBio} onChange={(e) => set("longBio", e.target.value)} placeholder="Description longue..." />
          </Field>
          <Field label="Localisation" icon={MapPin}>
            <input className={inputCls} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Paris, France" />
          </Field>
          <Field label="URL photo de profil" icon={ImageIcon}>
            <input className={inputCls} value={form.avatar} onChange={(e) => set("avatar", e.target.value)} placeholder="https://..." />
          </Field>
        </div>

        {/* Right column — contacts */}
        <div className="space-y-4 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.14em] mb-5">Contacts &amp; réseaux</p>
          <Field label="Email" icon={Mail}>
            <input className={inputCls} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="karl@example.com" />
          </Field>
          <Field label="GitHub (pseudo)" icon={AtSign}>
            <input className={inputCls} value={form.github} onChange={(e) => set("github", e.target.value)} placeholder="username" />
          </Field>
          <Field label="Twitter (pseudo)" icon={AtSign}>
            <input className={inputCls} value={form.twitter} onChange={(e) => set("twitter", e.target.value)} placeholder="@username" />
          </Field>
          <Field label="LinkedIn (URL)" icon={Link2}>
            <input className={inputCls} value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." />
          </Field>
          <Field label="Site web" icon={Globe}>
            <input className={inputCls} value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://..." />
          </Field>
        </div>
      </div>
    </div>
  );
}
