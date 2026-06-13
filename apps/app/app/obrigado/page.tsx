import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export const metadata = { title: "Pagamento confirmado — MatchGoal" };

/**
 * Destino do completionUrl da cobrança na Abacate Pay.
 * O webhook já criou a conta; aqui orientamos o comprador a entrar.
 */
export default function ObrigadoPage() {
  return (
    <AppShell>
      <div className="card locked-panel" style={{ marginTop: "var(--space-8)" }}>
        <div className="locked-panel__icon">🎉</div>
        <h1 className="locked-panel__title">Pagamento confirmado!</h1>
        <p className="muted">
          Seu acesso ao <b>Pro Copa</b> foi liberado. Enviamos um <b>link de
          acesso</b> para o email usado na compra — é só clicar nele para entrar.
        </p>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "var(--space-4) auto",
            maxWidth: 380,
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
            color: "var(--color-text-muted)",
            fontSize: 14,
          }}
        >
          <li>📬 Verifique também a caixa de spam/promoções</li>
          <li>⏳ O link de acesso expira em 1 hora</li>
          <li>🔑 Sem o email? Entre direto com o email da compra abaixo</li>
        </ul>
        <Link href="/login" className="btn btn--primary btn--block" style={{ maxWidth: 380, margin: "0 auto" }}>
          Entrar com meu email →
        </Link>
        <p className="cta-note" style={{ marginTop: "var(--space-4)" }}>
          Qualquer problema, fale com a gente — seu acesso já está garantido.
        </p>
      </div>
    </AppShell>
  );
}
