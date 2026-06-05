import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export const metadata = {
  title: "Planos — MatchGoal",
};

const plans = [
  {
    name: "Por análise",
    price: "R$ 9",
    unit: "/ análise",
    featured: false,
    cta: "Comprar análise",
    features: [
      "Acesso a 1 partida premium",
      "Todas as probabilidades e cenários",
      "Bilhetes sugeridos pela IA",
      "Imagem compartilhável",
    ],
  },
  {
    name: "Pro Copa",
    price: "R$ 39",
    unit: "/ mês",
    featured: true,
    cta: "Assinar agora",
    features: [
      "Todas as 104 partidas da Copa 2026",
      "Análises premium ilimitadas",
      "Novos cenários a cada rodada",
      "Bilhetes e imagens sem limite",
      "Tabela e leituras dos grupos",
      "Cancela quando quiser",
    ],
  },
];

export default function PaywallPage() {
  return (
    <AppShell>
      <section className="hero rise" style={{ marginBottom: "var(--space-6)" }}>
        <div className="hero__inner" style={{ gridTemplateColumns: "1fr" }}>
          <div>
            <span className="hero__eyebrow">⚡ Desbloqueie a Copa inteira</span>
            <h1 className="hero__title">Análise sem limites<br /><span>da Copa 2026</span></h1>
            <p className="hero__sub">
              Leitura estatística com IA para cada partida. Análise de dados —
              nunca promessa de resultado.
            </p>
          </div>
        </div>
      </section>

      <div className="paywall-grid">
        {plans.map((p) => (
          <article key={p.name} className={`card plan${p.featured ? " plan--featured" : ""}`}>
            {p.featured && (
              <span className="badge badge--primary" style={{ alignSelf: "flex-start", marginBottom: 8 }}>
                Mais popular
              </span>
            )}
            <h2 className="plan__name">{p.name}</h2>
            <p className="plan__price">
              {p.price}
              <small>{p.unit}</small>
            </p>
            <ul className="plan__features">
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button
              type="button"
              className={`btn ${p.featured ? "btn--primary" : "btn--ghost"} btn--block plan__cta`}
            >
              {p.cta}
            </button>
          </article>
        ))}
      </div>

      <p className="muted" style={{ textAlign: "center", fontSize: 13, marginTop: "var(--space-6)" }}>
        Pagamento e autenticação entram na fase de integração.{" "}
        <Link href="/matches" className="compliance__link" style={{ color: "var(--color-primary-strong)" }}>
          Ver partidas grátis
        </Link>
      </p>
    </AppShell>
  );
}
