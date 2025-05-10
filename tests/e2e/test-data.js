// tests/e2e/test-data.js

/**
 * Dane testowe używane we wszystkich testach E2E
 * Centralne miejsce definicji danych testowych zapobiega redundancji
 * i zapewnia spójność we wszystkich testach
 */

export const TEST_USER = {
  email: 'test@test.pl',
  password: 'password123',
};

export const SAMPLE_FLASHCARD = {
  front: 'Testowa fiszka',
  back: 'Odpowiedź testowa',
};
