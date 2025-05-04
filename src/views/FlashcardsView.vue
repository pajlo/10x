<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useFlashcardsStore } from '../stores/flashcards';
import BaseButton from '../components/BaseButton.vue';

const authStore = useAuthStore();
const flashcardsStore = useFlashcardsStore();
const currentCardIndex = ref(0);
const showAnswer = ref(false);
const isLoading = ref(true);
const isFlipping = ref(false);

const flashcards = computed(() => flashcardsStore.flashcards);

onMounted(async () => {
  isLoading.value = true;
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
  // Rozpoczynamy animację
  isFlipping.value = true;
  
  // Po zakończeniu animacji flippingu (300ms) zmieniamy zawartość i resetujemy stan animacji
  setTimeout(() => {
    showAnswer.value = !showAnswer.value;
    isFlipping.value = false;
  }, 300);
};

const currentFlashcard = computed(() => 
  flashcards.value[currentCardIndex.value] || null
);

// Funkcja pomocnicza do obsługi obu formatów fiszek
const getQuestion = (flashcard) => {
  return flashcard ? (flashcard.question || flashcard.front) : '';
};

const getAnswer = (flashcard) => {
  return flashcard ? (flashcard.answer || flashcard.back) : '';
};
</script>

<template>
  <div class="flashcards-container max-w-3xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-blue-700">Sesja nauki</h1>
    </div>
    
    <div v-if="isLoading || flashcardsStore.loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Ładowanie fiszek...</p>
    </div>
    
    <div v-else-if="flashcards.length === 0" class="text-center py-12 bg-white rounded-lg shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      <p class="text-xl text-gray-600 mb-4">Brak dostępnych fiszek</p>
      <router-link to="/my-flashcards">
        <BaseButton>
          Dodaj fiszki, aby rozpocząć naukę
        </BaseButton>
      </router-link>
    </div>
    
    <div v-else>
      <!-- Licznik kart -->
      <div class="text-right text-gray-500 mb-4">
        {{ currentCardIndex + 1 }} / {{ flashcards.length }}
      </div>
      
      <!-- Karta do nauki z animacją -->
      <div class="card-container">
        <div 
          class="flipcard cursor-pointer"
          @click="toggleAnswer"
        >
          <div class="flipcard-inner" :class="{ 'flipped': showAnswer, 'flipping': isFlipping }">
            <div class="flipcard-front">
              <div class="text-xl font-medium">
                {{ getQuestion(currentFlashcard) }}
              </div>
            </div>
            <div class="flipcard-back">
              <div class="text-lg">
                {{ getAnswer(currentFlashcard) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-center space-x-2 my-6">
        <p class="text-gray-600 text-sm">
          Kliknij kartę, aby zobaczyć {{ showAnswer ? 'pytanie' : 'odpowiedź' }}
        </p>
      </div>
      
      <!-- Przyciski nawigacji -->
      <div class="flex justify-between">
        <BaseButton
          variant="secondary"
          :disabled="currentCardIndex === 0"
          @click="previousCard"
        >
          Poprzednia
        </BaseButton>
        
        <BaseButton
          :disabled="currentCardIndex === flashcards.length - 1"
          @click="nextCard"
        >
          Następna
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  perspective: 1000px;
  margin-bottom: 2rem;
}

.flipcard {
  background-color: transparent;
  width: 100%;
  height: 300px;
}

.flipcard-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.3s;
  transform-style: preserve-3d;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  border-radius: 0.5rem;
}

.flipcard-inner.flipped {
  transform: rotateY(180deg);
}

.flipcard-inner.flipping {
  pointer-events: none; /* Blokuj interakcje podczas animacji */
}

.flipcard-front, .flipcard-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: white;
  border-radius: 0.5rem;
}

.flipcard-front {
  color: black;
}

.flipcard-back {
  transform: rotateY(180deg);
  color: black;
}
</style>
