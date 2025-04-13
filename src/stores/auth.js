import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../supabase';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const isAuthenticated = ref(false);
  const loading = ref(false);
  const error = ref(null);

  // Sprawdza aktualną sesję przy inicjalizacji
  const checkSession = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        user.value = data.session.user;
        isAuthenticated.value = true;
      } else {
        user.value = null;
        isAuthenticated.value = false;
      }
    } catch (err) {
      error.value = err.message || 'Wystąpił błąd podczas sprawdzania sesji';
      console.error(error.value);
    } finally {
      loading.value = false;
    }
  };

  // Rejestracja użytkownika
  const register = async (email, password) => {
    loading.value = true;
    error.value = null;
    
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (authError) throw authError;
      
      user.value = data.user;
      isAuthenticated.value = true;
      return { success: true };
    } catch (err) {
      error.value = err.message || 'Błąd podczas rejestracji';
      console.error(error.value);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Logowanie użytkownika
  const login = async (email, password) => {
    loading.value = true;
    error.value = null;
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) throw authError;
      
      user.value = data.user;
      isAuthenticated.value = true;
      return { success: true };
    } catch (err) {
      error.value = err.message || 'Błąd logowania';
      console.error(error.value);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Wylogowanie użytkownika
  const logout = async () => {
    loading.value = true;
    
    try {
      await supabase.auth.signOut();
      user.value = null;
      isAuthenticated.value = false;
    } catch (err) {
      error.value = err.message || 'Błąd podczas wylogowywania';
      console.error(error.value);
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    checkSession,
    register,
    login,
    logout
  };
});
