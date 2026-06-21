import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { api, clearToken, getToken } from "../api";

type View = "dashboard" | "campaigns" | "rewards" | "conversions" | "customers";

const NAV: { id: View; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "campaigns", label: "Campanhas", icon: "📣" },
  { id: "conversions", label: "Conversões", icon: "✓" },
  { id: "rewards", label: "Recompensas", icon: "🎁" },
  { id: "customers", label: "Clientes", icon: "👥" },
];

export function CompanyApp() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("dashboard");
  const [tenant, setTenant] = useState<{ name: string; plan: string } | null>(null);

  useEffect(() => {
    if (!getToken("company")) {
      navigate("/login");
      return;
    }
    api
      .get<{ tenant: { name: string; plan: string } }>("/me", "company")
      .then((r) => setTenant(r.tenant))
      .catch(() => navigate("/login"));
  }, [navigate]);

  function logout() {
    clearToken("company");
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 shrink-0 flex-col bg-brand-ink p-5 text-slate-300 md:flex">
        <div className="mb-8">
          <Logo size={26} light />
        </div>
        <nav className="flex-1 space-y-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                view === n.id ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="w-5 text-center">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="mt-4 rounded-xl bg-white/5 p-3 text-xs">
          <div className="font-semibold text-white">{tenant?.name ?? "—"}</div>
          <div className="uppercase tracking-wide text-slate-400">Plano {tenant?.plan ?? "free"}</div>
          <button onClick={logout} className="mt-2 text-slate-400 hover:text-white">
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-4 md:hidden">
          <Logo size={24} />
          <select
            value={view}
            onChange={(e) => setView(e.target.value as View)}
            className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
          >
            {NAV.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>
        </header>
        <div className="mx-auto max-w-5xl px-6 py-8">
          {view === "dashboard" && <Dashboard />}
          {view === "campaigns" && <Campaigns />}
          {view === "conversions" && <Conversions />}
          {view === "rewards" && <Rewards />}
          {view === "customers" && <Customers />}
        </div>
      </main>
    </div>
  );
}

interface PlanInfo {
  plan: string;
  usage: { customers: number; active_campaigns: number; users: number };
  limits: { customers: number | null; active_campaigns: number | null; users: number | null };
}

function Dashboard() {
  const [data, setData] = useState<Record<string, number> | null>(null);
  const [plan, setPlan] = useState<PlanInfo | null>(null);
  useEffect(() => {
    api.get<Record<string, number>>("/dashboard", "company").then(setData);
    api.get<PlanInfo>("/plan", "company").then(setPlan);
  }, []);
  const cards = [
    { label: "Clientes ativos", key: "customers", tone: "text-brand-blue" },
    { label: "Campanhas ativas", key: "active_campaigns", tone: "text-brand-purple" },
    { label: "Indicações (leads)", key: "leads", tone: "text-amber-500" },
    { label: "Conversões", key: "conversions", tone: "text-emerald-500" },
    { label: "Pontos distribuídos", key: "points_distributed", tone: "text-teal-500" },
    { label: "Resgates", key: "redemptions", tone: "text-rose-500" },
  ];
  return (
    <div>
      <PageTitle title="Dashboard" subtitle="Visão geral do seu programa de indicação" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.key} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="text-sm font-medium text-slate-500">{c.label}</div>
            <div className={`mt-2 text-3xl font-extrabold ${c.tone}`}>
              {data ? (data[c.key] ?? 0).toLocaleString("pt-BR") : "—"}
            </div>
          </div>
        ))}
      </div>
      {plan && <PlanUsage plan={plan} />}
    </div>
  );
}

function PlanUsage({ plan }: { plan: PlanInfo }) {
  const rows: { label: string; used: number; limit: number | null }[] = [
    { label: "Clientes", used: plan.usage.customers, limit: plan.limits.customers },
    { label: "Campanhas ativas", used: plan.usage.active_campaigns, limit: plan.limits.active_campaigns },
    { label: "Usuários", used: plan.usage.users, limit: plan.limits.users },
  ];
  return (
    <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">Uso do plano</h2>
        <span className="rounded-full bg-brand-ink px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
          {plan.plan}
        </span>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {rows.map((r) => {
          const pct = r.limit ? Math.min(100, Math.round((r.used / r.limit) * 100)) : 0;
          return (
            <div key={r.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-600">{r.label}</span>
                <span className="text-slate-500">
                  {r.used.toLocaleString("pt-BR")} / {r.limit === null ? "∞" : r.limit.toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${pct >= 100 ? "bg-red-500" : "bg-gradient-to-r from-brand-blue to-brand-purple"}`}
                  style={{ width: r.limit === null ? "12%" : `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface Campaign {
  id: string;
  name: string;
  reward_description: string | null;
  points_per_conversion: number;
  goal: number;
  status: string;
  conversions: number;
}

const emptyCampaign = { name: "", reward_description: "", points_per_conversion: 100, goal: 200 };

function Campaigns() {
  const [items, setItems] = useState<Campaign[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyCampaign });
  const [err, setErr] = useState("");
  const [notice, setNotice] = useState("");

  const load = () => api.get<Campaign[]>("/campaigns", "company").then(setItems);
  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyCampaign });
    setErr("");
    setOpen(true);
  }
  function openEdit(c: Campaign) {
    setEditingId(c.id);
    setForm({
      name: c.name,
      reward_description: c.reward_description ?? "",
      points_per_conversion: c.points_per_conversion,
      goal: c.goal,
    });
    setErr("");
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      if (editingId) {
        await api.patch(`/campaigns/${editingId}`, form, "company");
      } else {
        await api.post("/campaigns", form, "company");
      }
      setOpen(false);
      setEditingId(null);
      setForm({ ...emptyCampaign });
      load();
    } catch (e2) {
      setErr(translateError((e2 as Error).message));
    }
  }

  async function toggle(c: Campaign) {
    setNotice("");
    try {
      await api.patch(`/campaigns/${c.id}`, { status: c.status === "active" ? "paused" : "active" }, "company");
      load();
    } catch (e) {
      setNotice(translateError((e as Error).message));
    }
  }

  async function remove(c: Campaign) {
    setNotice("");
    try {
      await api.del(`/campaigns/${c.id}`, "company");
      load();
    } catch (e) {
      setNotice(translateError((e as Error).message));
    }
  }

  return (
    <div>
      <PageTitle
        title="Campanhas de Indicação"
        subtitle="Crie, gerencie e acompanhe o desempenho das suas campanhas de indicação."
        action={
          <button onClick={openCreate} className="rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-bold text-white shadow">
            + Nova campanha
          </button>
        }
      />

      {notice && <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">{notice}</p>}

      {open && (
        <form onSubmit={save} className="mb-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 font-bold">{editingId ? "Editar campanha" : "Nova campanha"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Input
              label="Descrição da recompensa"
              value={form.reward_description}
              onChange={(v) => setForm({ ...form, reward_description: v })}
              required={false}
            />
            <Input
              label="Pontos por conversão"
              type="number"
              value={String(form.points_per_conversion)}
              onChange={(v) => setForm({ ...form, points_per_conversion: Number(v) })}
            />
            <Input
              label="Meta de conversões"
              type="number"
              value={String(form.goal)}
              onChange={(v) => setForm({ ...form, goal: Number(v) })}
            />
          </div>
          {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
          <div className="mt-4 flex gap-2">
            <button className="rounded-xl bg-brand-ink px-5 py-2.5 text-sm font-bold text-white">Salvar</button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {items.map((c) => {
          const pct = Math.min(100, Math.round((c.conversions / Math.max(1, c.goal)) * 100));
          return (
            <div
              key={c.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{c.name}</span>
                  <StatusPill status={c.status} />
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {c.points_per_conversion} pontos por conversão · meta {c.goal}
                </div>
                <div className="mt-3 h-2 w-full max-w-md overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-purple"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-slate-500">{pct}% da meta</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-brand-blue">{c.conversions}</div>
                <div className="text-xs text-slate-500">Conversões</div>
                <div className="mt-2 flex flex-wrap justify-end gap-1.5">
                  <button
                    onClick={() => toggle(c)}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-slate-300"
                  >
                    {c.status === "active" ? "Pausar" : "Ativar"}
                  </button>
                  <button
                    onClick={() => openEdit(c)}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-slate-300"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => remove(c)}
                    className="rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:border-red-300"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface Lead {
  id: string;
  name: string;
  status: string;
  campaign_name: string;
  referrer_name: string | null;
}

function Conversions() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [msg, setMsg] = useState("");
  const load = () => api.get<Lead[]>("/leads", "company").then(setLeads);
  useEffect(() => {
    load();
  }, []);

  async function convert(id: string) {
    setMsg("");
    try {
      await api.post(`/leads/${id}/convert`, {}, "company");
      setMsg("Conversão registrada e pontos creditados ao indicador!");
      load();
    } catch (e) {
      setMsg((e as Error).message === "already_converted" ? "Lead já convertido." : "Erro.");
    }
  }

  return (
    <div>
      <PageTitle title="Conversões" subtitle="Funil de indicações. Marque leads como convertidos para creditar pontos." />
      {msg && <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">{msg}</p>}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Lead</th>
              <th className="px-5 py-3">Indicado por</th>
              <th className="px-5 py-3">Campanha</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((l) => (
              <tr key={l.id}>
                <td className="px-5 py-3 font-semibold">{l.name}</td>
                <td className="px-5 py-3 text-slate-600">{l.referrer_name ?? "—"}</td>
                <td className="px-5 py-3 text-slate-600">{l.campaign_name}</td>
                <td className="px-5 py-3">
                  <StatusPill status={l.status} />
                </td>
                <td className="px-5 py-3 text-right">
                  {l.status !== "converted" && (
                    <button
                      onClick={() => convert(l.id)}
                      className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white"
                    >
                      Converter
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface Reward {
  id: string;
  name: string;
  reward_type: string;
  points_required: number;
  quantity_available: number;
}

const emptyReward = { name: "", points_required: 300, reward_type: "discount", quantity_available: 100 };

function Rewards() {
  const [items, setItems] = useState<Reward[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyReward });
  const [notice, setNotice] = useState("");
  const load = () => api.get<Reward[]>("/rewards", "company").then(setItems);
  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyReward });
    setOpen(true);
  }
  function openEdit(r: Reward) {
    setEditingId(r.id);
    setForm({
      name: r.name,
      points_required: r.points_required,
      reward_type: r.reward_type,
      quantity_available: r.quantity_available,
    });
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) await api.patch(`/rewards/${editingId}`, form, "company");
    else await api.post("/rewards", form, "company");
    setOpen(false);
    setEditingId(null);
    setForm({ ...emptyReward });
    load();
  }

  async function remove(r: Reward) {
    setNotice("");
    try {
      await api.del(`/rewards/${r.id}`, "company");
      load();
    } catch (e) {
      setNotice(translateError((e as Error).message));
    }
  }

  return (
    <div>
      <PageTitle
        title="Catálogo de Recompensas"
        subtitle="Troque pontos por recompensas incríveis."
        action={
          <button onClick={openCreate} className="rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-bold text-white shadow">
            + Nova recompensa
          </button>
        }
      />
      {notice && <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">{notice}</p>}
      {open && (
        <form onSubmit={save} className="mb-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 font-bold">{editingId ? "Editar recompensa" : "Nova recompensa"}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input label="Nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Input
              label="Pontos necessários"
              type="number"
              value={String(form.points_required)}
              onChange={(v) => setForm({ ...form, points_required: Number(v) })}
            />
            <Input
              label="Estoque"
              type="number"
              value={String(form.quantity_available)}
              onChange={(v) => setForm({ ...form, quantity_available: Number(v) })}
            />
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">Tipo</span>
              <select
                value={form.reward_type}
                onChange={(e) => setForm({ ...form, reward_type: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5"
              >
                <option value="discount">Desconto</option>
                <option value="product">Produto</option>
                <option value="service">Serviço</option>
                <option value="benefit">Benefício</option>
              </select>
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="rounded-xl bg-brand-ink px-5 py-2.5 text-sm font-bold text-white">Salvar</button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((r) => (
          <div key={r.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple text-white">
              🎁
            </div>
            <div className="font-bold">{r.name}</div>
            <div className="mt-1 text-sm font-semibold text-brand-blue">{r.points_required} pts</div>
            <div className="mt-1 text-xs text-slate-500">
              {r.quantity_available} disponíveis · {r.reward_type}
            </div>
            <div className="mt-3 flex gap-1.5">
              <button
                onClick={() => openEdit(r)}
                className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-slate-300"
              >
                Editar
              </button>
              <button
                onClick={() => remove(r)}
                className="rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:border-red-300"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Customer {
  id: string;
  name: string;
  email: string | null;
  whatsapp: string | null;
  referral_code: string;
  points_balance: number;
}

function Customers() {
  const [items, setItems] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "" });
  const [err, setErr] = useState("");
  const load = () => api.get<Customer[]>("/customers", "company").then(setItems);
  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm({ name: "", email: "", whatsapp: "" });
    setErr("");
    setOpen(true);
  }
  function openEdit(c: Customer) {
    setEditingId(c.id);
    setForm({ name: c.name, email: c.email ?? "", whatsapp: c.whatsapp ?? "" });
    setErr("");
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      if (editingId) await api.patch(`/customers/${editingId}`, form, "company");
      else await api.post("/customers", form, "company");
      setOpen(false);
      setEditingId(null);
      setForm({ name: "", email: "", whatsapp: "" });
      load();
    } catch (e2) {
      setErr(translateError((e2 as Error).message));
    }
  }

  return (
    <div>
      <PageTitle
        title="Clientes"
        subtitle="Seus promotores. Cada um possui código e link de indicação."
        action={
          <button onClick={openCreate} className="rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-bold text-white shadow">
            + Novo cliente
          </button>
        }
      />
      {open && (
        <form onSubmit={save} className="mb-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 font-bold">{editingId ? "Editar cliente" : "Novo cliente"}</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Input label="E-mail" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required={false} />
            <Input label="WhatsApp" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} required={false} />
          </div>
          {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
          <div className="mt-4 flex gap-2">
            <button className="rounded-xl bg-brand-ink px-5 py-2.5 text-sm font-bold text-white">Salvar</button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Código</th>
              <th className="px-5 py-3">Contato</th>
              <th className="px-5 py-3 text-right">Pontos</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((c) => (
              <tr key={c.id}>
                <td className="px-5 py-3 font-semibold">{c.name}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{c.referral_code}</td>
                <td className="px-5 py-3 text-slate-600">{c.email ?? c.whatsapp ?? "—"}</td>
                <td className="px-5 py-3 text-right font-bold text-brand-blue">{c.points_balance}</td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => openEdit(c)}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-slate-300"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* shared bits */

function translateError(code: string): string {
  const map: Record<string, string> = {
    plan_limit: "Limite do plano atingido. Faça upgrade para continuar.",
    duplicate_email: "E-mail já cadastrado.",
    end_before_start: "A data final não pode ser anterior à inicial.",
    campaign_in_use: "Não é possível excluir: a campanha já possui leads/conversões.",
    reward_in_use: "Não é possível excluir: a recompensa já possui resgates.",
    name_required: "Informe um nome.",
    missing_fields: "Preencha os campos obrigatórios.",
  };
  return map[code] ?? "Ocorreu um erro. Tente novamente.";
}

function PageTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700",
    paused: "bg-amber-100 text-amber-700",
    converted: "bg-emerald-100 text-emerald-700",
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-amber-100 text-amber-700",
    draft: "bg-slate-100 text-slate-600",
  };
  const label: Record<string, string> = {
    active: "Ativa",
    paused: "Pausada",
    converted: "Convertido",
    new: "Novo",
    contacted: "Contatado",
    draft: "Rascunho",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${map[status] ?? "bg-slate-100 text-slate-600"}`}>
      {label[status] ?? status}
    </span>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-brand-blue focus:ring-2 focus:ring-indigo-100"
        required={required}
      />
    </label>
  );
}
