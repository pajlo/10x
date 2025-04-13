<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';

const isMenuOpen = ref(false);
const router = useRouter();
const authStore = useAuthStore();

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const logout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Nagłówek z menu nawigacyjnym -->
    <header class="bg-blue-600 text-white shadow-md">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <router-link to="/" class="text-2xl font-bold">10x Cards</router-link>
        
        <!-- Menu dla desktopów -->
        <nav class="hidden md:flex space-x-6">
          <router-link to="/" class="hover:text-blue-200 transition-colors">Strona główna</router-link>
          <template v-if="authStore.isAuthenticated">
            <router-link to="/my-flashcards" class="hover:text-blue-200 transition-colors">Moje fiszki</router-link>
            <router-link to="/flashcards" class="hover:text-blue-200 transition-colors">Sesja nauki</router-link>
          </template>
          <template v-if="!authStore.isAuthenticated">
            <router-link to="/login" class="hover:text-blue-200 transition-colors">Logowanie</router-link>
            <router-link to="/register" class="hover:text-blue-200 transition-colors">Rejestracja</router-link>
          </template>
          <button v-else @click="logout" class="hover:text-blue-200 transition-colors">Wyloguj</button>
        </nav>
        
        <!-- Przycisk menu dla urządzeń mobilnych -->
        <div class="md:hidden">
          <button @click="toggleMenu" class="focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Menu mobilne -->
      <div v-if="isMenuOpen" class="md:hidden bg-blue-700 px-4 py-2">
        <div class="flex flex-col space-y-2">
          <router-link @click="toggleMenu" to="/" class="py-1 hover:text-blue-200 transition-colors">Strona główna</router-link>
          <template v-if="authStore.isAuthenticated">
            <router-link @click="toggleMenu" to="/my-flashcards" class="py-1 hover:text-blue-200 transition-colors">Moje fiszki</router-link>
            <router-link @click="toggleMenu" to="/flashcards" class="py-1 hover:text-blue-200 transition-colors">Sesja nauki</router-link>
          </template>
          <template v-if="!authStore.isAuthenticated">
            <router-link @click="toggleMenu" to="/login" class="py-1 hover:text-blue-200 transition-colors">Logowanie</router-link>
            <router-link @click="toggleMenu" to="/register" class="py-1 hover:text-blue-200 transition-colors">Rejestracja</router-link>
          </template>
          <button v-else @click="logout" class="text-left py-1 hover:text-blue-200 transition-colors">Wyloguj</button>
        </div>
      </div>
    </header>
    
    <!-- Główna zawartość -->
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
    
    <!-- Stopka -->
    <footer class="bg-gray-800 text-white py-4 mt-auto">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; 2023 10x Cards. Wszystkie prawa zastrzeżone.</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* Globalne style aplikacji */
</style>
