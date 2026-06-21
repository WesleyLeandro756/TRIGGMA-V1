import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { QRCode } from "../components/QRCode";
import { api, clearToken, getToken } from "../api";

interface Me {
  customer: { id: string; name: string; points_balance: number; referral_code: string };
  tenant: { name: string; slug: string };
  referralSlug: string | null;
  referrals: { name: string; status: string; converted_at: string | null }[];
}
interface Reward {
  id: string;
  name: string;
  points_required: number;
  reward_type: string;
}
interface Redemption {
  voucher_code: string;
  status: string;
  reward_name: string;
  points_required: number;
}

export function Portal() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"indique" | "recompensas">("indique");
  const [me, setMe] = useState<Me | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [msg, setMsg] = useState("");
  const [lastVoucher, setLastVoucher] = useState<string | null>(null);

  function load() {
    api.get<Me>("/customer/me", "customer").then(setMe).catch(() => navigate("/portal/login"));
    api.get<Reward[]>("/customer/rewards", "customer").then(setRewards);
    api.get<Redemption[]>("/customer/redemptions", "customer").then(setRedemptions);
  }

  useEffect(() => {
    if (!getToken("customer")) {
      navigate("/portal/login");
      return;
    }
    load();
  }, []);

  async function redeem(r: Reward) {
    setMsg("");
    setLastVoucher(null);
    try {
      const res = await api.post<{ voucher_code: string }>(
        `/customer/rewards/${r.id}/redeem`,
        {},
        "customer",
      );
      setLastVoucher(res.voucher_code);
      setMsg(`Resgate confirmado: ${r.name}`);
      load();
    } catch (e) {
      setMsg(
        (e as Error).message === "insufficient_points"
          ? "Pontos insuficientes para este resgate."
          : "Não foi possível resgatar.",
      );
    }
  }

  if (!me) return <div className="flex min-h-screen items-center justify-center text-slate-400">Carregando…</div>;

  const link = me.referralSlug ? `${window.location.origin}/r/${me.referralSlug}` : "";
  const waText = encodeURIComponent(
    `Olá! Conheça ${me.tenant.name} e ganhe vantagens. Use meu link: ${link}`,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-blue/10 to-purple-100/40 pb-16">
      <header className="bg-gradient-to-r from-brand-blue to-brand-purple px-5 py-4 text-white">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <Logo size={24} light />
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-bold">
              ⭐ {me.customer.points_balance} pts
            </span>
            <button
              onClick={() => {
                clearToken("customer");
                navigate("/portal/login");
              }}
              className="text-sm text-white/80"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-md px-5">
        <div className="mt-5 flex rounded-2xl bg-white p-1 shadow-sm">
          <TabButton active={tab === "indique"} onClick={() => setTab("indique")}>
            Indique
          </TabButton>
          <TabButton active={tab === "recompensas"} onClick={() => setTab("recompensas")}>
            Recompensas
          </TabButton>
        </div>

        {tab === "indique" && (
          <div className="mt-5 space-y-5">
            <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
              <h1 className="text-xl font-extrabold">Meus Indicados</h1>
              <p className="mt-1 text-sm text-slate-500">
                Compartilhe seu link ou QR Code e ganhe pontos a cada amigo que se tornar cliente.
              </p>
              <p className="mt-4 text-sm font-bold text-brand-blue">Seu QR Code personalizado</p>
              <div className="mt-3 flex justify-center">
                {link ? <QRCode value={link} size={200} /> : <span className="text-sm text-slate-400">Sem campanha ativa</span>}
              </div>
              {link && (
                <div className="mt-4 truncate rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  {link}
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => navigator.clipboard?.writeText(link)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-700"
                >
                  Copiar link
                </button>
                <a
                  href={`https://wa.me/?text=${waText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-[1.4] rounded-xl bg-[#25D366] py-2.5 text-center text-sm font-bold text-white"
                >
                  Compartilhar no WhatsApp
                </a>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="font-bold">Amigos que se tornaram clientes</h2>
              <div className="mt-3 space-y-2">
                {me.referrals.filter((r) => r.status === "converted").length === 0 && (
                  <p className="text-sm text-slate-400">Nenhuma conversão ainda.</p>
                )}
                {me.referrals
                  .filter((r) => r.status === "converted")
                  .map((r, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                      <div>
                        <div className="font-semibold">{r.name}</div>
                        <div className="text-xs text-slate-500">
                          Convertido {r.converted_at ? `em ${r.converted_at.slice(0, 10)}` : ""}
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        +50 pts
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {tab === "recompensas" && (
          <div className="mt-5 space-y-5">
            {msg && (
              <p className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-brand-ink shadow-sm">{msg}</p>
            )}
            {lastVoucher && (
              <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
                <p className="text-sm font-bold text-emerald-600">Voucher gerado!</p>
                <div className="mt-2 font-mono text-lg font-extrabold tracking-wider">{lastVoucher}</div>
                <div className="mt-3 flex justify-center">
                  <QRCode value={lastVoucher} size={150} />
                </div>
              </div>
            )}
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="font-bold">Catálogo de Recompensas</h2>
              <p className="text-sm text-slate-500">Saldo: {me.customer.points_balance} pts</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {rewards.map((r) => {
                  const canRedeem = me.customer.points_balance >= r.points_required;
                  return (
                    <div key={r.id} className="rounded-2xl border border-slate-100 p-4">
                      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple text-white">
                        🎁
                      </div>
                      <div className="text-sm font-bold leading-tight">{r.name}</div>
                      <div className="mt-1 text-xs font-semibold text-brand-blue">{r.points_required} pts</div>
                      <button
                        onClick={() => redeem(r)}
                        disabled={!canRedeem}
                        className={`mt-3 w-full rounded-lg py-1.5 text-xs font-bold ${
                          canRedeem ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {canRedeem ? "Resgatar" : "Sem saldo"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {redemptions.length > 0 && (
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <h2 className="font-bold">Meus resgates</h2>
                <div className="mt-3 space-y-2">
                  {redemptions.map((r, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                      <div>
                        <div className="font-semibold">{r.reward_name}</div>
                        <div className="font-mono text-xs text-slate-500">{r.voucher_code}</div>
                      </div>
                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${
        active ? "bg-brand-ink text-white" : "text-slate-500"
      }`}
    >
      {children}
    </button>
  );
}
