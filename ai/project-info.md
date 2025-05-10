# Informacje o projekcie 10x-cards

## Struktura komponentów i zależności

### Struktura ASCII

```
+---------------------------------------------------------------------+
|                          10x-cards (Vue.js)                          |
+---------------------------------------------------------------------+
                                |
                +---------------+---------------+
                |                               |
    +-----------v-----------+     +-------------v-------------+
    |      Components       |     |          Views            |
    +-----------------------+     +---------------------------+
    | BaseButton.vue        |     | HomeView.vue              |
    | BaseCard.vue          |     | LoginView.vue             |
    | BaseDialog.vue        |     | RegisterView.vue          |
    | BaseMenu.vue          |     | FlashcardsView.vue        |
    +-----------+-----------+     | MyFlashcardsView.vue      |
                |                 +-------------+-------------+
                |                               |
                |                               |
    +-----------v-----------+     +-------------v-------------+
    |        Stores         |     |       Router              |
    +-----------------------+     +---------------------------+
    | auth.js               <-----+ index.js                  |
    | flashcards.js         |     |                           |
    +-----------+-----------+     +---------------------------+
                |
                |
    +-----------v-----------+
    |        Services       |
    +-----------------------+
    | supabase.js           |
    +-----------------------+
                |
                |
    +-----------v-----------+
    |        Database       |
    +-----------------------+
    |     Supabase DB       |
    |  (flashcards table)   |
    +-----------------------+
```

### Diagram Mermaid

```mermaid
graph TD
    A[10x-cards] --> B[Components]
    A --> C[Views]
    
    B --> B1[BaseButton.vue]
    B --> B2[BaseCard.vue]
    B --> B3[BaseDialog.vue]
    B --> B4[BaseMenu.vue]
    
    C --> C1[HomeView.vue]
    C --> C2[LoginView.vue]
    C --> C3[RegisterView.vue]
    C --> C4[FlashcardsView.vue]
    C --> C5[MyFlashcardsView.vue]
    
    A --> D[Stores]
    D --> D1[auth.js]
    D --> D2[flashcards.js]
    
    A --> E[Router]
    E --> E1[index.js]
    
    D --> F[Services]
    F --> F1[supabase.js]
    
    F --> G[Database]
    G --> G1[Supabase DB]
```

## Struktura zależności

```mermaid
flowchart TD
    App[App.vue] --> Router[Vue Router]
    App --> Auth[stores/auth.js]
    App --> BaseButton[components/BaseButton.vue]
    App --> BaseMenu[components/BaseMenu.vue]
    
    Router --> Auth
    Router --> Views[Views/*.vue]
    
    Auth --> Supabase[supabase.js]
    
    Flashcards[stores/flashcards.js] --> Supabase
    Flashcards --> Auth
    
    Views --> Components[components/Base*.vue]
    Views --> Stores[stores/*.js]
    
    subgraph DataFlow[Przepływ danych]
        User --> View
        View --> Store
        Store --> DB[Supabase]
        DB --> Store
        Store --> View
    end
```

## Opis projektu

Aplikacja 10x-cards jest zbudowana w oparciu o Vue.js i służy jako system fiszek do nauki. Główne elementy architektury obejmują:

1. **Komponenty bazowe** (BaseButton, BaseCard, BaseDialog, BaseMenu) - wielokrotnie używane w widokach
2. **Widoki** (HomeView, LoginView, RegisterView, FlashcardsView, MyFlashcardsView) - główne strony aplikacji
3. **Store'y** (auth.js, flashcards.js) - zarządzanie stanem aplikacji przy użyciu Pinia
4. **Serwisy** (supabase.js) - integracja z bazą danych Supabase
5. **Router** - nawigacja między widokami z zabezpieczeniem tras wymagających autoryzacji

Aplikacja umożliwia użytkownikom rejestrację, logowanie, tworzenie własnych fiszek oraz przeprowadzanie sesji nauki.

## Technologie

- **Frontend**: Vue.js 3, Vue Router, Pinia, Tailwind CSS
- **Backend**: Supabase (autoryzacja, baza danych)
- **Testy**: Playwright (e2e), Vitest (unit)
- **Tooling**: Vite, PostCSS

## Struktura folderów

```
src/
  ├── App.vue                # Główny komponent aplikacji
  ├── main.js                # Punkt wejściowy aplikacji
  ├── supabase.js            # Konfiguracja Supabase
  ├── assets/                # Zasoby statyczne (CSS, obrazy)
  ├── components/            # Komponenty wielokrotnego użytku
  ├── composables/           # Kompozycyjne funkcje Vue
  ├── router/                # Konfiguracja routera
  ├── services/              # Serwisy do komunikacji z API
  ├── stores/                # Magazyny stanu (Pinia)
  └── views/                 # Widoki (strony) aplikacji
```