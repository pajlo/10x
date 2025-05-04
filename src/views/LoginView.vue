<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import BaseButton from '../components/BaseButton.vue';

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
  <div class="max-w-md mx-auto">
    <div class="bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold text-center text-blue-700 mb-6">Logowanie</h1>
      
      <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
        <p class="text-sm">{{ errorMessage }}</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="twoj@email.com"
            required
            :disabled="isLoading"
          >
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Hasło</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="••••••••"
            required
            :disabled="isLoading"
          >
        </div>
        
        <BaseButton
          type="submit"
          class="w-full"
          :disabled="isLoading"
        >
          <template v-if="isLoading">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Logowanie...
          </template>
          <template v-else>
            Zaloguj się
          </template>
        </BaseButton>
      </form>
      
      <div class="mt-6 text-center text-sm">
        <p class="text-gray-600">
          Nie masz konta? 
          <router-link to="/register" class="text-blue-600 hover:text-blue-700 font-medium">
            Zarejestruj się
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>
