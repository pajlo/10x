// Konfiguracja Supabase dla skryptów Node.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Pomocnicza funkcja do logowania diagnostycznego
function logDebugInfo(message) {
  if (process.env.DEBUG_SUPABASE === 'true') {
    console.log(`[Supabase Config Debug] ${message}`);
  }
}

// Wczytaj zmienne środowiskowe z plików .env i .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

// Wczytaj .env (jeśli istnieje)
const envPath = resolve(rootDir, '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  logDebugInfo(`Wczytano zmienne środowiskowe z ${envPath}`);
}

// Wczytaj .env.local (jeśli istnieje, ma wyższy priorytet)
const envLocalPath = resolve(rootDir, '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
  logDebugInfo(`Wczytano dodatkowe zmienne środowiskowe z ${envLocalPath}`);
}

// Uzyskaj URL i klucz API do Supabase
const getSupabaseConfig = () => {
  // Sprawdź zmienne środowiskowe
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes('twojprojekt.supabase.co')) {
    console.error('❌ Brak prawidłowych danych do połączenia z Supabase.');
    console.error('   Upewnij się, że pliki .env lub .env.local zawierają:');
    console.error('   VITE_SUPABASE_URL=... i VITE_SUPABASE_ANON_KEY=...');
    console.error('   Te pliki NIE powinny być przechowywane w repozytorium!');
    
    // Tutaj nie dodajemy twardych danych - jeśli nie znajdzie zmiennych, zgłosi to jako błąd
    throw new Error('Brak wymaganych zmiennych środowiskowych dla Supabase');
  }

  logDebugInfo('Używam zmiennych środowiskowych dla Supabase');
  return { url, key };
};

// Zdefiniuj zmienne, które będą eksportowane
let supabaseNode;
let configError = null;

// Próba utworzenia klienta Supabase
try {
  const { url: supabaseUrl, key: supabaseKey } = getSupabaseConfig();
  // Utwórz klienta Supabase
  supabaseNode = createClient(supabaseUrl, supabaseKey);
} catch (error) {
  console.error(`❌ Błąd konfiguracji Supabase: ${error.message}`);
  configError = error;
  // Tworzymy "atrapę" klienta, która będzie zgłaszała błędy przy próbie użycia
  supabaseNode = new Proxy({}, {
    get: function(target, prop) {
      if (prop === 'auth') {
        return new Proxy({}, {
          get: function(target, authProp) {
            return () => {
              throw new Error('Klient Supabase nie został poprawnie skonfigurowany. Sprawdź zmienne środowiskowe.');
            };
          }
        });
      }
      return () => {
        throw new Error('Klient Supabase nie został poprawnie skonfigurowany. Sprawdź zmienne środowiskowe.');
      };
    }
  });
}

// Eksportujemy zmienne i funkcje
export { supabaseNode, getSupabaseConfig, configError };