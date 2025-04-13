<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
  // Podstawowa walidacja
  if (!email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Wypełnij wszystkie pola';
    return;
  }
  
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Hasła nie są zgodne';
    return;
  }
  
  if (password.value.length < 6) {
    errorMessage.value = 'Hasło musi mieć co najmniej 6 znaków';
    return;
  }
  
  isLoading.value = true;
  const { success, error } = await authStore.register(email.value, password.value);
  isLoading.value = false;
  
  if (success) {
    router.push('/');
  } else {
    errorMessage.value = error || 'Błąd rejestracji. Spróbuj ponownie.';
  }
};
</script>

<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold text-center text-blue-700 mb-6">Rejestracja</h1>
    
    <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ errorMessage }}
    </div>
    
    <form @submit.prevent="handleRegister">
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
      
      <div class="mb-4">
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
      
      <div class="mb-6">
        <label for="confirm-password" class="block text-gray-700 font-medium mb-2">Powtórz hasło</label>
        <input 
          type="password" 
          id="confirm-password" 
          v-model="confirmPassword" 
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
        <span v-if="isLoading">Przetwarzanie...</span>
        <span v-else>Zarejestruj się</span>
      </button>
    </form>
    
    <div class="mt-4 text-center">
      <p>Masz już konto? <router-link to="/login" class="text-blue-600 hover:underline">Zaloguj się</router-link></p>
    </div>
  </div>
</template>
