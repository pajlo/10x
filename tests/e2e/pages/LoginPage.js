// tests/e2e/pages/LoginPage.js
import { expect } from '@playwright/test';

export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-message');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectSuccessfulLogin() {
    // Po udanym logowaniu, oczekujemy przekierowania do strony głównej
    await expect(this.page).toHaveURL('/');
  }

  async expectLoginError() {
    // Sprawdzamy, czy pojawił się komunikat o błędzie
    await expect(this.errorMessage).toBeVisible();
  }
}
