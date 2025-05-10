// tests/e2e/pages/MyFlashcardsPage.js
import { expect } from '@playwright/test';

export class MyFlashcardsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    // Przycisk na głównej stronie, który otwiera modal
    this.addButton = page.getByRole('button', { name: 'Dodaj fiszkę', exact: true }).first();
    
    // Selektory dla formularza w modalu
    this.dialog = page.locator('dialog, div[role="dialog"]');
    this.frontInput = page.locator('textarea, input').nth(0);
    this.backInput = page.locator('textarea, input').nth(1);
    // Przycisk w modalu do zapisywania fiszki
    this.saveButton = page.locator('dialog button:has-text("Dodaj fiszkę"), div[role="dialog"] button:has-text("Dodaj fiszkę")');
    this.cancelButton = page.getByRole('button', { name: 'Anuluj' });
    
    this.flashcardsList = page.locator('.flashcard-item, div[class*="flashcard"]');
  }

  async goto() {
    await this.page.goto('/my-flashcards');
  }

  async addFlashcard(front, back) {
    // Kliknij przycisk, aby otworzyć modal
    await this.addButton.click();
    
    // Poczekaj na pojawienie się modalu
    await this.page.waitForSelector('dialog, div[role="dialog"]', { state: 'visible', timeout: 5000 });
    
    // Wypełnij pola formularza
    await this.frontInput.fill(front);
    await this.backInput.fill(back);
    
    // Debugowanie - dodaje pauzę, aby zobaczyć co się dzieje
    // await this.page.pause();
    
    // Kliknij przycisk zapisywania w modalu
    await this.saveButton.click({ timeout: 10000 });
  }

  async expectFlashcardExists(front, back) {
    // Szukamy fiszki z podanym tekstem na przodzie
    const flashcard = this.page.locator('div', { hasText: front }).first();
    
    // Czekamy aż fiszka będzie widoczna (maksymalnie 5 sekund)
    await expect(flashcard).toBeVisible({ timeout: 5000 });
  }
}