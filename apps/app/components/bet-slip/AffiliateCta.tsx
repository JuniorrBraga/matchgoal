import { compliance } from "@/lib/compliance";

/**
 * CTA com link de afiliado. rel="sponsored" sinaliza o vínculo comercial;
 * a nota reforça que aposta envolve risco (conformidade).
 */
export function AffiliateCta({
  href,
  label = "Apostar no parceiro",
}: {
  href: string;
  label?: string;
}) {
  return (
    <>
      <a
        className="btn btn--primary btn--block"
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
      >
        {label} ↗
      </a>
      <p className="cta-note">{compliance.responsibility}</p>
    </>
  );
}
