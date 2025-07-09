import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_url_here' && 
  supabaseAnonKey !== 'your_supabase_anon_key_here')

// Create client only if configured, otherwise create a mock client
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      // Mock client for development without Supabase
      auth: {
        getUser: async () => ({ data: { user: { id: 'user123', email: 'demo@example.com' } }, error: null }),
        signInWithPassword: async () => ({ data: { user: { id: 'user123' } }, error: null }),
        signUp: async () => ({ data: { user: { id: 'user123' } }, error: null }),
        signOut: async () => ({ error: null })
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
            eq: () => ({ data: [], error: { message: 'Supabase not configured' } })
          }),
          order: () => ({
            limit: () => ({ data: [], error: { message: 'Supabase not configured' } })
          })
        }),
        insert: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: async () => ({ data: null, error: { message: 'Supabase not configured' } })
            })
          })
        }),
        delete: () => ({
          eq: async () => ({ error: { message: 'Supabase not configured' } })
        })
      })
    }

// Log configuration status
if (!isSupabaseConfigured) {
  console.warn('Supabase is not configured. Using mock client for development.')
}
