import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

type Profile = {
  status: 'active' | 'expired'
  period_end: string | null
}

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Sem config de Supabase: não derruba o site (evita 500 no Edge). Apenas segue.
  if (!url || !anon) return NextResponse.next({ request })

  const redirectToPaywall = () => {
    const paywallUrl = new URL('/paywall', request.url)
    const { pathname } = request.nextUrl
    if (pathname.startsWith('/grupos')) {
      paywallUrl.searchParams.set('locked', 'grupos')
    } else if (pathname.startsWith('/matches')) {
      paywallUrl.searchParams.set('locked', 'matches')
    }
    return NextResponse.redirect(paywallUrl)
  }

  try {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(url, anon, {
      db: { schema: 'matchgoal' },
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

    // IMPORTANTE: usar getUser() — getSession() usa cache e pode estar desatualizado
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return redirectToPaywall()
    }

    // Verifica assinatura ativa
    const { data: profile } = (await supabase
      .from('profiles')
      .select('status, period_end')
      .eq('id', user.id)
      .maybeSingle()) as { data: Profile | null; error: unknown }

    const isActive =
      profile?.status === 'active' &&
      profile?.period_end != null &&
      new Date(profile.period_end) > new Date()

    if (!isActive) {
      return redirectToPaywall()
    }

    return supabaseResponse
  } catch (err) {
    // Nunca derruba a página com 500 por erro de auth — fail-closed no paywall.
    console.error('[middleware] erro de auth:', err)
    return redirectToPaywall()
  }
}

export const config = {
  matcher: [
    // Protege tudo exceto: assets estáticos, paywall, login, auth, webhooks e cron
    '/((?!_next/static|_next/image|favicon\\.ico|paywall|login|auth|jogo-responsavel|api/webhooks|api/cron|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
