import { createBrowserClient } from "@supabase/ssr"
import { getSupabaseEnv } from "./env"

/**
 * Supabase client for React Client Components (browser).
 * Uses the public anon key; respects Row Level Security.
 */
export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabaseEnv()
  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Add them to your environment.",
    )
  }
  return createBrowserClient(url, anonKey)
}
