// tests/e2e/pages/MyFlashcardsPage.js
import { expect } from '@playwright/test';

export class MyFlashcardsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Główny przycisk dodawania fiszek
    this.addButton = page.getByRole('button', { name: 'Dodaj fiszkę' }).first();

    // Elementy modalu - używamy tytułu zamiast samego dialogu, bo ten może być uznany za ukryty
    this.dialogTitle = page.getByRole('heading', { name: 'Dodaj nową fiszkę' });

    // Pola formularza - korzystamy z atrybutów id i labels
    this.frontInput = page.locator('#front');
    this.backInput = page.locator('#back');

    // Przyciski - korzystamy z data-testid
    this.cancelButton = page.getByTestId('cancel-flashcard-btn');
    this.saveButton = page.getByTestId('save-flashcard-btn');

    // Elementy do weryfikacji fiszki
    this.flashcardItem = page.locator('.bg-white.rounded-lg.shadow-md');
  }

  async goto() {
    await this.page.goto('/my-flashcards');
    // Daj stronie chwilę na załadowanie
    await this.page.waitForLoadState('networkidle');
  }

  async addFlashcard(front, back) {
    // 1. Kliknij przycisk dodawania fiszki
    await this.addButton.click();

    // 2. Poczekaj na tytuł dialogu zamiast na sam dialog
    await this.dialogTitle.waitFor({ state: 'visible', timeout: 5000 });

    // 3. Dodaj krótką pauzę, aby elementy formularza były w pełni dostępne
    await this.page.waitForTimeout(500);

    // 4. Wypełnij pola formularza
    await this.frontInput.fill(front);
    await this.backInput.fill(back);

    // 5. Kliknij przycisk zapisywania używając data-testid
    await this.saveButton.click();

    // 6. Daj czas na przetworzenie i zamknięcie modalu
    await this.page.waitForTimeout(1000);
  }

  async expectFlashcardExists(front, back) {
    // Daj więcej czasu na odświeżenie interfejsu
    await this.page.waitForTimeout(1000);

    // Szukaj tekstu fiszki na stronie
    const flashcardElement = this.page.locator('.bg-white.rounded-lg.shadow-md', {
      has: this.page.getByText(front, { exact: false }),
    });

    // Weryfikuj czy fiszka jest widoczna
    await expect(flashcardElement).toBeVisible({ timeout: 10000 });

    // Weryfikuj czy zawiera również tekst odpowiedzi
    const hasAnswerText = await flashcardElement.getByText(back, { exact: false }).isVisible();
    expect(hasAnswerText).toBeTruthy();
  }
}
