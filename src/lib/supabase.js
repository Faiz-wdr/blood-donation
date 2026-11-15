import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Client Initialization for Blood Connect Kerala
 * Reads configuration from Vite environment variables (or test environment).
 * Never uses service-role keys or exposes database credentials.
 */

const globalProcess = typeof globalThis !== 'undefined' ? globalThis.process : undefined;
const env =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : globalProcess && globalProcess.env
    ? globalProcess.env
    : {};

const rawUrl = env.VITE_SUPABASE_URL;
const rawAnonKey = env.VITE_SUPABASE_ANON_KEY;

// Sanitize URL in case trailing slashes or /rest/v1 paths are passed
const supabaseUrl = rawUrl
  ? rawUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
  : '';
const supabaseAnonKey = rawAnonKey ? rawAnonKey.trim() : '';

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.warn(
      '[Blood Connect Kerala] Supabase credentials missing. Please check .env.local configuration.'
    );
  }
}

const isBrowser = typeof window !== 'undefined';

// Provide valid fallback dummy string to avoid client throw if env not present during build/test
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: isBrowser,
      autoRefreshToken: isBrowser,
      detectSessionInUrl: isBrowser,
      storage: isBrowser ? window.localStorage : undefined,
    },
  }
);
