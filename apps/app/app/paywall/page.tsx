import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export const metadata = { title: "Planos — MatchGoal" };

const ABACATE_LINK = "https://app.abacatepay.com/pay/bill_BUSBLcqdYfCSpSXywWwcwXfY";

const features = [
  { icon: "⚽", label: "104 partidas da Copa 2026" },
  { icon: "🤖", label: "Análise com IA por jogo" },
  { icon: "📊", label: "Probabilidades por mercado" },
  { icon: "🎯", label: "Bilhetes montados pela IA" },
  { icon: "🏆", label: "Tabela e leituras dos grupos" },
  { icon: "🖼️", label: "Imagens compartilháveis" },
];

const lockedMessages: Record<string, string> = {
  matches: "Assine o Pro Copa para liberar a análise das partidas.",
  grupos: "Assine o Pro Copa para liberar a tabela e leituras dos grupos.",
};

export default async function PaywallPage({
  searchParams,
}: {
  searchParams: Promise<{ locked?: string }>;
}) {
  const { locked } = await searchParams;
  const lockedMessage = locked ? lockedMessages[locked] : undefined;

  return (
    <AppShell active="paywall">
      {lockedMessage && (
        <div className="lock-banner">
          <span className="lock-banner__icon">🔒</span>
          <span className="lock-banner__text">
            <strong>Acesso bloqueado.</strong> {lockedMessage}
          </span>
        </div>
      )}

      {/* Hero laranja */}
      <section className="hero rise" style={{ marginBottom: "var(--space-8)" }}>
        <div className="hero__inner" style={{ gridTemplateColumns: "1fr" }}>
          <div>
            <span className="hero__eyebrow">⚡ Desbloqueie a Copa inteira</span>
            <h1 className="hero__title">
              Análise sem limites<br /><span>da Copa 2026</span>
            </h1>
            <p className="hero__sub">
              Leitura estatística com IA para cada partida. Dados reais —
              nunca promessa de resultado.
            </p>
          </div>
        </div>
      </section>

      {/* Card de preço + features */}
      <div style={{ maxWidth: 520, margin: "0 auto" }}>

        {/* Features grid acima do card */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "var(--space-2)",
          marginBottom: "var(--space-5)",
        }}>
          {features.map((f) => (
            <div key={f.label} className="card" style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 12px",
            }}>
              <span style={{ fontSize: 18 }}>{f.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text)" }}>{f.label}</span>
            </div>
          ))}
        </div>

        {/* Card de preço */}
        <article className="card plan plan--featured">
          <span className="badge badge--primary" style={{ alignSelf: "flex-start", marginBottom: 12 }}>
            Acesso completo
          </span>
          <h2 className="plan__name">Pro Copa</h2>
          <p className="plan__price">
            R$ 29<small>,90 / mês</small>
          </p>
          <ul className="plan__features">
            <li>Todas as 104 partidas da Copa 2026</li>
            <li>Análises premium ilimitadas</li>
            <li>Novos cenários a cada rodada</li>
            <li>Bilhetes e imagens sem limite</li>
            <li>Tabela e leituras dos grupos</li>
            <li>Cancela quando quiser</li>
          </ul>
          <a
            href={ABACATE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary btn--block plan__cta"
          >
            Assinar agora
          </a>
          <p className="muted" style={{ fontSize: 12, textAlign: "center", marginTop: "var(--space-3)" }}>
            PIX ou cartão · Acesso imediato após pagamento
          </p>
        </article>

        <p className="muted" style={{ textAlign: "center", fontSize: 13, marginTop: "var(--space-4)" }}>
          Já pagou?{" "}
          <Link href="/login" style={{ color: "var(--color-primary-strong)", fontWeight: 700 }}>
            Acesse sua conta →
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
