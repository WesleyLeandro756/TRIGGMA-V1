import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { api, setToken } from "../api";

export function PortalAuth() {
  const navigate = useNavigate();
  const [tenantSlug, setTenantSlug] = useState("demo");
  const [referralCode, setReferralCode] = useState("JOAO01");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post<{ token: string }>("/auth/customer-login", {
        tenantSlug,
        referralCode,
      });
      setToken("customer", res.token);
      navigate("/portal");
    } catch {
      setError("Empresa ou código inválido.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-blue via-indigo-600 to-brand-purple px-5">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <Link to="/" className="flex justify-center">
          <Logo size={30} />
        </Link>
        <h1 className="mt-6 text-center text-2xl font-extrabold">Portal do cliente</h1>
        <p className="mt-1 text-center text-sm text-slate-500">
          Acesse seus pontos, link de indicação e recompensas.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Empresa</span>
            <input
              value={tenantSlug}
              onChange={(e) => setTenantSlug(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-brand-blue focus:ring-2 focus:ring-indigo-100"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Seu código</span>
            <input
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 font-mono outline-none focus:border-brand-blue focus:ring-2 focus:ring-indigo-100"
              required
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple py-3 font-bold text-white shadow-lg disabled:opacity-60"
          >
            {loading ? "Aguarde…" : "Entrar"}
          </button>
        </form>
        <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-center text-xs text-slate-500">
          Demo: empresa <strong>demo</strong> · código <strong>JOAO01</strong>
        </p>
      </div>
    </div>
  );
}
