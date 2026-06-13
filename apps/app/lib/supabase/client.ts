import { createBrowserClient } from '@supabase/ssr'

// Client do Supabase no browser (lê a sessão do cookie localmente, sem
// round-trip — usado no header e nos popups para não travar a navegação).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
