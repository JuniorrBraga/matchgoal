import Image from "next/image";
import type { BetSlip, Match } from "@matchgoal/shared";
import { odds } from "@/lib/format";
import { AgeBadge } from "@/components/layout/AgeBadge";
import { CountryFlag } from "@/components/ui/CountryFlag";

/**
 * Render do card compartilhável de um bilhete. Inclui selo 18+ obrigatório.
 * (A exportação como PNG entra na fase de integração; aqui é o layout.)
 */
export function ShareableImage({
  match,
  slip,
}: {
  match: Match;
  slip: BetSlip;
}) {
  return (
    <div className="share-canvas">
      <div
        className="share-canvas__hero"
        style={{ backgroundImage: `url(${match.heroImageUrl})` }}
      >
        <div className="share-canvas__teams">
          <CountryFlag code={match.home.shortName} name={match.home.name} size={22} className="share-flag" />{" "}
          {match.home.shortName} × {match.away.shortName}{" "}
          <CountryFlag code={match.away.shortName} name={match.away.name} size={22} className="share-flag" />
        </div>
      </div>

      <div className="share-canvas__body">
        <span className="badge badge--primary">{slip.title}</span>
        <div className="slip-legs" style={{ marginTop: "var(--space-3)" }}>
          {slip.legs.map((leg) => (
            <div className="slip-leg" key={leg.predictionId + leg.selectionLabel}>
              <span className="slip-leg__label">{leg.selectionLabel}</span>
              <span className="slip-leg__odds">{odds(leg.odds)}</span>
            </div>
          ))}
        </div>

        <div className="slip-card__total">
          <span className="slip-card__total-k">Odd combinada</span>
          <span className="slip-card__total-v">{odds(slip.combinedOdds)}</span>
        </div>

        <div className="share-canvas__brand">
          <Image
            src="/brand/wordmark.png"
            alt="MatchGoal"
            width={150}
            height={28}
            style={{ height: 26, width: "auto" }}
          />
          <AgeBadge />
        </div>
      </div>
    </div>
  );
}
