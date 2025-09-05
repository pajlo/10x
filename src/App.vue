<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from './stores/auth';
  import BaseButton from './components/BaseButton.vue';
  import BaseMenu from './components/BaseMenu.vue';

  const router = useRouter();
  const authStore = useAuthStore();

  // Poprawione mapowanie etykiet do rzeczywistych ścieżek
  const menuItems = computed(() => {
    const items = [{ label: 'Strona główna', action: () => router.push('/') }];

    if (authStore.isAuthenticated) {
      items.push(
        { label: 'Moje fiszki', action: () => router.push('/my-flashcards') },
        { label: 'Sesja nauki', action: () => router.push('/flashcards') },
        { label: 'Wyloguj', action: logout },
      );
    } else {
      items.push(
        { label: 'Logowanie', action: () => router.push('/login') },
        { label: 'Rejestracja', action: () => router.push('/register') },
      );
    }

    return items;
  });

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
        <nav class="hidden md:flex space-x-4">
          <router-link to="/" class="hover:text-blue-200 transition-colors py-2">
            Strona główna
          </router-link>

          <template v-if="authStore.isAuthenticated">
            <router-link to="/my-flashcards" class="hover:text-blue-200 transition-colors py-2">
              Moje fiszki
            </router-link>
            <router-link to="/flashcards" class="hover:text-blue-200 transition-colors py-2">
              Sesja nauki
            </router-link>
            <BaseButton variant="outline" @click="logout"> Wyloguj </BaseButton>
          </template>

          <template v-else>
            <router-link to="/login" class="hover:text-blue-200 transition-colors py-2">
              Logowanie
            </router-link>
            <router-link to="/register" class="hover:text-blue-200 transition-colors py-2">
              Rejestracja
            </router-link>
          </template>
        </nav>

        <!-- Menu mobilne -->
        <div class="md:hidden">
          <BaseMenu :items="menuItems" buttonContent="Menu" position="right" />
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
        <p>&copy; 2025 10x Cards. Wszelkie prawa zastrzeżone.</p>
      </div>
    </footer>
  </div>
</template>

<style>
  /* Globalne style aplikacji */
</style>
