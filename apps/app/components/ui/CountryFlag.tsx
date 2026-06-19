"use client";

import { useState } from "react";
import { iso2ForCode } from "@/lib/flags";

/**
 * Bandeira REAL da seleção (SVG via flagcdn), no lugar do emoji que o Windows
 * não renderiza (aparecia como "AR", "BRA"...). Faz fallback para a sigla se o
 * código for desconhecido ou a imagem falhar ao carregar.
 *
 * `size` = altura em px; a largura acompanha a proporção da bandeira.
 */
export function CountryFlag({
  code,
  name,
  size = 22,
  className = "",
}: {
  code: string;
  name?: string;
  size?: number;
  className?: string;
}) {
  const iso2 = iso2ForCode(code);
  const [failed, setFailed] = useState(false);

  if (!iso2 || failed) {
    return (
      <span
        className={`flag-fallback ${className}`.trim()}
        style={{ height: size, fontSize: Math.round(size * 0.46) }}
        aria-label={name ?? code}
        title={name ?? code}
      >
        {code}
      </span>
    );
  }

  return (
    <img
      className={`flag-img ${className}`.trim()}
      src={`https://flagcdn.com/${iso2}.svg`}
      alt={name ? `Bandeira: ${name}` : code}
      style={{ height: size, width: "auto" }}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
