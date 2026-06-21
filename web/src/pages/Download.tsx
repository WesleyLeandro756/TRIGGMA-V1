import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

export function Download() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setDeferred(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link to="/">
          <Logo size={28} />
        </Link>
        <Link to="/portal/login" className="text-sm font-semibold text-brand-blue">
          Já tenho conta
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-20 pt-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Baixe o app Triggma</h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Instale o Triggma no celular e no notebook em segundos. Indique, acompanhe seus pontos e
            resgate recompensas onde estiver.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Mobile */}
          <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple text-xl">
                📱
              </span>
              <h2 className="text-xl font-bold">No celular</h2>
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-700">Android (Chrome)</p>
            <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-slate-600">
              <li>Abra triggma.com.br no Chrome</li>
              <li>Toque no menu ⋮ no canto superior</li>
              <li>Escolha “Adicionar à tela inicial” / “Instalar app”</li>
            </ol>
            <p className="mt-4 text-sm font-semibold text-slate-700">iPhone (Safari)</p>
            <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-slate-600">
              <li>Abra no Safari e toque em Compartilhar</li>
              <li>Escolha “Adicionar à Tela de Início”</li>
              <li>Confirme em “Adicionar”</li>
            </ol>
            <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
              Em breve também na Google Play e App Store.
            </div>
          </div>

          {/* Desktop */}
          <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-teal to-brand-blue text-xl">
                💻
              </span>
              <h2 className="text-xl font-bold">No notebook</h2>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Instale como aplicativo no Windows, macOS ou Linux (Chrome ou Edge).
            </p>
            {installed ? (
              <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                ✅ App instalado! Procure o Triggma no seu menu de aplicativos.
              </div>
            ) : deferred ? (
              <button
                onClick={install}
                className="mt-5 w-full rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple py-3 font-bold text-white shadow-lg"
              >
                Instalar no notebook
              </button>
            ) : (
              <div className="mt-5 space-y-2 text-sm text-slate-600">
                <p>Se o botão automático não aparecer, instale manualmente:</p>
                <ol className="list-decimal space-y-1 pl-5">
                  <li>Abra o site no Chrome/Edge</li>
                  <li>Clique no ícone de instalar ⊕ na barra de endereço</li>
                  <li>Confirme “Instalar”</li>
                </ol>
              </div>
            )}
            <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
              Funciona offline e abre em janela própria, como um app nativo.
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/portal/login"
            className="inline-block rounded-full bg-brand-ink px-7 py-3.5 text-base font-bold text-white"
          >
            Abrir o app agora
          </Link>
        </div>
      </main>
    </div>
  );
}
