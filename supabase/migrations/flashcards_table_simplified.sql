-- Uproszczona tabela fiszek dla PoC
-- Ta tabela jest już gotowa w bazie danych, ale dołączam ją dla referencji

-- Jeśli tabela nie istnieje, utwórz ją
create table if not exists public.flashcards (
    id uuid default uuid_generate_v4() primary key,
    front text not null,
    back text not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- Usuń polityki row-level security dla PoC (wszystkie operacje są dozwolone)
drop policy if exists "Użytkownicy mogą czytać swoje fiszki" on public.flashcards;
drop policy if exists "Użytkownicy mogą tworzyć swoje fiszki" on public.flashcards;
drop policy if exists "Użytkownicy mogą aktualizować swoje fiszki" on public.flashcards;
drop policy if exists "Użytkownicy mogą usuwać swoje fiszki" on public.flashcards;

-- Ustaw politykę dostępu dla PoC (bez autentykacji)
alter table public.flashcards disable row level security;
