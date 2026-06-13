import Link from "next/link";
import type { BetSlip } from "@matchgoal/shared";
import { odds, riskLabel } from "@/lib/format";
import { compliance } from "@/lib/compliance";

const riskBadge: Record<string, string> = {
  conservative: "badge badge--free",
  balanced: "badge badge--primary",
  aggressive: "badge badge--live",
};

/** Bilhete pré-montado pela IA: seleções + odd combinada + CTA. */
export function BetSlipCard({
  slip,
  matchSlug,
}: {
  slip: BetSlip;
  matchSlug: string;
}) {
  return (
    <article className="card slip-card">
      <div className="slip-card__head">
        <h3 className="slip-card__title">{slip.title}</h3>
        <span className={riskBadge[slip.riskLevel] ?? "badge badge--muted"}>
          {riskLabel(slip.riskLevel)}
        </span>
      </div>
      <p className="slip-card__rationale">{slip.rationale}</p>

      <div className="slip-legs">
        {slip.legs.map((leg) => (
          <div className="slip-leg" key={leg.predictionId + leg.selectionLabel}>
            <span>
              <span className="slip-leg__label">{leg.selectionLabel}</span>
              <br />
              <span className="slip-leg__market">{leg.market}</span>
            </span>
            <span className="slip-leg__odds">{odds(leg.odds)}</span>
          </div>
        ))}
      </div>

      <div className="slip-card__total">
        <span className="slip-card__total-k">Odd combinada (referência)</span>
        <span className="slip-card__total-v">{odds(slip.combinedOdds)}</span>
      </div>

      <p className="cta-note">{compliance.responsibility}</p>

      <p className="cta-note">
        <Link href={`/matches/${matchSlug}/share?slip=${slip.id}`}>
          Gerar imagem para compartilhar →
        </Link>
      </p>
    </article>
  );
}
