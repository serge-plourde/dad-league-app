import { createClient } from '@supabase/supabase-js';

// These values come from GitHub Secrets at build time
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
