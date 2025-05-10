# Test info

- Name: Zarządzanie fiszkami >> Użytkownik powinien móc dodać nową fiszkę po zalogowaniu
- Location: C:\Users\User\Desktop\10xdevs\10x-cards\tests\e2e\flashcards.spec.js:8:3

# Error details

```
TimeoutError: page.waitForSelector: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('dialog, div[role="dialog"]') to be visible
    15 × locator resolved to hidden <div role="dialog" aria-modal="true" class="relative z-10" id="headlessui-dialog-v-3" data-headlessui-state="open" aria-labelledby="headlessui-dialog-title-v-7">…</div>

    at MyFlashcardsPage.addFlashcard (C:\Users\User\Desktop\10xdevs\10x-cards\tests\e2e\pages\MyFlashcardsPage.js:33:21)
    at C:\Users\User\Desktop\10xdevs\10x-cards\tests\e2e\flashcards.spec.js:24:5
```

# Page snapshot

```yaml
- dialog "Dodaj nową fiszkę":
  - heading "Dodaj nową fiszkę" [level=2]
  - text: Przód fiszki (pytanie)
  - textbox "Przód fiszki (pytanie)"
  - text: Tył fiszki (odpowiedź)
  - textbox "Tył fiszki (odpowiedź)"
  - button "Anuluj"
  - button "Dodaj fiszkę"
```

# Test source

```ts
   1 | // tests/e2e/pages/MyFlashcardsPage.js
   2 | import { expect } from '@playwright/test';
   3 |
   4 | export class MyFlashcardsPage {
   5 |   /**
   6 |    * @param {import('@playwright/test').Page} page
   7 |    */
   8 |   constructor(page) {
   9 |     this.page = page;
  10 |     // Przycisk na głównej stronie, który otwiera modal
  11 |     this.addButton = page.getByRole('button', { name: 'Dodaj fiszkę', exact: true }).first();
  12 |     
  13 |     // Selektory dla formularza w modalu
  14 |     this.dialog = page.locator('dialog, div[role="dialog"]');
  15 |     this.frontInput = page.locator('textarea, input').nth(0);
  16 |     this.backInput = page.locator('textarea, input').nth(1);
  17 |     // Przycisk w modalu do zapisywania fiszki
  18 |     this.saveButton = page.locator('dialog button:has-text("Dodaj fiszkę"), div[role="dialog"] button:has-text("Dodaj fiszkę")');
  19 |     this.cancelButton = page.getByRole('button', { name: 'Anuluj' });
  20 |     
  21 |     this.flashcardsList = page.locator('.flashcard-item, div[class*="flashcard"]');
  22 |   }
  23 |
  24 |   async goto() {
  25 |     await this.page.goto('/my-flashcards');
  26 |   }
  27 |
  28 |   async addFlashcard(front, back) {
  29 |     // Kliknij przycisk, aby otworzyć modal
  30 |     await this.addButton.click();
  31 |     
  32 |     // Poczekaj na pojawienie się modalu
> 33 |     await this.page.waitForSelector('dialog, div[role="dialog"]', { state: 'visible', timeout: 5000 });
     |                     ^ TimeoutError: page.waitForSelector: Timeout 5000ms exceeded.
  34 |     
  35 |     // Wypełnij pola formularza
  36 |     await this.frontInput.fill(front);
  37 |     await this.backInput.fill(back);
  38 |     
  39 |     // Debugowanie - dodaje pauzę, aby zobaczyć co się dzieje
  40 |     // await this.page.pause();
  41 |     
  42 |     // Kliknij przycisk zapisywania w modalu
  43 |     await this.saveButton.click({ timeout: 10000 });
  44 |   }
  45 |
  46 |   async expectFlashcardExists(front, back) {
  47 |     // Szukamy fiszki z podanym tekstem na przodzie
  48 |     const flashcard = this.page.locator('div', { hasText: front }).first();
  49 |     
  50 |     // Czekamy aż fiszka będzie widoczna (maksymalnie 5 sekund)
  51 |     await expect(flashcard).toBeVisible({ timeout: 5000 });
  52 |   }
  53 | }
```