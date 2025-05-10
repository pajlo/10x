import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../supabase';
import { useAuthStore } from './auth';

export const useFlashcardsStore = defineStore('flashcards', () => {
  const flashcards = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const authStore = useAuthStore();

  // Pobieranie fiszek z bazy danych
  const fetchFlashcards = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data: flashcardsData, error: dbError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', authStore.user?.id)
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;

      flashcards.value = flashcardsData;
    } catch (err) {
      error.value = err.message || 'Błąd podczas pobierania fiszek';
      console.error(error.value);
    } finally {
      loading.value = false;
    }
  };

  // Dodawanie nowej fiszki
  const addFlashcard = async (front, back) => {
    loading.value = true;
    error.value = null;

    try {
      const newFlashcard = {
        user_id: authStore.user.id,
        question: front, // Zmienione z 'front' na 'question'
        answer: back, // Zmienione z 'back' na 'answer'
        manually_created: true,
        created_at: new Date().toISOString(),
      };

      const { data, error: dbError } = await supabase
        .from('flashcards')
        .insert(newFlashcard)
        .select();

      if (dbError) throw dbError;

      // Dodajemy nową fiszkę na początku listy
      if (data && data.length > 0) {
        flashcards.value = [data[0], ...flashcards.value];
      }

      return { success: true };
    } catch (err) {
      error.value = err.message || 'Błąd podczas dodawania fiszki';
      console.error(error.value);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Aktualizacja istniejącej fiszki
  const updateFlashcard = async (id, front, back) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: dbError } = await supabase
        .from('flashcards')
        .update({
          question: front, // Zmienione z 'front' na 'question'
          answer: back, // Zmienione z 'back' na 'answer'
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', authStore.user.id) // Zabezpieczenie - tylko właściciel może edytować
        .select();

      if (dbError) throw dbError;

      // Aktualizujemy fiszkę w lokalnej liście
      if (data && data.length > 0) {
        const index = flashcards.value.findIndex((card) => card.id === id);
        if (index !== -1) {
          flashcards.value[index] = data[0];
        }
      }

      return { success: true };
    } catch (err) {
      error.value = err.message || 'Błąd podczas aktualizacji fiszki';
      console.error(error.value);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Usuwanie fiszki
  const deleteFlashcard = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      const { error: dbError } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id)
        .eq('user_id', authStore.user.id); // Zabezpieczenie - tylko właściciel może usuwać

      if (dbError) throw dbError;

      // Usuwamy fiszkę z lokalnej listy
      flashcards.value = flashcards.value.filter((card) => card.id !== id);

      return { success: true };
    } catch (err) {
      error.value = err.message || 'Błąd podczas usuwania fiszki';
      console.error(error.value);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  return {
    flashcards,
    loading,
    error,
    fetchFlashcards,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
  };
});
