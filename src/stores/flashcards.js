import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../supabase';
import { useAuthStore } from './auth';
import { generateFlashcards } from '../services/openai';

export const useFlashcardsStore = defineStore('flashcards', () => {
  const flashcards = ref([]);
  const suggestedFlashcards = ref([]); // Propozycje fiszek z AI
  const loading = ref(false);
  const generatingFlashcards = ref(false); // Stan ładowania podczas generowania fiszek
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

  // Generowanie propozycji fiszek przy użyciu OpenAI
  const generateFlashcardSuggestions = async (text, count = 5) => {
    generatingFlashcards.value = true;
    error.value = null;
    suggestedFlashcards.value = [];

    try {
      const suggestions = await generateFlashcards(text, count);
      suggestedFlashcards.value = suggestions.map(card => ({
        ...card,
        id: `suggested-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Tymczasowe ID
        isAccepted: false // Flaga do śledzenia zaakceptowanych propozycji
      }));
      return { success: true };
    } catch (err) {
      error.value = err.message || 'Błąd podczas generowania propozycji fiszek';
      console.error(error.value);
      return { success: false, error: error.value };
    } finally {
      generatingFlashcards.value = false;
    }
  };

  // Akceptowanie propozycji fiszki
  const acceptSuggestedFlashcard = (id) => {
    const index = suggestedFlashcards.value.findIndex(card => card.id === id);
    if (index !== -1) {
      suggestedFlashcards.value[index].isAccepted = true;
    }
  };

  // Odrzucanie propozycji fiszki
  const rejectSuggestedFlashcard = (id) => {
    suggestedFlashcards.value = suggestedFlashcards.value.filter(card => card.id !== id);
  };

  // Edycja propozycji fiszki
  const updateSuggestedFlashcard = (id, front, back) => {
    const index = suggestedFlashcards.value.findIndex(card => card.id === id);
    if (index !== -1) {
      suggestedFlashcards.value[index].front = front;
      suggestedFlashcards.value[index].back = back;
    }
  };

  // Zapisywanie zaakceptowanych propozycji do bazy
  const saveAcceptedFlashcards = async () => {
    const acceptedFlashcards = suggestedFlashcards.value.filter(card => card.isAccepted);
    
    if (acceptedFlashcards.length === 0) {
      return { success: true, message: 'Brak zaakceptowanych fiszek do zapisania' };
    }

    loading.value = true;
    error.value = null;

    try {
      // Przygotowanie fiszek do zapisania w formacie bazy danych
      const flashcardsToSave = acceptedFlashcards.map(card => ({
        user_id: authStore.user.id,
        question: card.front,
        answer: card.back,
        manually_created: false, // Oznaczenie, że fiszka została wygenerowana przez AI
        created_at: new Date().toISOString(),
      }));

      const { data, error: dbError } = await supabase
        .from('flashcards')
        .insert(flashcardsToSave)
        .select();

      if (dbError) throw dbError;

      // Dodajemy zapisane fiszki do lokalnej listy
      if (data && data.length > 0) {
        flashcards.value = [...data, ...flashcards.value];
      }

      // Usuwamy zapisane propozycje z listy propozycji
      suggestedFlashcards.value = suggestedFlashcards.value.filter(card => !card.isAccepted);

      return { 
        success: true, 
        message: `Zapisano ${acceptedFlashcards.length} fiszek`,
        count: acceptedFlashcards.length 
      };
    } catch (err) {
      error.value = err.message || 'Błąd podczas zapisywania fiszek';
      console.error(error.value);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Czyszczenie propozycji fiszek
  const clearSuggestedFlashcards = () => {
    suggestedFlashcards.value = [];
  };

  return {
    flashcards,
    suggestedFlashcards,
    loading,
    generatingFlashcards,
    error,
    fetchFlashcards,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    generateFlashcardSuggestions,
    acceptSuggestedFlashcard,
    rejectSuggestedFlashcard,
    updateSuggestedFlashcard,
    saveAcceptedFlashcards,
    clearSuggestedFlashcards
  };
});
