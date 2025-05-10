# 10x Cards

Aplikacja do zarządzania i nauki z fiszkami edukacyjnymi.

## Instalacja

```bash
# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev
```

## Uruchamianie testów

Projekt zawiera dwa rodzaje testów: testy jednostkowe (Vitest) i testy end-to-end (Playwright).

### Testy jednostkowe

```bash
# Uruchomienie testów jednostkowych jednokrotnie
npm run test:unit

# Uruchomienie testów w trybie watch (automatyczne ponowne uruchamianie przy zmianach)
npm run test:unit:watch

# Uruchomienie testów z interfejsem graficznym
npm run test:unit:ui

# Uruchomienie testów z pomiarem pokrycia kodu
npm run test:unit:coverage
```

### Testy end-to-end (E2E)

```bash
# Uruchomienie testów E2E
npm run test:e2e

# Uruchomienie testów E2E z interfejsem graficznym
npm run test:e2e:ui

# Pokazanie ostatniego raportu HTML z testów
npx playwright show-report

# Uruchomienie konkretnego pliku testowego
npx playwright test tests/e2e/auth.spec.js
npx playwright test tests/e2e/flashcards.spec.js

# Czyszczenie danych testowych po testach E2E
npm run cleartest
```

### Uruchomienie wszystkich testów

```bash
npm test
```

## Czyszczenie danych testowych

Projekt zawiera mechanizm do czyszczenia danych testowych wprowadzonych podczas testów E2E.

```bash
# Usunięcie wszystkich fiszek utworzonych przez konto testowe
npm run cleartest
```

Aby skonfigurować mechanizm czyszczenia danych, należy utworzyć plik `.env.local` z danymi dostępowymi do Supabase:

```properties
VITE_SUPABASE_URL=https://twoj-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=twoj-klucz-dostepowy
```

> **Uwaga**: Plik `.env.local` powinien być dodany do `.gitignore` i nie powinien być przechowywany w repozytorium.

Więcej informacji na temat mechanizmu czyszczenia danych testowych można znaleźć w pliku [ai/cleartest-README.md](./ai/cleartest-README.md).

## Struktura testów

### Testy jednostkowe

Testy jednostkowe znajdują się w katalogu `/tests/unit/` i są organizowane zgodnie ze strukturą kodu aplikacji. Używamy Vitest jako framework testowy z Composition API dla Vue 3.

Przykład testu jednostkowego dla store'a autentykacji:
```javascript
// tests/unit/stores/auth.spec.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../../../src/stores/auth';

// Pozostała część kodu testu...
```

### Testy E2E

Testy E2E znajdują się w katalogu `/tests/e2e/` i używają Playwright jako framework testowy. Dane testowe są centralizowane w pliku `test-data.js`, aby zapewnić spójność między testami.

```javascript
// tests/e2e/test-data.js
export const TEST_USER = {
  email: 'test@test.pl',
  password: 'password123'
};
```

Testy E2E używają wzorca Page Object Pattern, gdzie każda strona aplikacji ma swój odpowiednik w katalogu `/tests/e2e/pages/`:

```javascript
// tests/e2e/pages/LoginPage.js
export class LoginPage {
  constructor(page) {
    this.page = page;
    // Selektory elementów strony
  }
  
  async login(email, password) {
    // Implementacja logowania
  }
}
```

## Debugowanie testów

### Testy jednostkowe
- Użyj `console.log()` do debugowania
- Uruchom testy w trybie watch
- Użyj interfejsu UI do wizualizacji testów

### Testy E2E
- Dodaj `await page.pause()` w kodzie testu, aby zatrzymać test
- Używaj trybu UI dla krokowego wykonywania testów
- Analizuj zrzuty ekranu i śledzenie (trace) błędów