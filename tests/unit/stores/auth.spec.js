// tests/unit/stores/auth.spec.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../../../src/stores/auth';

// Mock modułu supabase
vi.mock('../../../src/supabase', () => {
  return {
    supabase: {
      auth: {
        signInWithPassword: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        getSession: vi.fn(),
      },
    },
  };
});

// Import mocka po zdefiniowaniu, aby mieć dostęp do zmockowanych funkcji
import { supabase } from '../../../src/supabase';

describe('Auth Store', () => {
  let store;

  beforeEach(() => {
    // Tworzy nową instancję Pinia dla każdego testu
    setActivePinia(createPinia());
    store = useAuthStore();

    // Resetuje mocki przed każdym testem
    vi.resetAllMocks();
  });

  describe('login', () => {
    it('powinien ustawić użytkownika po poprawnym logowaniu', async () => {
      // Przygotowanie danych testowych
      const mockUser = { id: '1', email: 'test@example.com' };
      const mockSession = { user: mockUser };

      // Ustawienie mocka aby zwrócił sukces
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: mockSession,
        error: null,
      });

      // Wywołanie testowanej funkcji
      const result = await store.login('test@example.com', 'password123');

      // Sprawdzenie czy mock został wywołany z poprawnymi parametrami
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });

      // Sprawdzenie rezultatu
      expect(result).toEqual({ success: true });
      expect(store.isAuthenticated).toBe(true);
      expect(store.user).toEqual(mockUser);
      expect(store.error).toBeNull();
    });

    it('powinien zwrócić błąd przy niepoprawnych danych logowania', async () => {
      // Ustawienie mocka aby zwrócił błąd
      const errorMessage = 'Invalid login credentials';
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: errorMessage },
      });

      // Wywołanie testowanej funkcji
      const result = await store.login('test@example.com', 'wrong_password');

      // Sprawdzenie rezultatu
      expect(result).toEqual({ success: false, error: errorMessage });
      expect(store.isAuthenticated).toBe(false);
      expect(store.user).toBeNull();
      expect(store.error).toBe(errorMessage);
    });
  });
});
