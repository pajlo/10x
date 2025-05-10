import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['dist/**', 'node_modules/**', '**/*.vue'] }, // Celowo ignorujemy pliki Vue
  js.configs.recommended,
  {
    // Podstawowa konfiguracja dla plików JavaScript
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    // Konfiguracja dla plików JavaScript
    files: ['**/*.js', '**/*.mjs'],
    rules: {
      'no-unused-vars': 'warn',
    },
  },
];
