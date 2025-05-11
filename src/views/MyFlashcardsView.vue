<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useFlashcardsStore } from '../stores/flashcards';
  import { useAuthStore } from '../stores/auth';
  import BaseButton from '../components/BaseButton.vue';
  import BaseDialog from '../components/BaseDialog.vue';
  import BaseCard from '../components/BaseCard.vue';
  import FlashcardGenerator from '../components/FlashcardGenerator.vue';

  const flashcardsStore = useFlashcardsStore();
  const authStore = useAuthStore();

  const activeTab = ref('my-flashcards'); // 'my-flashcards' lub 'generate'
  const showAddDialog = ref(false);
  const showDeleteDialog = ref(false);
  const editingFlashcard = ref(null);
  const flashcardToDelete = ref(null);
  const front = ref('');
  const back = ref('');
  const formError = ref('');

  onMounted(async () => {
    await flashcardsStore.fetchFlashcards();
  });

  const hasFlashcards = computed(() => flashcardsStore.flashcards.length > 0);

  const resetForm = () => {
    front.value = '';
    back.value = '';
    formError.value = '';
    editingFlashcard.value = null;
  };

  const showEditDialog = (flashcard) => {
    editingFlashcard.value = flashcard;
    // Obsługa zarówno starych pól (front/back) jak i nowych (question/answer)
    front.value = flashcard.question || flashcard.front;
    back.value = flashcard.answer || flashcard.back;
    showAddDialog.value = true;
  };

  const handleSave = async () => {
    if (!front.value.trim() || !back.value.trim()) {
      formError.value = 'Oba pola są wymagane';
      return;
    }

    let result;
    if (editingFlashcard.value) {
      result = await flashcardsStore.updateFlashcard(
        editingFlashcard.value.id,
        front.value,
        back.value,
      );
    } else {
      result = await flashcardsStore.addFlashcard(front.value, back.value);
    }

    if (result.success) {
      showAddDialog.value = false;
      resetForm();
    } else {
      formError.value = result.error || 'Wystąpił problem';
    }
  };

  const confirmDelete = async () => {
    if (flashcardToDelete.value) {
      await flashcardsStore.deleteFlashcard(flashcardToDelete.value.id);
      showDeleteDialog.value = false;
      flashcardToDelete.value = null;
    }
  };
</script>

<template>
  <div class="my-flashcards">
    <div class="mb-8 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-blue-700">Moje fiszki</h1>
      <div class="flex items-center gap-4">
        <div class="flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium rounded-l-lg"
            :class="activeTab === 'my-flashcards' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            @click="activeTab = 'my-flashcards'"
          >
            Moje fiszki
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium rounded-r-lg"
            :class="activeTab === 'generate' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            @click="activeTab = 'generate'"
          >
            Generuj z AI
          </button>
        </div>
        <BaseButton 
          v-if="activeTab === 'my-flashcards'" 
          @click="showAddDialog = true" 
          data-testid="add-flashcard-btn"
        >
          Dodaj fiszkę
        </BaseButton>
      </div>
    </div>

    <!-- Zakładka z istniejącymi fiszkami -->
    <div v-if="activeTab === 'my-flashcards'">
      <!-- Loading spinner -->
      <div v-if="flashcardsStore.loading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"
        ></div>
        <p class="mt-4 text-gray-600">Ładowanie fiszek...</p>
      </div>

      <!-- Brak fiszek -->
      <div v-else-if="!hasFlashcards" class="text-center py-16 bg-white rounded-lg shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 mx-auto text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        <h2 class="text-xl font-medium text-gray-600 mb-2">Brak fiszek</h2>
        <p class="text-gray-500 mb-4">Rozpocznij naukę dodając swoją pierwszą fiszkę</p>
        <div class="flex gap-3 justify-center">
          <BaseButton @click="showAddDialog = true">
            Dodaj fiszkę ręcznie
          </BaseButton>
          <BaseButton variant="secondary" @click="activeTab = 'generate'">
            Generuj z AI
          </BaseButton>
        </div>
      </div>

      <!-- Lista fiszek -->
      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="flashcards-list">
        <div
          v-for="flashcard in flashcardsStore.flashcards"
          :key="flashcard.id"
          class="bg-white rounded-lg shadow-md overflow-hidden"
          data-testid="flashcard-item"
        >
          <div class="p-5 border-b">
            <h3 class="font-semibold text-lg mb-2">Pytanie:</h3>
            <p>{{ flashcard.question || flashcard.front }}</p>
          </div>
          <div class="p-5">
            <h3 class="font-semibold text-lg mb-2">Odpowiedź:</h3>
            <p>{{ flashcard.answer || flashcard.back }}</p>
          </div>
          <div class="px-5 py-3 bg-gray-50 flex justify-end gap-2">
            <BaseButton variant="secondary" size="sm" @click="showEditDialog(flashcard)">
              Edytuj
            </BaseButton>
            <BaseButton
              variant="danger"
              size="sm"
              @click="
                () => {
                  flashcardToDelete = flashcard;
                  showDeleteDialog = true;
                }
              "
            >
              Usuń
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Zakładka do generowania fiszek -->
    <div v-else-if="activeTab === 'generate'">
      <FlashcardGenerator />
    </div>

    <!-- Dialog dodawania/edycji -->
    <BaseDialog
      v-model="showAddDialog"
      :title="editingFlashcard ? 'Edytuj fiszkę' : 'Dodaj nową fiszkę'"
      data-testid="flashcard-dialog"
    >
      <div v-if="formError" class="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
        {{ formError }}
      </div>

      <div class="space-y-4">
        <div>
          <label for="front" class="block text-sm font-medium text-gray-700"
            >Przód fiszki (pytanie)</label
          >
          <textarea
            id="front"
            v-model="front"
            rows="3"
            class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            placeholder="Wpisz pytanie lub definicję..."
            data-testid="front-input"
          ></textarea>
        </div>

        <div>
          <label for="back" class="block text-sm font-medium text-gray-700"
            >Tył fiszki (odpowiedź)</label
          >
          <textarea
            id="back"
            v-model="back"
            rows="3"
            class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            placeholder="Wpisz odpowiedź..."
            data-testid="back-input"
          ></textarea>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton
            variant="secondary"
            @click="showAddDialog = false"
            data-testid="cancel-flashcard-btn"
          >
            Anuluj
          </BaseButton>
          <BaseButton @click="handleSave" data-testid="save-flashcard-btn">
            {{ editingFlashcard ? 'Zapisz zmiany' : 'Dodaj fiszkę' }}
          </BaseButton>
        </div>
      </template>
    </BaseDialog>

    <!-- Dialog potwierdzenia usunięcia -->
    <BaseDialog v-model="showDeleteDialog" title="Potwierdź usunięcie" size="sm">
      <p class="text-gray-600">
        Czy na pewno chcesz usunąć tę fiszkę? Tej operacji nie można cofnąć.
      </p>

      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="secondary" @click="showDeleteDialog = false"> Anuluj </BaseButton>
          <BaseButton variant="danger" @click="confirmDelete"> Usuń fiszkę </BaseButton>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>
