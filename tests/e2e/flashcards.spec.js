// tests/e2e/flashcards.spec.js
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { MyFlashcardsPage } from './pages/MyFlashcardsPage';
import { TEST_USER, SAMPLE_FLASHCARD } from './test-data';

test.describe('Zarządzanie fiszkami', () => {
  test('Użytkownik powinien móc dodać nową fiszkę po zalogowaniu', async ({ page }) => {
    // 1. Logowanie do aplikacji
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    // Oczekujemy udanego logowania
    await expect(page).toHaveURL('/');

    // 2. Przejście do strony z fiszkami
    const flashcardsPage = new MyFlashcardsPage(page);
    await flashcardsPage.goto();

    // 3. Dodanie nowej fiszki
    const frontText = `${SAMPLE_FLASHCARD.front} ${Date.now()}`;
    const backText = SAMPLE_FLASHCARD.back;
    await flashcardsPage.addFlashcard(frontText, backText);

    // 4. Weryfikacja, czy fiszka została dodana
    await flashcardsPage.expectFlashcardExists(frontText, backText);
  });
});
