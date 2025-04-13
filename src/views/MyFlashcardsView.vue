<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFlashcardsStore } from '../stores/flashcards';
import { useAuthStore } from '../stores/auth';

const flashcardsStore = useFlashcardsStore();
const authStore = useAuthStore();

// Stan formularza do tworzenia/edycji fiszki
const isFormVisible = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const front = ref('');
const back = ref('');
const formError = ref('');

// Pobieranie fiszek przy montowaniu komponentu
onMounted(async () => {
  await flashcardsStore.fetchFlashcards();
});

// Obliczane właściwości
const hasFlashcards = computed(() => flashcardsStore.flashcards.length > 0);

// Metody do zarządzania formularzem
const showAddForm = () => {
  front.value = '';
  back.value = '';
  formError.value = '';
  isEditing.value = false;
  editingId.value = null;
  isFormVisible.value = true;
};

const showEditForm = (flashcard) => {
  front.value = flashcard.question;  // Zmienione z flashcard.front na flashcard.question
  back.value = flashcard.answer;     // Zmienione z flashcard.back na flashcard.answer
  formError.value = '';
  isEditing.value = true;
  editingId.value = flashcard.id;
  isFormVisible.value = true;
};

const cancelForm = () => {
  isFormVisible.value = false;
};

// Zapisywanie nowej lub edytowanej fiszki
const saveFlashcard = async () => {
  // Walidacja
  if (!front.value.trim() || !back.value.trim()) {
    formError.value = 'Oba pola są wymagane';
    return;
  }
  
  let result;
  
  if (isEditing.value) {
    // Aktualizacja istniejącej fiszki
    result = await flashcardsStore.updateFlashcard(editingId.value, front.value, back.value);
  } else {
    // Dodawanie nowej fiszki
    result = await flashcardsStore.addFlashcard(front.value, back.value);
  }
  
  if (result.success) {
    isFormVisible.value = false;
  } else {
    formError.value = result.error || 'Wystąpił problem';
  }
};

// Potwierdzenie usunięcia fiszki
const confirmDelete = ref(false);
const flashcardToDelete = ref(null);

const showDeleteConfirmation = (flashcard) => {
  flashcardToDelete.value = flashcard;
  confirmDelete.value = true;
};

const cancelDelete = () => {
  confirmDelete.value = false;
  flashcardToDelete.value = null;
};

const confirmDeleteFlashcard = async () => {
  if (flashcardToDelete.value) {
    await flashcardsStore.deleteFlashcard(flashcardToDelete.value.id);
    confirmDelete.value = false;
    flashcardToDelete.value = null;
  }
};
</script>

<template>
  <div class="my-flashcards">
    <div class="mb-8 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-blue-700">Moje fiszki</h1>
      <button 
        @click="showAddForm" 
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Dodaj fiszkę
      </button>
    </div>
    
    <!-- Formularz dodawania/edycji fiszki -->
    <div v-if="isFormVisible" class="mb-8 bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">{{ isEditing ? 'Edytuj fiszkę' : 'Dodaj nową fiszkę' }}</h2>
      
      <div v-if="formError" class="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
        {{ formError }}
      </div>
      
      <div class="mb-4">
        <label for="front" class="block text-gray-700 font-medium mb-2">Przód fiszki (pytanie)</label>
        <textarea 
          id="front"
          v-model="front"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Wpisz pytanie lub definicję..."
        ></textarea>
      </div>
      
      <div class="mb-4">
        <label for="back" class="block text-gray-700 font-medium mb-2">Tył fiszki (odpowiedź)</label>
        <textarea 
          id="back"
          v-model="back"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Wpisz odpowiedź..."
        ></textarea>
      </div>
      
      <div class="flex justify-end space-x-4">
        <button 
          @click="cancelForm"
          class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
        >
          Anuluj
        </button>
        <button 
          @click="saveFlashcard"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {{ isEditing ? 'Zapisz zmiany' : 'Dodaj fiszkę' }}
        </button>
      </div>
    </div>
    
    <!-- Loading spinner -->
    <div v-if="flashcardsStore.loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Ładowanie fiszek...</p>
    </div>
    
    <!-- Brak fiszek -->
    <div v-else-if="!hasFlashcards" class="text-center py-16 bg-gray-50 rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      <h2 class="text-xl font-medium text-gray-600 mb-2">Brak fiszek</h2>
      <p class="text-gray-500 mb-4">Rozpocznij naukę dodając swoją pierwszą fiszkę</p>
      <button 
        @click="showAddForm" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Dodaj fiszkę
      </button>
    </div>
    
    <!-- Lista fiszek -->
    <div v-else class="grid gap-4 md:grid-cols-2">
      <div v-for="flashcard in flashcardsStore.flashcards" :key="flashcard.id" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-5 border-b">
          <h3 class="font-semibold text-lg mb-2">Pytanie:</h3>
          <p>{{ flashcard.question }}</p>  <!-- Zmienione z flashcard.front na flashcard.question -->
        </div>
        <div class="p-5">
          <h3 class="font-semibold text-lg mb-2">Odpowiedź:</h3>
          <p>{{ flashcard.answer }}</p>  <!-- Zmienione z flashcard.back na flashcard.answer -->
        </div>
        <div class="px-5 py-3 bg-gray-50 flex justify-end gap-2">
          <button 
            @click="showEditForm(flashcard)" 
            class="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            Edytuj
          </button>
          <button 
            @click="showDeleteConfirmation(flashcard)" 
            class="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            Usuń
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal potwierdzenia usunięcia -->
    <div v-if="confirmDelete" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-lg font-semibold mb-3">Potwierdź usunięcie</h3>
        <p class="mb-4">Czy na pewno chcesz usunąć tę fiszkę? Tej operacji nie można cofnąć.</p>
        <div class="flex justify-end space-x-2">
          <button 
            @click="cancelDelete" 
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            Anuluj
          </button>
          <button 
            @click="confirmDeleteFlashcard" 
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Usuń fiszkę
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
