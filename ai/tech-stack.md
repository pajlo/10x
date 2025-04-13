# Stack technologiczny projektu 10x-cards
## Frontend:
- Vue.js 3 (z Composition API) - framework JavaScript do budowy interfejsu użytkownika
- Vite - szybkie narzędzie do budowania projektu
- Tailwind CSS - narzędzie do stylizacji opartej na klasach utility
- Pinia - biblioteka do zarządzania stanem aplikacji
- Vue Router - router dla aplikacji SPA

## Backend i baza danych:
- Supabase - platforma Backend as a Service
-- PostgreSQL jako baza danych
-- Gotowy system autentykacji
-- Row Level Security (RLS) do zabezpieczenia danych
-- REST API

## Integracje:
- OpenAI API - do generowania fiszek poprzez AI
- SuperMemo/SM-2 - algorytm spaced repetition (dostępny jako biblioteka npm)

## Hosting:
- Lokalny development: Vite Dev Server
- Produkcja: własny serwer z Nginx/Apache

## Struktura projektu:

```
10x-cards/
├── public/              # Statyczne zasoby
├── src/
│   ├── assets/          # Obrazy, fonty, itp.
│   ├── components/      # Komponenty Vue
│   ├── composables/     # Współużywalne funkcje logiki biznesowej  
│   ├── pages/           # Główne widoki aplikacji
│   ├── services/        # Usługi (OpenAI, Supabase)
│   ├── stores/          # Pinia stores do zarządzania stanem
│   ├── router/          # Konfiguracja Vue Router
│   ├── utils/           # Funkcje pomocnicze
│   ├── App.vue          # Główny komponent
│   └── main.js          # Punkt wejścia aplikacji
└── [pozostałe pliki konfiguracyjne]
```