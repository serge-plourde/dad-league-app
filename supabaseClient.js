import { createClient } from '@supabase/supabase-js';

// Values come from Vercel environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Supabase URL and Anon Key are required. Please check your environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
