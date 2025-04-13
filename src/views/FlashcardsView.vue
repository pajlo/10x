<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useFlashcardsStore } from '../stores/flashcards';

const authStore = useAuthStore();
const flashcardsStore = useFlashcardsStore();
const currentCardIndex = ref(0);
const showAnswer = ref(false);
const isLoading = ref(true);

// Obliczana właściwość zwracająca fiszki z store'a
const flashcards = computed(() => flashcardsStore.flashcards);

onMounted(async () => {
  isLoading.value = true;
  // Pobierz fiszki z bazy danych zamiast używać testowego zestawu
  await flashcardsStore.fetchFlashcards();
  isLoading.value = false;
});

const nextCard = () => {
  if (currentCardIndex.value < flashcards.value.length - 1) {
    currentCardIndex.value++;
    showAnswer.value = false;
  }
};

const previousCard = () => {
  if (currentCardIndex.value > 0) {
    currentCardIndex.value--;
    showAnswer.value = false;
  }
};

const toggleAnswer = () => {
  showAnswer.value = !showAnswer.value;
};
</script>

<template>
  <div class="flashcards-container max-w-3xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-blue-700">Sesja nauki</h1>
      <!-- W przyszłości tutaj będzie dropdown do wybierania zestawów fiszek -->
    </div>
    
    <div v-if="isLoading || flashcardsStore.loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Ładowanie fiszek...</p>
    </div>
    
    <div v-else-if="flashcards.length === 0" class="text-center py-12">
      <p class="text-xl text-gray-600">Brak dostępnych fiszek</p>
      <router-link to="/my-flashcards" class="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        Dodaj fiszki, aby rozpocząć naukę
      </router-link>
    </div>
    
    <div v-else class="bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="p-6 md:p-8">
        <!-- Licznik kart -->
        <div class="text-right text-gray-500 mb-4">
          {{ currentCardIndex + 1 }} / {{ flashcards.length }}
        </div>
        
        <!-- Karta -->
        <div 
          class="flashcard min-h-[200px] mb-6 p-6 bg-blue-50 rounded-lg cursor-pointer"
          @click="toggleAnswer"
        >
          <div v-if="!showAnswer" class="text-xl font-medium text-center">
            {{ flashcards[currentCardIndex].question }}
          </div>
          <div v-else class="text-lg text-center">
            {{ flashcards[currentCardIndex].answer }}
          </div>
        </div>
        
        <div class="flex justify-center space-x-2 mb-4">
          <p class="text-gray-600 text-sm">Kliknij kartę, aby zobaczyć {{ showAnswer ? 'pytanie' : 'odpowiedź' }}</p>
        </div>
        
        <!-- Przyciski nawigacji -->
        <div class="flex justify-between">
          <button 
            @click="previousCard"
            :disabled="currentCardIndex === 0"
            :class="[
              'px-4 py-2 rounded transition-colors',
              currentCardIndex === 0 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            ]"
          >
            Poprzednia
          </button>
          
          <button 
            @click="nextCard"
            :disabled="currentCardIndex === flashcards.length - 1"
            :class="[
              'px-4 py-2 rounded transition-colors',
              currentCardIndex === flashcards.length - 1 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            ]"
          >
            Następna
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Style specificzne dla widoku fiszek */
</style>
