import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { compliance } from "@/lib/compliance";

export const metadata = {
  title: "Jogo responsável — MatchGoal",
};

export default function JogoResponsavelPage() {
  return (
    <AppShell>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: "var(--space-4)" }}>
          Jogo responsável e autoexclusão
        </h1>
        <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-4)" }}>
          {compliance.ageNote} {compliance.responsibility}
        </p>
        <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-4)" }}>
          O MatchGoal é uma ferramenta de <strong>análise estatística</strong>.
          Não operamos apostas e não garantimos resultados. {compliance.aiDisclaimer}
        </p>
        <p style={{ color: "var(--color-text-subtle)", fontSize: 14 }}>
          ⚠️ Conteúdo placeholder. Os canais oficiais de ajuda e autoexclusão
          serão definidos pelo responsável legal antes da produção (ver
          docs/brand.md).
        </p>
        <div style={{ marginTop: "var(--space-6)" }}>
          <Link href="/matches" className="btn btn--ghost">
            ← Voltar para partidas
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
