import Link from "next/link";
import { compliance } from "@/lib/compliance";
import { AgeBadge } from "./AgeBadge";

/**
 * Faixa de conformidade obrigatória no rodapé de toda tela pública.
 * Reúne os 3 slots: 18+, "aposte com responsabilidade" e autoexclusão.
 */
export function ComplianceBar() {
  return (
    <footer className="compliance">
      <div className="container compliance__inner">
        <span className="compliance__line">
          <AgeBadge />
          <span>{compliance.ageNote}</span>
        </span>

        <span className="compliance__line">
          <span className="compliance__strong">
            {compliance.responsibility}
          </span>
        </span>

        <span className="compliance__line">
          <Link
            className="compliance__link"
            href={compliance.selfExclusion.href}
          >
            {compliance.selfExclusion.label}
          </Link>
        </span>

        <p className="compliance__disclaimer">{compliance.aiDisclaimer}</p>
      </div>
    </footer>
  );
}
