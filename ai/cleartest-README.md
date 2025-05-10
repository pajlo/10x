# Mechanizm czyszczenia danych testowych

Ten mechanizm pozwala na czyszczenie danych testowych wprowadzonych podczas testów E2E.

## Konfiguracja

Aby skorzystać z mechanizmu czyszczenia danych, musisz skonfigurować plik `.env.local` z odpowiednimi danymi dostępowymi do Supabase:

1. Utwórz plik `.env.local` w głównym katalogu projektu
2. Dodaj do niego następujące zmienne (zastępując wartości rzeczywistymi danymi):

```
VITE_SUPABASE_URL=https://twoj-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=twoj-klucz-dostepowy
```

> **UWAGA**: Plik `.env.local` powinien być dodany do `.gitignore`, aby nie przechowywać wrażliwych danych w repozytorium!

## Użycie

Aby wyczyścić dane testowe, wykonaj:

```bash
npm run cleartest
```

## Jak to działa

Skrypt loguje się na konto testowe zdefiniowane w `tests/e2e/test-data.js` i usuwa wszystkie fiszki należące do tego użytkownika.

## Integracja z Playwright

Mechanizm może być zintegrowany z Playwright jako część procesu "teardown" - zgodnie z dokumentacją teardown-js.md w folderze `ai`.

Zalecane podejście to użycie "Project Dependencies" opisane w dokumentacji, gdzie skrypt czyszczenia danych może być uruchamiany jako projekt o nazwie "cleanup db" po zakończeniu wszystkich testów.

## Rozszerzanie funkcjonalności

Jeśli w przyszłości pojawią się dodatkowe typy danych testowych, mechanizm można łatwo rozszerzyć, dodając kolejne operacje usuwania w pliku `tests/clearTestData.js`.
