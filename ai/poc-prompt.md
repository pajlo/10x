# Prompt do generowania Proof of Concept: Ręczne zarządzanie fiszkami w projekcie 10x-cards

## Cel PoC

Stworzenie prostego, działającego prototypu, który pozwoli na weryfikację podstawowych funkcjonalności ręcznego tworzenia i zarządzania fiszkami edukacyjnymi. PoC ma umożliwić sprawdzenie poprawności założeń architektury bez implementacji funkcji AI i zaawansowanego zarządzania użytkownikami.

## Zakres funkcjonalności do zaimplementowania

### W zakresie:

1. **Ręczne tworzenie fiszek** - formularz z polami "Przód" i "Tył" fiszki
2. **Wyświetlanie listy fiszek** w widoku "Moje fiszki"
3. **Edycja istniejących fiszek**
4. **Usuwanie fiszek** z potwierdzeniem
5. **Podstawowe przechowywanie danych** w Supabase
6. **Uproszczony interfejs użytkownika** z wykorzystaniem Tailwind CSS

### Poza zakresem PoC:

1. ~~Generowanie fiszek przy pomocy AI~~
2. ~~Rejestracja i logowanie użytkowników~~
3. ~~Sesja nauki z algorytmem powtórek~~
4. ~~Zbieranie statystyk~~
5. ~~Zaawansowane funkcje zarządzania kontem~~

## Stack technologiczny do wykorzystania

- **Frontend**: Vue.js 3 (Composition API), Vite, Tailwind CSS, Pinia
- **Backend**: Supabase (uproszczona konfiguracja, bez autoryzacji)
- **Baza danych**: PostgreSQL (poprzez Supabase)

## Struktura danych

### Tabela: flashcards

- id: UUID (primary key)
- front: text (przód fiszki)
- back: text (tył fiszki)
- created_at: timestamp
- updated_at: timestamp

## Oczekiwany proces pracy

1. **Planowanie**: Przygotuj plan implementacji PoC z podziałem na etapy i **poczekaj na moją akceptację** przed rozpoczęciem implementacji.
2. **Implementacja** z jasnym podziałem na komponenty:

   - Stworzenie struktury projektu z wykorzystaniem Vue 3 i Vite
   - Konfiguracja Supabase i utworzenie bazy danych
   - Implementacja widoku listy fiszek
   - Implementacja formularza dodawania/edycji fiszek
   - Implementacja funkcji usuwania fiszek

3. **Instrukcja uruchomienia** - krok po kroku jak skonfigurować i uruchomić aplikację lokalnie

## Dodatkowe wytyczne

- Kod powinien być czytelny i dobrze skomentowany
- Wykorzystaj composables dla logiki biznesowej
- Zastosuj reactive state z Pinia do zarządzania stanem aplikacji
- Interfejs użytkownika ma być prosty, ale estetyczny z wykorzystaniem Tailwind CSS
- Priorytetem jest poprawność działania, a nie zaawansowana stylizacja
