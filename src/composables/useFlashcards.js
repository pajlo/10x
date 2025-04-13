import { ref } from 'vue'
import { supabase } from '../services/supabase'

export function useFlashcards() {
  const flashcards = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Pobierz wszystkie fiszki
  async function fetchFlashcards() {
    loading.value = true
    error.value = null
    
    try {
      // Dla PoC bez autentykacji, pobieramy wszystkie fiszki
      const { data, error: supabaseError } = await supabase
        .from('flashcards')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) throw supabaseError

      flashcards.value = data
    } catch (err) {
      console.error('Błąd podczas pobierania fiszek:', err)
      error.value = 'Nie udało się pobrać fiszek. Spróbuj ponownie później.'
    } finally {
      loading.value = false
    }
  }

  // Dodaj nową fiszkę
  async function addFlashcard(front, back) {
    loading.value = true
    error.value = null
    
    try {
      // Dla PoC wykorzystujemy uproszczoną strukturę danych
      const { data, error: supabaseError } = await supabase
        .from('flashcards')
        .insert([
          { 
            front, 
            back,
            // Dodajemy inne wymagane pola z domyślnymi wartościami lub null
            // W pełnym projekcie będziemy używać user_id, ale dla PoC pomijamy
            created_at: new Date(),
            updated_at: new Date()
          }
        ])
        .select()

      if (supabaseError) throw supabaseError
      
      // Odśwież listę fiszek
      await fetchFlashcards()
      
      return data
    } catch (err) {
      console.error('Błąd podczas dodawania fiszki:', err)
      error.value = 'Nie udało się dodać fiszki. Spróbuj ponownie później.'
      return null
    } finally {
      loading.value = false
    }
  }

  // Aktualizuj istniejącą fiszkę
  async function updateFlashcard(id, front, back) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('flashcards')
        .update({ 
          front, 
          back,
          updated_at: new Date()
        })
        .eq('id', id)
        .select()

      if (supabaseError) throw supabaseError
      
      // Odśwież listę fiszek
      await fetchFlashcards()
      
      return data
    } catch (err) {
      console.error('Błąd podczas aktualizacji fiszki:', err)
      error.value = 'Nie udało się zaktualizować fiszki. Spróbuj ponownie później.'
      return null
    } finally {
      loading.value = false
    }
  }

  // Usuń fiszkę
  async function deleteFlashcard(id) {
    loading.value = true
    error.value = null
    
    try {
      const { error: supabaseError } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id)

      if (supabaseError) throw supabaseError
      
      // Odśwież listę fiszek
      await fetchFlashcards()
      
      return true
    } catch (err) {
      console.error('Błąd podczas usuwania fiszki:', err)
      error.value = 'Nie udało się usunąć fiszki. Spróbuj ponownie później.'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    flashcards,
    loading,
    error,
    fetchFlashcards,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard
  }
}
