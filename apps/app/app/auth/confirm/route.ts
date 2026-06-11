import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

// Destino dos links de acesso enviados por email (token_hash).
// verifyOtp roda no servidor e grava os cookies de sessão — diferente do
// action_link cru da Supabase, que devolve tokens no fragmento (#) e o
// servidor não enxerga.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const tokenHash = searchParams.get('token_hash')
  const type = (searchParams.get('type') ?? 'email') as EmailOtpType
  const next = searchParams.get('next') ?? '/matches'

  if (tokenHash) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`)
      }
      console.warn('[auth/confirm] verifyOtp falhou:', error.message)
    } catch (err) {
      console.error('[auth/confirm] erro:', err)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=link_expired`)
}
