import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Login sem email de verificação: se o email estiver em `profiles` com
 * assinatura ativa, autentica direto (sem checar posse da caixa de entrada).
 * Decisão consciente do projeto para lançamento rápido — ver discussão
 * sobre o risco antes de reverter.
 */
export async function POST(req: NextRequest) {
  let body: { email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const email = body.email?.toLowerCase().trim()
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('status, period_end')
    .eq('email', email)
    .maybeSingle()

  const active =
    profile?.status === 'active' &&
    profile?.period_end != null &&
    new Date(profile.period_end) > new Date()

  if (!active) {
    return NextResponse.json(
      { error: 'Esse email não tem assinatura ativa. Assine primeiro para liberar o acesso.' },
      { status: 401 }
    )
  }

  const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email,
  })
  const tokenHash = linkData?.properties?.hashed_token
  if (linkErr || !tokenHash) {
    console.error('[quick-login] generateLink falhou:', linkErr?.message)
    return NextResponse.json({ error: 'Erro ao gerar acesso' }, { status: 500 })
  }

  const supabase = await createClient()
  const { error: verifyErr } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: 'magiclink',
  })
  if (verifyErr) {
    console.error('[quick-login] verifyOtp falhou:', verifyErr.message)
    return NextResponse.json({ error: 'Erro ao autenticar' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
