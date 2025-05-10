// tests/e2e/auth.spec.js
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { TEST_USER } from './test-data';

test.describe('Autentykacja', () => {
  test('Użytkownik powinien móc się zalogować z poprawnymi danymi', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Przejdź do strony logowania
    await loginPage.goto();

    // Logowanie z wykorzystaniem danych z centralnego pliku testowego
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    // Sprawdzenie przekierowania po zalogowaniu
    await loginPage.expectSuccessfulLogin();
  });
});
