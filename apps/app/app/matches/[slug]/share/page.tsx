import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ShareableImage } from "@/components/bet-slip/ShareableImage";
import { getBetSlip, getBetSlips, getMatch } from "@/mocks";
import { getAuthState } from "@/lib/auth";
import { compliance } from "@/lib/compliance";

export default async function SharePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ slip?: string }>;
}) {
  const { slug } = await params;
  const { slip: slipId } = await searchParams;

  // Bilhete é conteúdo premium — sem assinatura, cai na análise travada.
  const { active } = await getAuthState();
  if (!active) redirect(`/matches/${slug}`);

  const match = getMatch(slug);
  if (!match) notFound();

  // Usa o bilhete da query ou o primeiro disponível da partida.
  const slip = (slipId && getBetSlip(slipId)) || getBetSlips(match.id)[0];
  if (!slip) notFound();

  return (
    <AppShell active="matches">
      <Link href={`/matches/${slug}`} className="back-link">
        ← Voltar para a análise
      </Link>

      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            textAlign: "center",
            marginBottom: "var(--space-2)",
          }}
        >
          Compartilhar bilhete
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            textAlign: "center",
            marginBottom: "var(--space-5)",
          }}
        >
          Prévia da imagem. A exportação em PNG entra na integração.
        </p>

        <ShareableImage match={match} slip={slip} />

        <div style={{ marginTop: "var(--space-5)" }}>
          <p className="cta-note">{compliance.responsibility}</p>
        </div>
      </div>
    </AppShell>
  );
}
