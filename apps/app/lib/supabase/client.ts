import { createBrowserClient } from '@supabase/ssr'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Client do Supabase no browser (lê a sessão do cookie localmente, sem
// round-trip — usado no header e nos popups para não travar a navegação).
//
// Retorna `null` quando o Supabase NÃO está configurado (dev local sem backend),
// para a navegação não quebrar. Quem chama trata o null como "deslogado".
export function createClient() {
  if (!URL || !ANON) return null
  return createBrowserClient(URL, ANON)
}
