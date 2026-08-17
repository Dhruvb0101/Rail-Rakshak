/**
 * Supabase Browser Client for RailRakshak AI Frontend.
 *
 * Provides a singleton Supabase client for use in Next.js client components.
 * Falls back gracefully if env vars are missing (data fetched via backend API instead).
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;

/**
 * Returns the Supabase client singleton, or null if not configured.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (supabase) return supabase;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      '[RailRakshak] Supabase not configured on frontend. Using backend API fallback.'
    );
    return null;
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey);
  return supabase;
}

/**
 * Check if Supabase is available on the frontend.
 */
export function isSupabaseAvailable(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export { supabaseUrl, supabaseAnonKey };
