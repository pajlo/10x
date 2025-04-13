<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const navigateToFlashcards = () => {
  router.push('/flashcards');
};
</script>

<template>
  <div class="home-container">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl font-bold text-blue-700 mb-6">Witaj w 10x Cards</h1>
      <p class="text-xl text-gray-600 mb-8">
        Ucz się skuteczniej z naszą aplikacją do fiszek. Idealna dla programistów i wszystkich, którzy chcą osiągnąć 10x lepsze wyniki!
      </p>
      
      <div class="grid md:grid-cols-3 gap-6 mb-12">
        <div class="p-6 bg-white rounded-lg shadow-lg">
          <div class="text-blue-600 text-4xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 class="text-xl font-semibold mb-2">Twórz własne fiszki</h2>
          <p class="text-gray-600">Dodawaj własne fiszki z dowolnych tematów, które chcesz opanować.</p>
        </div>
        
        <div class="p-6 bg-white rounded-lg shadow-lg">
          <div class="text-blue-600 text-4xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 class="text-xl font-semibold mb-2">Ucz się inteligentnie</h2>
          <p class="text-gray-600">System powtórek oparty na algorytmach skutecznego zapamiętywania.</p>
        </div>
        
        <div class="p-6 bg-white rounded-lg shadow-lg">
          <div class="text-blue-600 text-4xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 class="text-xl font-semibold mb-2">Śledź postępy</h2>
          <p class="text-gray-600">Monitoruj swoje postępy i analizuj wyniki nauki.</p>
        </div>
      </div>
      
      <div class="mt-8">
        <button 
          @click="navigateToFlashcards" 
          class="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Rozpocznij naukę
        </button>
        
        <div v-if="!authStore.isAuthenticated" class="mt-4 text-gray-600">
          Lub <router-link to="/login" class="text-blue-600 hover:underline">zaloguj się</router-link> 
          aby kontynuować naukę
        </div>
      </div>
    </div>
  </div>
</template>
