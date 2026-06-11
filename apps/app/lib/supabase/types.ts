// Formato exato que @supabase/supabase-js espera para o generic Database.
// Projeto dedicado do MatchGoal — tabelas no schema padrão "public".
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          status: 'active' | 'expired'
          period_end: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          status?: 'active' | 'expired'
          period_end?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          status?: 'active' | 'expired'
          period_end?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      processed_transactions: {
        Row: {
          id: string
          checkout_id: string
          email: string
          processed_at: string
        }
        Insert: {
          id?: string
          checkout_id: string
          email: string
          processed_at?: string | null
        }
        Update: {
          id?: string
          checkout_id?: string
          email?: string
          processed_at?: string | null
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
