import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import FlashcardsView from '../views/FlashcardsView.vue';
import MyFlashcardsView from '../views/MyFlashcardsView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/flashcards',
      name: 'flashcards',
      component: FlashcardsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/my-flashcards',
      name: 'myFlashcards',
      component: MyFlashcardsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
  ],
});

// Strażnik nawigacji - sprawdza czy użytkownik jest zalogowany
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Sprawdź czy sklep ma zalogowanego użytkownika
  if (!authStore.user) {
    await authStore.checkSession();
  }

  // Sprawdź czy trasa wymaga autoryzacji
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Jeśli użytkownik nie jest zalogowany, przekieruj do logowania
    if (!authStore.isAuthenticated) {
      next({ name: 'login' });
    } else {
      next(); // Użytkownik zalogowany, kontynuuj
    }
  } else {
    next(); // Nie wymaga autoryzacji, kontynuuj
  }
});

export default router;
