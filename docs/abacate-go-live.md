# Abacate Pay — checklist de go-live

**Resumo:** o código da integração está completo e foi auditado (webhook,
criação de conta, magic link, renovação, fallback no /admin). **Não falta
código** — o que falta é **configuração de ambiente e dos painéis** (Supabase,
Resend, Abacate, cron). Este documento é o passo a passo para ligar tudo.

Fluxo: LP/app → checkout Abacate → pagamento → `POST /api/webhooks/abacate`
cria a conta no Supabase + manda magic link (Resend) → cliente clica → `/auth/confirm`
abre sessão → `/matches`.

---

## 1. Supabase (banco + auth)

1. Crie um projeto em https://supabase.com.
2. Aplique a migração `supabase/migrations/0001_init_schema.sql`
   (SQL Editor → cole e rode). Cria `profiles` e `processed_transactions` + RLS.
3. **Auth → URL Configuration:**
   - **Site URL:** `https://app.matchgoal.site`
   - **Redirect URLs (allowlist):** adicione
     `https://app.matchgoal.site/auth/confirm` e
     `https://app.matchgoal.site/auth/callback`
     (e os equivalentes `http://localhost:3001/...` para testar local).
   - Sem isso o magic link/OTP é recusado como "redirect inválido".
4. **Auth → Providers → Email:** mantenha o login por e-mail (OTP/magic link)
   ativo. Para o **login de quem já é assinante** (`signInWithOtp` na página
   `/login`), o e-mail sai pelo SMTP do Supabase — configure **SMTP próprio**
   em *Auth → SMTP Settings* (pode usar o SMTP da Resend) para não cair no
   limite do SMTP de testes do Supabase.

## 2. Resend (e-mail de acesso)

1. Crie conta em https://resend.com e **verifique o domínio** do remetente.
2. Gere uma API key.
3. O remetente padrão é `MatchGoal <noreply@matchgoal.com.br>` (`EMAIL_FROM`).
   **O domínio do `EMAIL_FROM` precisa estar verificado na Resend** ou o e-mail
   de boas-vindas não sai (a ativação ainda ocorre, mas o cliente não recebe o
   link — ele consegue entrar pelo `/login`).

## 3. Abacate Pay (painel)

1. **Cobranças:** o link de checkout já está no código
   (`ABACATE_CHECKOUT`, R$ 29,90, Pix + Cartão) e a URL de finalização aponta
   para `/login` (configurada no painel — ver `CLAUDE.md`).
2. **Integrações → Webhooks:** cadastre a URL
   `https://app.matchgoal.site/api/webhooks/abacate?webhookSecret=SEU_SEGREDO`
   - O handler aceita o segredo de 3 formas (query `?webhookSecret=`, header
     `x-webhook-secret`/`webhook-secret`, ou HMAC-SHA256 em
     `x-webhook-signature`). Usar a **query** é o mais à prova de erro.
   - Use o **mesmo** valor em `ABACATE_WEBHOOK_SECRET`.
3. **Integrações → API:** gere a API key e coloque em `ABACATE_API_KEY`
   (usada pelo cron de renovação para gerar novas cobranças).

## 4. Cron de renovação

Agende um `GET https://app.matchgoal.site/api/cron/renewals` diário com header
`Authorization: Bearer CRON_SECRET` (Vercel Cron, GitHub Actions, cron-job.org…).
Gere o `CRON_SECRET` (`openssl rand -hex 32`).

## 5. Variáveis de ambiente

Defina em `apps/app/.env.local` (dev) **e** no provedor de hospedagem (prod):

| Variável | Onde obter | Obrigatória |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (⚠️ só servidor) | ✅ |
| `ABACATE_WEBHOOK_SECRET` | igual ao cadastrado no webhook Abacate | ✅ |
| `ABACATE_API_KEY` | Abacate → Integrações → API | ✅ (renovação) |
| `RESEND_API_KEY` | resend.com → API Keys | ✅ |
| `EMAIL_FROM` | remetente de domínio verificado na Resend | recomendado |
| `NEXT_PUBLIC_APP_URL` | `https://app.matchgoal.site` (dev: `http://localhost:3001`) | ✅ |
| `CRON_SECRET` | `openssl rand -hex 32` | ✅ (renovação) |
| `ADMIN_EMAIL` | e-mail autorizado no `/admin` | ✅ (fallback) |
| `ABACATE_BLOCK_DEV_MODE` | `true` para bloquear pagamento de teste em prod | opcional |

## 6. Teste de ponta a ponta

1. Pague em modo de teste (devMode) pelo checkout.
2. Veja os logs do webhook: `[webhook] hit auth=... event=... temEmail=true ...`
   e `[webhook] OK — acesso liberado`.
3. Confirme a linha em `profiles` (`status=active`, `period_end` = +30 dias).
4. Receba o e-mail de acesso (Resend) → clique → deve cair logado em `/matches`.
5. Repita o pagamento com o mesmo e-mail → deve registrar **renovação**
   (estende 30 dias) e não duplicar.

## 7. Depois de confirmar em produção

- O webhook tem um log de DEBUG temporário (`shapeOf`) que mapeia o formato do
  payload (sem PII) — remova-o de `apps/app/app/api/webhooks/abacate/route.ts`
  quando o formato da Abacate estiver confirmado.

> Diagnóstico rápido: se o pagamento "não libera", quase sempre é (a) segredo do
> webhook divergente, (b) `EMAIL_FROM` em domínio não verificado, ou (c) redirect
> URL do Supabase faltando. Os três aparecem nos logs do webhook/Resend.
