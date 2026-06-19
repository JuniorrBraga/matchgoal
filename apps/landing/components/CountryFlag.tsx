"use client";

import { useState } from "react";
import { iso2ForCode } from "../lib/flags";

/**
 * Bandeira REAL da seleção (via flagcdn), no lugar do emoji que o Windows não
 * renderiza. Faz fallback para a sigla se o código for desconhecido / a imagem
 * falhar.
 *
 * - `crest`: variante de escudo (quadrado arredondado preenchido pela bandeira),
 *   usada no card do Hero. `crestBg` é o gradiente de fallback.
 * - sem `crest`: bandeira inline com `size` = altura em px.
 */
export function CountryFlag({
  code,
  name,
  size = 22,
  crest = false,
  crestBg,
  className = "",
}: {
  code: string;
  name?: string;
  size?: number;
  crest?: boolean;
  crestBg?: string;
  className?: string;
}) {
  const iso2 = iso2ForCode(code);
  const [failed, setFailed] = useState(false);

  if (crest) {
    if (!iso2 || failed) {
      return (
        <div
          className={`crest ${className}`.trim()}
          style={crestBg ? { background: crestBg } : undefined}
        >
          {code}
        </div>
      );
    }
    return (
      <img
        className={`crest crest--flag ${className}`.trim()}
        src={`https://flagcdn.com/w160/${iso2}.png`}
        alt={name ? `Bandeira: ${name}` : code}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    );
  }

  if (!iso2 || failed) {
    return (
      <span
        className={`flag-fallback ${className}`.trim()}
        style={{ height: size, fontSize: Math.round(size * 0.46) }}
        aria-label={name ?? code}
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
