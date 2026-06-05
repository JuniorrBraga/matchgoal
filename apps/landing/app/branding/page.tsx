import Image from "next/image";
import type { CSSProperties } from "react";
import "./tokens.css";

export const metadata = {
  title: "MatchGoal — Branding",
  description:
    "Guia de marca MatchGoal: logos, paleta de cores e tokens de design.",
};

/* ---------- dados ---------- */

const logos = [
  {
    src: "/branding/logo-full.png",
    name: "Logo completa",
    use: "Uso principal. Headers, landing, materiais oficiais.",
    bg: "var(--color-bg)",
  },
  {
    src: "/branding/wordmark.png",
    name: "Wordmark",
    use: "Quando o ícone já aparece em outro lugar. Rodapés, assinaturas.",
    bg: "var(--color-bg)",
  },
  {
    src: "/branding/icon-goal.png",
    name: "Ícone — gol + bola",
    use: "Favicon, avatar, app icon. Versão símbolo da marca.",
    bg: "var(--color-bg-soft)",
  },
  {
    src: "/branding/icon-ball.png",
    name: "Ícone — bola",
    use: "Marcador compacto, bullets, loaders.",
    bg: "var(--color-bg-soft)",
  },
  {
    src: "/branding/icon-goal-empty.png",
    name: "Gol limpo (sem bola)",
    use: "Elemento gráfico de apoio, padrões e fundos.",
    bg: "var(--color-bg-soft)",
  },
];

type Swatch = { name: string; varName: string; hex: string; dark?: boolean };

const groups: { title: string; note?: string; swatches: Swatch[] }[] = [
  {
    title: "Laranja — primária",
    note: "Energia da marca. CTAs, destaques, dados em alta.",
    swatches: [
      { name: "Primary", varName: "--color-primary", hex: "#FF6A00", dark: true },
      { name: "Primary hover", varName: "--color-primary-hover", hex: "#E85D00", dark: true },
      { name: "Primary active", varName: "--color-primary-active", hex: "#CC5200", dark: true },
      { name: "Primary tint", varName: "--color-primary-tint", hex: "#FFE2CC" },
      { name: "Tint soft", varName: "--color-primary-tint-soft", hex: "#FFF3EA" },
    ],
  },
  {
    title: "Navy — tinta / escuro",
    note: "Seriedade e confiança. Texto, títulos, superfícies escuras.",
    swatches: [
      { name: "Ink", varName: "--color-ink", hex: "#1E2A3A", dark: true },
      { name: "Ink soft", varName: "--color-ink-soft", hex: "#2B3A4E", dark: true },
      { name: "Ink softer", varName: "--color-ink-softer", hex: "#3C4F66", dark: true },
    ],
  },
  {
    title: "Neutros",
    note: "Escala de cinza coerente para fundos, bordas e texto.",
    swatches: [
      { name: "BG", varName: "--color-bg", hex: "#FFFFFF" },
      { name: "BG soft", varName: "--color-bg-soft", hex: "#F7F8FA" },
      { name: "BG muted", varName: "--color-bg-muted", hex: "#EEF1F4" },
      { name: "Border", varName: "--color-border", hex: "#E4E7EC" },
      { name: "Border strong", varName: "--color-border-strong", hex: "#CDD3DB" },
      { name: "Text", varName: "--color-text", hex: "#1E2A3A", dark: true },
      { name: "Text muted", varName: "--color-text-muted", hex: "#5B6B7E", dark: true },
      { name: "Text subtle", varName: "--color-text-subtle", hex: "#8794A3", dark: true },
    ],
  },
  {
    title: "Semânticos",
    note: "Estados de leitura de dados. Nunca prometem resultado — só informam.",
    swatches: [
      { name: "Success", varName: "--color-success", hex: "#16A34A", dark: true },
      { name: "Success tint", varName: "--color-success-tint", hex: "#DCFCE7" },
      { name: "Danger", varName: "--color-danger", hex: "#DC2626", dark: true },
      { name: "Danger tint", varName: "--color-danger-tint", hex: "#FEE2E2" },
      { name: "Warning", varName: "--color-warning", hex: "#F59E0B", dark: true },
      { name: "Warning tint", varName: "--color-warning-tint", hex: "#FEF3C7" },
      { name: "Info", varName: "--color-info", hex: "#2563EB", dark: true },
      { name: "Info tint", varName: "--color-info-tint", hex: "#DBEAFE" },
    ],
  },
];

/* ---------- estilos ---------- */

const s: Record<string, CSSProperties> = {
  page: {
    fontFamily: "var(--font-sans)",
    background: "var(--color-bg-soft)",
    color: "var(--color-text)",
    minHeight: "100vh",
  },
  hero: {
    background: "var(--color-ink)",
    color: "var(--color-text-inverse)",
    padding: "72px 24px 64px",
  },
  heroInner: { maxWidth: 1040, margin: "0 auto" },
  eyebrow: {
    display: "inline-block",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--color-primary)",
    marginBottom: 16,
  },
  h1: { fontSize: 40, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.1 },
  lead: {
    fontSize: 18,
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.78)",
    maxWidth: 620,
    margin: 0,
  },
  main: { maxWidth: 1040, margin: "0 auto", padding: "56px 24px 96px" },
  section: { marginBottom: 64 },
  sectionTitle: { fontSize: 26, fontWeight: 800, margin: "0 0 6px" },
  sectionNote: {
    fontSize: 15,
    color: "var(--color-text-muted)",
    margin: "0 0 28px",
    maxWidth: 640,
    lineHeight: 1.6,
  },
  logoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 20,
  },
  logoCard: {
    background: "var(--color-bg)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    boxShadow: "var(--shadow-sm)",
  },
  logoStage: {
    height: 180,
    display: "grid",
    placeItems: "center",
    padding: 24,
    borderBottom: "1px solid var(--color-border)",
  },
  logoMeta: { padding: "16px 18px 18px" },
  logoName: { fontSize: 16, fontWeight: 700, margin: "0 0 4px" },
  logoUse: { fontSize: 13.5, color: "var(--color-text-muted)", margin: 0, lineHeight: 1.5 },
  palGroup: { marginBottom: 36 },
  palTitle: { fontSize: 18, fontWeight: 700, margin: "0 0 4px" },
  palNote: { fontSize: 14, color: "var(--color-text-muted)", margin: "0 0 16px" },
  swatchGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
    gap: 14,
  },
  swatch: {
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    overflow: "hidden",
    background: "var(--color-bg)",
  },
  chip: { height: 84 },
  swatchMeta: { padding: "10px 12px 12px" },
  swatchName: { fontSize: 13.5, fontWeight: 700, margin: "0 0 2px" },
  swatchHex: {
    fontSize: 12.5,
    color: "var(--color-text-muted)",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    margin: 0,
  },
  swatchVar: {
    fontSize: 11.5,
    color: "var(--color-text-subtle)",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    margin: "2px 0 0",
  },
  voice: {
    background: "var(--color-bg)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-lg)",
    padding: "28px 28px 8px",
    boxShadow: "var(--shadow-sm)",
  },
  voiceRow: { display: "grid", gridTemplateColumns: "120px 1fr", gap: 16, paddingBottom: 20 },
  voiceLabel: { fontWeight: 700, fontSize: 14 },
  voiceText: { fontSize: 15, color: "var(--color-text-muted)", margin: 0, lineHeight: 1.6 },
};

/* ---------- página ---------- */

export default function BrandingPage() {
  return (
    <div style={s.page}>
      <header style={s.hero}>
        <div style={s.heroInner}>
          <span style={s.eyebrow}>Brand Guide</span>
          <h1 style={s.h1}>MatchGoal — Identidade Visual</h1>
          <p style={s.lead}>
            Análise estatística de futebol com IA. Leitura de dados — não promessa de
            resultado. Tom adulto, esportivo e confiável: a energia do laranja com a
            seriedade do navy.
          </p>
        </div>
      </header>

      <main style={s.main}>
        {/* LOGOS */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Logos</h2>
          <p style={s.sectionNote}>
            Sempre sobre fundo claro ou navy, com respiro ao redor. Não distorça, não
            recolorir e não aplique sombras na logo.
          </p>
          <div style={s.logoGrid}>
            {logos.map((l) => (
              <div key={l.src} style={s.logoCard}>
                <div style={{ ...s.logoStage, background: l.bg }}>
                  <Image
                    src={l.src}
                    alt={l.name}
                    width={220}
                    height={132}
                    style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: 132 }}
                  />
                </div>
                <div style={s.logoMeta}>
                  <p style={s.logoName}>{l.name}</p>
                  <p style={s.logoUse}>{l.use}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PALETA */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Paleta — tema claro</h2>
          <p style={s.sectionNote}>
            Tokens fixos da marca. Todos os pares de texto/fundo seguem contraste mínimo
            AA. Use as variáveis CSS abaixo (definidas em <code>tokens.css</code>).
          </p>
          {groups.map((g) => (
            <div key={g.title} style={s.palGroup}>
              <h3 style={s.palTitle}>{g.title}</h3>
              {g.note && <p style={s.palNote}>{g.note}</p>}
              <div style={s.swatchGrid}>
                {g.swatches.map((w) => (
                  <div key={w.varName} style={s.swatch}>
                    <div
                      style={{
                        ...s.chip,
                        background: w.hex,
                        borderBottom:
                          w.hex.toUpperCase() === "#FFFFFF"
                            ? "1px solid var(--color-border)"
                            : "none",
                      }}
                    />
                    <div style={s.swatchMeta}>
                      <p style={s.swatchName}>{w.name}</p>
                      <p style={s.swatchHex}>{w.hex}</p>
                      <p style={s.swatchVar}>{w.varName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* VOZ */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Tom de voz</h2>
          <p style={s.sectionNote}>
            Como a marca fala. Vale para landing, app e comunicação.
          </p>
          <div style={s.voice}>
            <div style={s.voiceRow}>
              <span style={s.voiceLabel}>É</span>
              <p style={s.voiceText}>
                Inteligente, transparente e confiável. Mostra dados, contexto e
                probabilidades. Explica o porquê.
              </p>
            </div>
            <div style={s.voiceRow}>
              <span style={s.voiceLabel}>Não é</span>
              <p style={s.voiceText}>
                Infantil, sensacionalista ou de aposta. Nunca promete lucro, &ldquo;dica
                certa&rdquo; ou resultado garantido.
              </p>
            </div>
            <div style={s.voiceRow}>
              <span style={s.voiceLabel}>Personalidade</span>
              <p style={s.voiceText}>
                Adulta, esportiva e séria — a energia do laranja equilibrada pela
                seriedade do navy.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
