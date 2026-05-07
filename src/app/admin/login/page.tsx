"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [show,     setShow]     = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) { router.push("/admin"); router.refresh(); }
    else setError("Mot de passe incorrect.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
      {/* Ambient glow */}
      <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%) translateY(-50%)",
          width: "600px", height: "400px",
          background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }} />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">

          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center border-b border-white/[0.06]">
            <div className="w-12 h-12 rounded-2xl bg-white mx-auto flex items-center justify-center mb-4
              shadow-[0_0_30px_rgba(255,255,255,0.15)]">
              <span className="text-[#0a0a0f] font-black text-lg">K</span>
            </div>
            <h1 className="text-lg font-bold text-zinc-100 tracking-tight">Administration</h1>
            <p className="text-zinc-600 text-xs mt-1">Connectez-vous pour accéder au panel</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.12em] block mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={13} strokeWidth={1.75}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-10 py-3 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-white/[0.2] transition-colors"
                  required
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
                  {show ? <EyeOff size={14} strokeWidth={1.75} /> : <Eye size={14} strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white text-zinc-900 text-sm font-semibold py-3 rounded-xl hover:bg-zinc-100 disabled:opacity-50 transition-colors">
              {loading ? (
                <span className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={14} strokeWidth={2} />
                  Se connecter
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
