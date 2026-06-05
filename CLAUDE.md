# CLAUDE.md — Regras do projeto MatchGoal

Este documento define as regras de trabalho do projeto. Vale para todos os
desenvolvedores e para o Claude Code.

## Regras de Git (OBRIGATÓRIAS)

1. **NUNCA commitar diretamente na branch `main`.**
   Todo trabalho é feito em branches dedicadas e integrado via Pull Request.
2. A branch `main` é a **branch de produção**: só recebe merge quando o
   trabalho estiver pronto, revisado e aprovado em PR.
3. **Antes de qualquer commit**, confirme que você NÃO está na `main`
   (`git branch --show-current`). Se estiver, crie/troque de branch primeiro.
4. **Nunca fazer deploy de produção** até liberação explícita do responsável
   pelo projeto. Durante o desenvolvimento, rode SEMPRE em ambiente local
   com `pnpm dev` (ou `npm run dev`).

## Convenção de branches

```
feature/<descricao-curta>   # nova funcionalidade (ex: feature/landing-hero)
fix/<descricao-curta>       # correção de bug
chore/<descricao-curta>     # tarefas de manutenção/config
docs/<descricao-curta>      # documentação
setup/<descricao-curta>     # configuração inicial/infra
```

Use kebab-case, em inglês ou português, mas seja consistente.

## Convenção de commits — Conventional Commits

```
<tipo>(<escopo opcional>): <descrição no imperativo>
```

Tipos: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `ci`.

Exemplos:
- `feat(landing): adiciona seção de preços`
- `fix(app): corrige redirect pós-login`
- `chore: atualiza dependências do turbo`

## Arquitetura do monorepo

Monorepo com **pnpm workspaces + Turborepo**, TypeScript em tudo.

| Pasta | O que vai aqui |
|---|---|
| `apps/landing` | Next.js — página de vendas/marketing. Não contém lógica de produto. |
| `apps/app` | Next.js — aplicação SaaS (o produto em si). |
| `apps/api` | Camada de backend: `routes/` (rotas HTTP), `services/` (regras de negócio), `lib/` (helpers de infra: db, auth, etc). Ainda só estrutura. |
| `packages/shared` | Código compartilhado entre landing e app: `types/` (tipos TS), `utils/` (funções utilitárias), `ui/` (componentes de UI). |
| `docs/` | Documentação do projeto. |

Regras de dependência:
- `apps/*` podem importar de `packages/shared`.
- `packages/shared` NÃO importa de nenhum app.
- Landing e app não importam um do outro — o que for comum vai pro `shared`.

## Ambiente e variáveis

- Variáveis de ambiente documentadas em `.env.example` (apenas placeholders).
- Arquivos `.env*` reais NUNCA são commitados (já estão no `.gitignore`).

## Comandos úteis

```bash
pnpm install                          # instala tudo
pnpm dev                              # sobe landing (3000) e app (3001)
pnpm --filter @matchgoal/landing dev  # só a landing
pnpm --filter @matchgoal/app dev      # só o app
pnpm build                            # build de todos os pacotes
```
