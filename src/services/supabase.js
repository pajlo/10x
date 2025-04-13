import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

// Upewnij się, że wartości są dostępne
if (!supabaseUrl || !supabaseKey) {
  console.error('Brakujące zmienne środowiskowe Supabase. Upewnij się, że plik .env jest prawidłowo skonfigurowany.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
