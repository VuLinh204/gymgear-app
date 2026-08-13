import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
	// Warn early in dev to help debugging when env vars are missing
	// Do not throw so app can still run in UI-driven demos.
	// eslint-disable-next-line no-console
	console.warn('Supabase env vars are not set. NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. API requests will likely fail.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
