import { createClient } from '@supabase/supabase-js';

// Zastąp tymi rzeczywistymi danymi z Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://twojprojekt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'twoj-klucz-anonimowy-supabase';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
