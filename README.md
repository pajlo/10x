# 10x Cards

Aplikacja do zarządzania i nauki z fiszkami edukacyjnymi.

## O projekcie

10x Cards to aplikacja do tworzenia i zarządzania zestawami fiszek edukacyjnych. Główne funkcje:

- Automatyczne generowanie fiszek przy użyciu AI na podstawie dostarczonego tekstu
- Ręczne tworzenie, edycja i usuwanie fiszek
- System nauki oparty na algorytmie spaced repetition (SuperMemo/SM-2)
- Pełna autentykacja użytkowników

Projekt spełnia wszystkie wymagania zaliczeniowe kursu 10xDevs.pl:
- ✅ Obsługa logowania użytkownika (Supabase Auth)
- ✅ Podstawowa logika biznesowa (generowanie i zarządzanie fiszkami)
- ✅ Zarządzanie danymi CRUD (tworzenie, odczyt, aktualizacja i usuwanie fiszek)
- ✅ Kompletne testy jednostkowe i E2E
- ✅ Konfiguracja CI/CD (GitHub Actions)

## Stack technologiczny

- **Frontend**: Vue.js 3 (Composition API), Vite, Tailwind CSS, Pinia, Vue Router
- **Backend**: Supabase (PostgreSQL, system autentykacji, Row Level Security)
- **API**: OpenAI API (generowanie fiszek), biblioteka implementująca algorytm SuperMemo/SM-2
- **Testy**: Vitest (testy jednostkowe), Playwright (testy E2E)

## Instalacja

```bash
# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev
```

## Konfiguracja

Aby poprawnie skonfigurować aplikację, należy utworzyć plik `.env.local` z odpowiednimi zmiennymi środowiskowymi:

```properties
VITE_SUPABASE_URL=https://twoj-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=twoj-klucz-dostepowy
VITE_OPENAI_API_KEY=twoj-klucz-api-openai
```

> **Uwaga**: Plik `.env.local` powinien być dodany do `.gitignore` i nie powinien być przechowywany w repozytorium.

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
  password: 'password123',
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

## CI/CD

Projekt zawiera konfigurację GitHub Actions do automatycznego uruchamiania testów, lintowania kodu i sprawdzania formatowania po każdym pushu do repozytorium.

Aby zobaczyć status CI/CD, przejdź do zakładki "Actions" w repozytorium GitHub.

Główne elementy CI/CD:
- Automatyczne uruchamianie testów jednostkowych i E2E
- Weryfikacja jakości kodu (linting)
- Sprawdzanie formatowania kodu

## Funkcje aplikacji

### Generowanie fiszek z pomocą AI

Aplikacja umożliwia wklejenie tekstu (np. fragmentu podręcznika) i automatyczne wygenerowanie zestawu fiszek przy pomocy modeli językowych. Wygenerowane fiszki można zaakceptować, edytować lub odrzucić.

### Zarządzanie fiszkami

Użytkownicy mogą tworzyć, edytować i usuwać fiszki. Wszystkie fiszki są powiązane z kontem użytkownika i dostępne tylko dla niego.

### Nauka z algorytmem powtórek

Aplikacja wykorzystuje algorytm spaced repetition do efektywnej nauki z fiszkami. System dostosowuje częstotliwość pokazywania poszczególnych fiszek na podstawie oceny użytkownika.
