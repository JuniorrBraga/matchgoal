import { compliance } from "@/lib/compliance";

/** Selo 18+ — obrigatório no header de conformidade e na imagem compartilhável. */
export function AgeBadge() {
  return (
    <span className="age-badge" title={compliance.ageNote}>
      {compliance.ageLabel}
    </span>
  );
}
