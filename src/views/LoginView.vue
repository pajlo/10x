<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Wypełnij wszystkie pola';
    return;
  }
  
  isLoading.value = true;
  const { success, error } = await authStore.login(email.value, password.value);
  isLoading.value = false;
  
  if (success) {
    router.push('/');
  } else {
    errorMessage.value = error || 'Błąd logowania. Sprawdź dane i spróbuj ponownie.';
  }
};
</script>

<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold text-center text-blue-700 mb-6">Logowanie</h1>
    
    <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ errorMessage }}
    </div>
    
    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label for="email" class="block text-gray-700 font-medium mb-2">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="twoj@email.com"
          required
        >
      </div>
      
      <div class="mb-6">
        <label for="password" class="block text-gray-700 font-medium mb-2">Hasło</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••"
          required
        >
      </div>
      
      <button 
        type="submit" 
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        :disabled="isLoading"
      >
        <span v-if="isLoading">Logowanie...</span>
        <span v-else>Zaloguj się</span>
      </button>
    </form>
    
    <div class="mt-4 text-center">
      <p>Nie masz konta? <router-link to="/register" class="text-blue-600 hover:underline">Zarejestruj się</router-link></p>
    </div>
  </div>
</template>
