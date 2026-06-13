import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ABACATE_CHECKOUT } from "@/lib/links";

export const metadata = { title: "Planos — MatchGoal" };

const features = [
  { icon: "⚽", label: "104 partidas da Copa 2026" },
  { icon: "🤖", label: "Análise com IA por jogo" },
  { icon: "📊", label: "Probabilidades por mercado" },
  { icon: "🟨", label: "Mercados avançados: cartões e escanteios" },
  { icon: "⭐", label: "Destaques de jogadores com embasamento" },
  { icon: "🎯", label: "Bilhetes montados pela IA" },
  { icon: "🏆", label: "Tabela e leituras dos grupos" },
  { icon: "🖼️", label: "Imagens compartilháveis" },
];

export default function PaywallPage() {
  return (
    <AppShell active="paywall">
      {/* Hero laranja */}
      <section className="hero rise" style={{ marginBottom: "var(--space-8)" }}>
        <div className="hero__inner" style={{ gridTemplateColumns: "1fr" }}>
          <div>
            <span className="hero__eyebrow">⚡ Desbloqueie a Copa inteira</span>
            <h1 className="hero__title">
              Análise sem limites<br />
              <span>da Copa 2026</span>
            </h1>
            <p className="hero__sub">
              Leitura estatística com IA para cada partida. Dados reais — nunca
              promessa de resultado.
            </p>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 540, margin: "0 auto" }}>
        {/* Features */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-2)",
            marginBottom: "var(--space-5)",
          }}
        >
          {features.map((f) => (
            <div
              key={f.label}
              className="card"
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px" }}
            >
              <span style={{ fontSize: 18 }}>{f.icon}</span>
              <span style={{ fontSize: 12.5, fontWeight: 700 }}>{f.label}</span>
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
            <li>Cancela quando quiser</li>
          </ul>
          <a
            href={ABACATE_CHECKOUT}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary btn--block plan__cta"
          >
            Assinar agora →
          </a>
          <p className="muted" style={{ fontSize: 12, textAlign: "center", marginTop: "var(--space-3)" }}>
            PIX ou cartão · Acesso imediato após o pagamento
          </p>
        </article>

        <p className="muted" style={{ textAlign: "center", fontSize: 13, marginTop: "var(--space-4)" }}>
          Já assinou?{" "}
          <Link href="/login" style={{ color: "var(--color-primary-strong)", fontWeight: 700 }}>
            Acesse sua conta →
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
