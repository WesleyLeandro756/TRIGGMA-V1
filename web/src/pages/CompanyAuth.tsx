import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Logo } from "../components/Logo";
import { api, setToken } from "../api";

export function CompanyAuth() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">(
    params.get("mode") === "register" ? "register" : "login",
  );
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("triggma123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const path = mode === "register" ? "/auth/register-company" : "/auth/login";
      const body =
        mode === "register"
          ? { companyName, name, document, email, password }
          : { email, password };
      const res = await api.post<{ token: string }>(path, body);
      setToken("company", res.token);
      navigate("/app");
    } catch (err) {
      const code = (err as Error).message;
      const messages: Record<string, string> = {
        invalid_credentials: "E-mail ou senha inválidos.",
        invalid_document: "CNPJ/CPF inválido. Confira os dígitos.",
        document_in_use: "Este CNPJ/CPF já está cadastrado.",
      };
      setError(messages[code] ?? "Não foi possível concluir. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-5">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
        <Link to="/" className="flex justify-center">
          <Logo size={30} />
        </Link>
        <h1 className="mt-6 text-center text-2xl font-extrabold">
          {mode === "register" ? "Criar conta da empresa" : "Entrar no painel"}
        </h1>
        <p className="mt-1 text-center text-sm text-slate-500">
          {mode === "register"
            ? "Comece grátis. Configure em minutos."
            : "Acesse o painel de campanhas e recompensas."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "register" && (
            <>
              <Field label="Nome da empresa" value={companyName} onChange={setCompanyName} placeholder="Minha Loja" />
              <Field label="Seu nome" value={name} onChange={setName} placeholder="Maria Silva" />
              <Field label="CNPJ ou CPF" value={document} onChange={setDocument} placeholder="00.000.000/0001-00" />
            </>
          )}
          <Field label="E-mail" type="email" value={email} onChange={setEmail} placeholder="voce@empresa.com" />
          <Field label="Senha" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple py-3 font-bold text-white shadow-lg shadow-indigo-200 disabled:opacity-60"
          >
            {loading ? "Aguarde…" : mode === "register" ? "Criar conta grátis" : "Entrar"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-slate-500">
          {mode === "register" ? (
            <button onClick={() => setMode("login")} className="font-semibold text-brand-blue">
              Já tenho conta — Entrar
            </button>
          ) : (
            <button onClick={() => setMode("register")} className="font-semibold text-brand-blue">
              Criar conta grátis
            </button>
          )}
        </div>
        {mode === "login" && (
          <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-center text-xs text-slate-500">
            Demo: admin@demo.com / triggma123
          </p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-brand-blue focus:ring-2 focus:ring-indigo-100"
        required
      />
    </label>
  );
}
