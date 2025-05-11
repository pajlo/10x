-- Dodanie kolumn do tabeli fiszek dla obsługi AI i logowania
-- Zmiana nazwy kolumn z front/back na question/answer dla większej czytelności
-- Dodanie flagi manually_created (czy fiszka została utworzona ręcznie)
-- Dodanie user_id do powiązania fiszek z użytkownikami

-- Dodanie kolumny user_id
ALTER TABLE IF EXISTS public.flashcards 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Dodanie flagi manually_created (domyślnie true - ręcznie utworzone)
ALTER TABLE IF EXISTS public.flashcards 
ADD COLUMN IF NOT EXISTS manually_created BOOLEAN DEFAULT true;

-- Zmiana nazwy kolumn (opcjonalne, jeśli chcemy zachować spójność)
-- Jeśli kolumny question i answer nie istnieją, utworzymy je na podstawie front i back
DO $$
BEGIN
    -- Sprawdź czy kolumny question i answer istnieją
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flashcards' AND column_name = 'question'
    ) THEN
        -- Dodaj nowe kolumny
        ALTER TABLE public.flashcards ADD COLUMN question TEXT;
        ALTER TABLE public.flashcards ADD COLUMN answer TEXT;
        
        -- Przekopiuj dane ze starych kolumn
        UPDATE public.flashcards SET question = front, answer = back;
        
        -- Ustaw NOT NULL constraint
        ALTER TABLE public.flashcards ALTER COLUMN question SET NOT NULL;
        ALTER TABLE public.flashcards ALTER COLUMN answer SET NOT NULL;
    END IF;
END
$$;

-- Włącz row level security dla ochrony danych użytkowników
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

-- Ustaw polityki bezpieczeństwa
CREATE POLICY "Użytkownicy mogą czytać swoje fiszki"
    ON public.flashcards FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Użytkownicy mogą tworzyć swoje fiszki"
    ON public.flashcards FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Użytkownicy mogą aktualizować swoje fiszki"
    ON public.flashcards FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Użytkownicy mogą usuwać swoje fiszki"
    ON public.flashcards FOR DELETE
    USING (auth.uid() = user_id);