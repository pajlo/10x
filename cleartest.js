// cleartest.js - skrypt do uruchamiania przez npm run cleartest
import { clearTestData } from './tests/clearTestData.js';

async function run() {
  console.log('🧹 Uruchamiam czyszczenie danych testowych...');

  try {
    const result = await clearTestData();

    if (result.success) {
      console.log('✅ Pomyślnie wyczyszczono dane testowe:', result.message);
      process.exit(0);
    } else {
      console.error('❌ Nie udało się wyczyścić danych testowych:', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Wystąpił nieoczekiwany błąd:', error);
    process.exit(1);
  }
}

run();
