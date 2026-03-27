import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// We still export the client, but we'll guard its usage in hooks
// If not configured, we create a dummy client or handle it in the hook
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any; // Cast as any to avoid type errors in usage, but we'll check isSupabaseConfigured
