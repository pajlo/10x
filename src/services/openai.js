import { supabase } from '../supabase';

/**
 * Generuje fiszki na podstawie dostarczonego tekstu za pomocą Supabase Edge Function
 * @param {string} text - Tekst do analizy
 * @param {number} [count=5] - Liczba fiszek do wygenerowania
 * @returns {Promise<Array<{front: string, back: string}>>} - Tablica wygenerowanych fiszek
 */
export async function generateFlashcards(text, count = 5) {
  try {
    // Pobieramy aktualną sesję i upewniamy się, że token jest aktualny
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Błąd podczas pobierania sesji:', sessionError);
      throw new Error('Problem z autoryzacją: ' + sessionError.message);
    }
    
    if (!session) {
      throw new Error('Nie jesteś zalogowany');
    }

    // Upewnij się, że token jest aktualny próbując go odświeżyć
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
    
    if (refreshError) {
      console.warn('Nie udało się odświeżyć sesji:', refreshError);
      // Kontynuujemy z obecnym tokenem, ale logujemy ostrzeżenie
    }
    
    // Użyjemy nowego tokenu jeśli odświeżanie się powiodło, w przeciwnym razie użyjemy aktualnego
    const currentSession = refreshData?.session || session;
    
    // URL do Supabase Edge Function
    const functionsUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-flashcards`;
    
    // Dodaj logging na potrzeby debugowania
    console.log('Wywołuję edge function z URL:', functionsUrl);

    // Wywołanie Edge Function
    const response = await fetch(functionsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentSession.access_token}`
      },
      body: JSON.stringify({ text, count })
    });

    if (!response.ok) {
      let errorMessage = 'Wystąpił błąd podczas generowania fiszek';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (parseError) {
        console.error('Nie udało się sparsować odpowiedzi błędu:', parseError);
      }
      throw new Error(errorMessage);
    }

    const { flashcards } = await response.json();
    return flashcards;
  } catch (error) {
    console.error('Błąd podczas generowania fiszek:', error);
    throw new Error(`Nie udało się wygenerować fiszek: ${error.message}`);
  }
}

export default {
  generateFlashcards,
};