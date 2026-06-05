# MatchGoal — Brand & Conformidade

Guia de marca e regras de conformidade do produto. Vale para `apps/app` e
`apps/landing`. Os tokens de cor vivem em
[`packages/shared/ui/tokens.css`](../packages/shared/ui/tokens.css).

## Posicionamento

MatchGoal é um SaaS de **análise estatística** de partidas de futebol com IA,
focado na Copa do Mundo 2026.

- É **leitura de dados** — probabilidades, cenários e contexto histórico.
- **NÃO** é "dica que faz ganhar". Nunca prometer lucro, retorno ou resultado.
- Tom **adulto, esportivo, sério e transparente**. Nada infantil.
- Odds exibidas são sempre **referência** ("odd implícita" derivada da
  probabilidade), nunca garantia.

## Personalidade visual

Energia do **laranja** (`--color-primary` `#FF6A00`) equilibrada pelo **charcoal
navy** (`--color-ink` `#14181F`). Tema **CLARO** (light-first), inspirado em
Copa do Mundo 2026 + Betano: barra laranja, valores/odds em verde
(`--color-odds`), cards claros. Tipografia display **Anton** (títulos/números)
com **Hanken Grotesk** no corpo.

## Slots de conformidade (OBRIGATÓRIOS)

Toda **tela/página pública** precisa exibir os três slots abaixo. No app eles
ficam centralizados no componente `ComplianceBar` (rodapé do shell) e no
`AgeBadge` (header e imagem compartilhável).

### 1. Selo 18+

- Badge "18+" visível no header e **embutido em toda imagem compartilhável**.
- Texto de apoio: "Conteúdo destinado a maiores de 18 anos."

### 2. Faixa "Aposte com responsabilidade"

- Texto fixo: **"Aposte com responsabilidade. Apostas envolvem risco de perda."**
- Sempre presente no rodapé; nunca escondida atrás de interação.

### 3. Link de autoexclusão / ajuda

- Link visível: **"Precisa de ajuda? Autoexclusão e jogo responsável"**.
- Aponta para o canal de jogo responsável (placeholder até definição legal).

### Texto de transparência da IA

Junto aos slots: **"Análises geradas por IA a partir de dados históricos. Não
representam garantia de resultado."**

## Constantes de conformidade (código)

Os textos e links acima são centralizados em
[`apps/app/lib/compliance.ts`](../apps/app/lib/compliance.ts) — não duplicar
strings de conformidade espalhadas pela UI.

> ⚠️ Placeholders: os links de autoexclusão/ajuda e a idade mínima por
> jurisdição devem ser revisados pelo responsável legal antes de produção.
