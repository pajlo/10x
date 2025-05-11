import { supabase } from '../supabase';

/**
 * Generuje fiszki na podstawie dostarczonego tekstu za pomocą Supabase Edge Function
 * @param {string} text - Tekst do analizy
 * @param {number} [count=5] - Liczba fiszek do wygenerowania
 * @returns {Promise<Array<{front: string, back: string}>>} - Tablica wygenerowanych fiszek
 */
export async function generateFlashcards(text, count = 5) {
  try {
    // Pobieramy token dostępowy zalogowanego użytkownika
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Nie jesteś zalogowany');
    }

    // URL do Supabase Edge Function
    const functionsUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-flashcards`;

    // Wywołanie Edge Function
    const response = await fetch(functionsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ text, count })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Wystąpił błąd podczas generowania fiszek');
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