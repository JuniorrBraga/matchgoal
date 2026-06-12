import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { activateSubscription } from '@/lib/subscription'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Ativação manual de assinatura — botão de emergência em /admin para quando
 * um pagamento real não bate o webhook automaticamente (ex.: Abacate em
 * Sandbox não envia o email do cliente). Restrito ao email em ADMIN_EMAIL.
 */
export async function POST(req: NextRequest) {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim()
  if (!adminEmail) {
    return NextResponse.json({ error: 'ADMIN_EMAIL não configurado' }, { status: 500 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || user.email?.toLowerCase() !== adminEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { email?: string; name?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = body.email?.toLowerCase().trim()
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  const txId = `manual::${email}::${Date.now()}`
  const result = await activateSubscription({ email, name: body.name?.trim(), txId })

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }
  return NextResponse.json(result)
}
