<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold mb-4">Generuj fiszki z tekstem</h2>
    <p class="mb-4 text-gray-600">
      Wklej tekst (min. 100, max. 10 000 znaków) poniżej, aby wygenerować propozycje fiszek
      przy użyciu sztucznej inteligencji.
    </p>

    <div class="mb-6">
      <textarea
        v-model="inputText"
        class="w-full h-64 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Wklej tutaj swój tekst do analizy..."
        :disabled="isGenerating"
      ></textarea>
      <div class="flex justify-between text-sm text-gray-500 mt-2">
        <span>{{ charactersCount }} / 10 000 znaków</span>
        <span v-if="charactersCount < 100" class="text-red-500">
          Wymagane minimum 100 znaków
        </span>
      </div>
    </div>

    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <label for="flashcards-count" class="mr-3 text-gray-700">Liczba fiszek:</label>
        <select
          id="flashcards-count"
          v-model="flashcardsCount"
          class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :disabled="isGenerating"
        >
          <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>

      <BaseButton
        :disabled="!canGenerate || isGenerating"
        :loading="isGenerating"
        @click="generateFlashcards"
      >
        {{ isGenerating ? 'Generowanie...' : 'Generuj fiszki' }}
      </BaseButton>
    </div>

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
      {{ error }}
    </div>

    <!-- Propozycje fiszek -->
    <div v-if="suggestedFlashcards.length > 0">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold">Propozycje fiszek</h3>
        <div class="flex gap-2">
          <BaseButton
            variant="secondary"
            @click="clearSuggestions"
            class="text-sm"
          >
            Wyczyść wszystkie
          </BaseButton>
          <BaseButton
            @click="saveAcceptedCards"
            class="text-sm"
            :disabled="!hasAcceptedCards"
          >
            Zapisz zaakceptowane ({{ acceptedCardsCount }})
          </BaseButton>
        </div>
      </div>

      <div class="space-y-4">
        <div
          v-for="card in suggestedFlashcards"
          :key="card.id"
          class="border rounded-lg p-4 transition-all"
          :class="card.isAccepted ? 'border-green-500 bg-green-50' : 'border-gray-200'"
        >
          <div class="flex justify-between items-start mb-2">
            <div class="flex flex-col w-full">
              <div class="mb-3 w-full">
                <p class="font-medium text-gray-700 mb-1">Przód:</p>
                <div v-if="editingCard === card.id">
                  <textarea
                    v-model="editedFront"
                    class="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  ></textarea>
                </div>
                <p v-else class="p-2 bg-gray-50 rounded">{{ card.front }}</p>
              </div>
              
              <div class="w-full">
                <p class="font-medium text-gray-700 mb-1">Tył:</p>
                <div v-if="editingCard === card.id">
                  <textarea
                    v-model="editedBack"
                    class="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  ></textarea>
                </div>
                <p v-else class="p-2 bg-gray-50 rounded">{{ card.back }}</p>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end gap-2 mt-3">
            <template v-if="editingCard === card.id">
              <BaseButton
                variant="secondary"
                size="sm"
                @click="cancelEdit"
              >
                Anuluj
              </BaseButton>
              <BaseButton
                size="sm"
                @click="saveEdit(card.id)"
              >
                Zapisz zmiany
              </BaseButton>
            </template>
            <template v-else>
              <BaseButton
                v-if="!card.isAccepted"
                variant="danger"
                size="sm"
                @click="rejectCard(card.id)"
              >
                Odrzuć
              </BaseButton>
              <BaseButton
                variant="secondary"
                size="sm"
                @click="startEdit(card)"
              >
                Edytuj
              </BaseButton>
              <BaseButton
                v-if="!card.isAccepted"
                variant="success"
                size="sm"
                @click="acceptCard(card.id)"
              >
                Akceptuj
              </BaseButton>
              <BaseButton
                v-else
                variant="secondary"
                size="sm"
                @click="unacceptCard(card.id)"
              >
                Cofnij akceptację
              </BaseButton>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import BaseButton from '../components/BaseButton.vue';
import { useFlashcardsStore } from '../stores/flashcards';

const flashcardsStore = useFlashcardsStore();

const inputText = ref('');
const flashcardsCount = ref(5);
const editingCard = ref(null);
const editedFront = ref('');
const editedBack = ref('');

// Obliczanie liczby znaków
const charactersCount = computed(() => inputText.value.length);

// Sprawdzanie warunków do generowania
const canGenerate = computed(() => 
  charactersCount.value >= 100 && charactersCount.value <= 10000
);

// Skrót do stanu generowania
const isGenerating = computed(() => flashcardsStore.generatingFlashcards);

// Skrót do błędu ze store'a
const error = computed(() => flashcardsStore.error);

// Skrót do propozycji fiszek
const suggestedFlashcards = computed(() => flashcardsStore.suggestedFlashcards);

// Liczba zaakceptowanych kart
const acceptedCardsCount = computed(() => 
  suggestedFlashcards.value.filter(card => card.isAccepted).length
);

// Sprawdzanie czy są jakieś zaakceptowane karty
const hasAcceptedCards = computed(() => acceptedCardsCount.value > 0);

// Generowanie fiszek
const generateFlashcards = async () => {
  if (!canGenerate.value) return;
  
  await flashcardsStore.generateFlashcardSuggestions(inputText.value, flashcardsCount.value);
};

// Akceptacja fiszki
const acceptCard = (id) => {
  flashcardsStore.acceptSuggestedFlashcard(id);
};

// Cofnięcie akceptacji
const unacceptCard = (id) => {
  flashcardsStore.acceptSuggestedFlashcard(id); // Toggle isAccepted
};

// Odrzucenie fiszki
const rejectCard = (id) => {
  flashcardsStore.rejectSuggestedFlashcard(id);
};

// Rozpoczęcie edycji fiszki
const startEdit = (card) => {
  editingCard.value = card.id;
  editedFront.value = card.front;
  editedBack.value = card.back;
};

// Anulowanie edycji
const cancelEdit = () => {
  editingCard.value = null;
};

// Zapisanie zmian edycji
const saveEdit = (id) => {
  flashcardsStore.updateSuggestedFlashcard(id, editedFront.value, editedBack.value);
  editingCard.value = null;
};

// Czyszczenie wszystkich propozycji
const clearSuggestions = () => {
  flashcardsStore.clearSuggestedFlashcards();
};

// Zapisywanie zaakceptowanych fiszek
const saveAcceptedCards = async () => {
  const result = await flashcardsStore.saveAcceptedFlashcards();
  if (result.success && result.count === 0) {
    alert('Nie wybrano żadnych fiszek do zapisania');
  } else if (result.success) {
    alert(`Zapisano ${result.count} fiszek do twojej kolekcji`);
  }
};
</script>