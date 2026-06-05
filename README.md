# MatchGoal

Monorepo do MatchGoal, gerenciado com **pnpm workspaces + Turborepo**, TypeScript em todo o projeto.

> 🚧 Projeto em fase de scaffold — nenhuma feature implementada ainda.

## Estrutura

```
matchgoal/
  apps/
    landing/   # Next.js — página de vendas
    app/       # Next.js — aplicação SaaS (produto)
    api/       # Backend (routes/services/lib) — só estrutura por enquanto
  packages/
    shared/    # Tipos, utils e UI compartilhados (types/utils/ui)
  docs/        # Documentação do projeto
```

## Requisitos

- Node.js >= 20
- pnpm >= 9 (`npm i -g pnpm`)

## Como rodar

```bash
pnpm install
pnpm dev          # sobe landing (porta 3000) e app (porta 3001) via Turborepo
```

Para rodar um app específico:

```bash
pnpm --filter @matchgoal/landing dev
pnpm --filter @matchgoal/app dev
```

## Fluxo de trabalho

- Nunca commitar direto na `main` — trabalhe em branches (`feature/...`, `fix/...`) e integre via Pull Request.
- Veja as regras completas em [CLAUDE.md](./CLAUDE.md).
