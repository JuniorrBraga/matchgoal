import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// App ABERTO: o middleware NÃO bloqueia ninguém. Apenas mantém a sessão do
// Supabase atualizada (refresh de token) para o SSR. O bloqueio das análises
// acontece nas páginas (detalhe da partida) via getAuthState().
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return NextResponse.next({ request })

  // Visitante sem cookie de sessão: nada a refrescar — evita uma chamada de
  // rede ao Supabase em TODA page view anônima.
  const hasSession = request.cookies.getAll().some((c) => c.name.startsWith('sb-'))
  if (!hasSession) return NextResponse.next({ request })

  let supabaseResponse = NextResponse.next({ request })

  try {
    const supabase = createServerClient(url, anon, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    })
    // Refresca a sessão (não redireciona).
    await supabase.auth.getUser()
  } catch {
    // Nunca derruba a navegação por erro de auth.
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|api/webhooks|api/cron|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
