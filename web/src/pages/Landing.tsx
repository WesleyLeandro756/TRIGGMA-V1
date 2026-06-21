import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";

const steps = [
  {
    n: 1,
    title: "Cadastre sua empresa",
    desc: "Configuração em minutos. Crie campanhas de indicação com regras de pontos e metas.",
  },
  {
    n: 2,
    title: "Ative seus clientes",
    desc: "Cada cliente vira um promotor da marca, com pontos a cada amigo que converte.",
  },
  {
    n: 3,
    title: "Compartilhe link + QR personalizado",
    desc: "Cada cliente recebe um link curto e QR Code próprio. Pronto para WhatsApp, stories e PDV.",
  },
  {
    n: 4,
    title: "Pontue e fidelize com recompensas",
    desc: "Converta indicações em pontos automáticos e troque por vouchers, brindes e benefícios.",
  },
];

const rewards = [
  { name: "Voucher R$ 50", pts: 500, tone: "from-blue-500 to-indigo-600" },
  { name: "Café grátis", pts: 200, tone: "from-amber-400 to-orange-500" },
  { name: "Desconto 20%", pts: 300, tone: "from-emerald-400 to-teal-500" },
  { name: "Brinde exclusivo", pts: 800, tone: "from-pink-500 to-rose-500" },
  { name: "Serviço premium", pts: 1200, tone: "from-violet-500 to-purple-600" },
  { name: "Cashback", pts: 1000, tone: "from-cyan-400 to-sky-500" },
];

const features = [
  "Configuração em minutos",
  "Funciona em qualquer dispositivo",
  "Rastreio automático ponta a ponta",
];

export function Landing() {
  return (
    <div className="min-h-screen bg-white text-brand-ink">
      <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Logo size={28} />
          <div className="flex items-center gap-3 text-sm font-semibold">
            <Link to="/portal/login" className="hidden text-slate-600 hover:text-brand-ink sm:block">
              Portal do cliente
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 hover:border-slate-300"
            >
              Entrar
            </Link>
            <Link
              to="/login?mode=register"
              className="rounded-full bg-brand-ink px-4 py-2 text-white hover:bg-slate-800"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-white to-white" />
        <div className="mx-auto max-w-6xl px-5 pt-16 pb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-indigo-700">
            Plataforma de indicação e fidelização
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Transforme clientes em{" "}
            <span className="bg-gradient-to-r from-brand-teal via-brand-blue to-brand-purple bg-clip-text text-transparent">
              promotores da marca
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            Indicação, recompensas, pontos e retenção em uma única plataforma. Cada cliente ganha
            link e QR Code personalizado para indicar e ser recompensado.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/login?mode=register"
              className="rounded-full bg-gradient-to-r from-brand-blue to-brand-purple px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-200 transition hover:opacity-95"
            >
              Começar agora — grátis por 14 dias →
            </Link>
            <Link
              to="/portal/login"
              className="rounded-full border border-slate-200 px-7 py-3.5 text-base font-bold text-slate-700 hover:border-slate-300"
            >
              Sou cliente
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-x-7 gap-y-2 text-sm font-semibold text-slate-600">
            {features.map((f) => (
              <span key={f} className="inline-flex items-center gap-2">
                <CheckIcon /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <p className="text-center text-sm font-bold uppercase tracking-widest text-indigo-600">
          Como funciona
        </p>
        <h2 className="mt-2 text-center text-3xl font-extrabold">Da indicação à recompensa</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white">
                {s.n}
              </span>
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-purple-600">
            O produto
          </p>
          <h2 className="mt-2 text-center text-3xl font-extrabold">Catálogo de recompensas</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
            Vouchers, descontos e brindes com pontos. Seus clientes resgatam direto pelo portal.
          </p>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rewards.map((r) => (
              <div
                key={r.name}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${r.tone} text-white`}
                >
                  <GiftIcon />
                </div>
                <div className="font-bold">{r.name}</div>
                <div className="mt-1 text-sm font-semibold text-brand-blue">{r.pts} pts</div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/login?mode=register"
              className="inline-block rounded-full bg-gradient-to-r from-brand-blue to-brand-purple px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-200"
            >
              Começar agora — grátis por 14 dias →
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-slate-500 sm:flex-row">
          <Logo size={22} />
          <span>© {new Date().getFullYear()} Triggma · triggma.com.br</span>
        </div>
      </footer>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 12v8a1 1 0 01-1 1H5a1 1 0 01-1-1v-8M2 7h20v5H2V7zm10 0v14M12 7S9.5 3 7.5 3 5 5 5 5s.5 2 7 2zm0 0s2.5-4 4.5-4S19 5 19 5s-.5 2-7 2z"
        stroke="white"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
