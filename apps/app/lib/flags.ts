// Código FIFA (3 letras, como nos dados dos jogos) → ISO 3166-1 alpha-2
// (minúsculo), usado para montar a URL da bandeira real (flagcdn).
// Resolve o problema do emoji de bandeira não renderizar no Windows
// (aparecia como "AR", "BRA", "AT", "HAI" em vez do escudo).
// Inclui os subcódigos do Reino Unido (Inglaterra/Escócia/País de Gales).
export const FIFA_TO_ISO2: Record<string, string> = {
  ALG: "dz", ARG: "ar", AUS: "au", AUT: "at", BEL: "be", BIH: "ba",
  BRA: "br", CAN: "ca", CIV: "ci", COD: "cd", COL: "co", CPV: "cv",
  CRO: "hr", CUW: "cw", CZE: "cz", ECU: "ec", EGY: "eg", ENG: "gb-eng",
  ESP: "es", FRA: "fr", GER: "de", GHA: "gh", HAI: "ht", IRN: "ir",
  IRQ: "iq", JOR: "jo", JPN: "jp", KOR: "kr", KSA: "sa", MAR: "ma",
  MEX: "mx", NED: "nl", NOR: "no", NZL: "nz", PAN: "pa", PAR: "py",
  POR: "pt", QAT: "qa", RSA: "za", SCO: "gb-sct", SEN: "sn", SUI: "ch",
  SWE: "se", TUN: "tn", TUR: "tr", URU: "uy", USA: "us", UZB: "uz",
  // Extras úteis para fases seguintes / outros adversários.
  WAL: "gb-wls", NIR: "gb-nir", ITA: "it", DEN: "dk", NGA: "ng",
  CMR: "cm", PER: "pe", CHI: "cl", VEN: "ve", BOL: "bo",
};

/** ISO2 (minúsculo) para um código FIFA; undefined se desconhecido. */
export function iso2ForCode(code?: string | null): string | undefined {
  if (!code) return undefined;
  return FIFA_TO_ISO2[code.toUpperCase()];
}
