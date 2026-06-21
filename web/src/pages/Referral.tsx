import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Logo } from "../components/Logo";
import { api } from "../api";

interface Info {
  tenant: { name: string };
  campaign: { name: string; reward_description: string | null };
  referrer: { name: string };
}

export function Referral() {
  const { slug } = useParams();
  const [info, setInfo] = useState<Info | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState({ name: "", whatsapp: "", email: "" });
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    api
      .get<Info>(`/r/${slug}`)
      .then(setInfo)
      .catch(() => setNotFound(true));
  }, [slug]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      await api.post(`/r/${slug}/lead`, form);
      setDone(true);
    } catch (e2) {
      setErr((e2 as Error).message === "duplicate_lead" ? "Você já se cadastrou nesta campanha." : "Erro ao enviar.");
    }
  }

  if (notFound)
    return (
      <Centered>
        <p className="text-slate-500">Link de indicação não encontrado.</p>
      </Centered>
    );
  if (!info)
    return (
      <Centered>
        <p className="text-slate-400">Carregando…</p>
      </Centered>
    );

  return (
    <Centered>
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
        <Logo size={28} />
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand-blue">
          {info.tenant.name}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold">
          {info.referrer.name} te indicou! 🎉
        </h1>
        <p className="mt-2 text-slate-600">
          Campanha <strong>{info.campaign.name}</strong>. Deixe seus dados e a empresa entra em
          contato.
        </p>

        {done ? (
          <div className="mt-6 rounded-2xl bg-emerald-50 p-5 text-center">
            <div className="text-3xl">✅</div>
            <p className="mt-2 font-bold text-emerald-700">Cadastro enviado!</p>
            <p className="text-sm text-emerald-600">Em breve você será contatado.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label="Nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field label="WhatsApp" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} />
            <Field label="E-mail" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            {err && <p className="text-sm text-red-600">{err}</p>}
            <button className="w-full rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple py-3 font-bold text-white shadow-lg">
              Quero participar
            </button>
          </form>
        )}
      </div>
    </Centered>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-5">
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-brand-blue focus:ring-2 focus:ring-indigo-100"
      />
    </label>
  );
}
