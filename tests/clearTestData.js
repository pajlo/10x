// Skrypt do czyszczenia danych testowych wprowadzonych w testach e2e
import { supabaseNode } from './supabaseConfig.js';
import { TEST_USER } from './e2e/test-data.js';

/**
 * Czyści dane testowe użytkownika z bazy danych Supabase
 */
async function clearTestData() {
  console.log('Rozpoczynam czyszczenie danych testowych...');
  
  try {
    // 1. Najpierw autoryzujemy się jako użytkownik testowy
    console.log(`Logowanie jako ${TEST_USER.email}...`);
    const { data: authData, error: authError } = await supabaseNode.auth.signInWithPassword({
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    
    if (authError) throw new Error(`Błąd logowania: ${authError.message}`);
    
    const userId = authData.user.id;
    console.log(`Zalogowano jako użytkownik o ID: ${userId}`);
    
    // 2. Najpierw policzymy fiszki do usunięcia
    const { data: countData, error: countError } = await supabaseNode
      .from('flashcards')
      .select('id')
      .eq('user_id', userId);
      
    if (countError) throw new Error(`Błąd podczas liczenia fiszek: ${countError.message}`);
    
    const countToDelete = countData ? countData.length : 0;
    console.log(`Znaleziono ${countToDelete} fiszek do usunięcia...`);
    
    // 3. Teraz usuwamy wszystkie fiszki utworzone przez użytkownika testowego
    console.log('Usuwanie fiszek testowych...');
    const { error: deleteError } = await supabaseNode
      .from('flashcards')
      .delete()
      .eq('user_id', userId);
    
    if (deleteError) throw new Error(`Błąd podczas usuwania fiszek: ${deleteError.message}`);
    
    console.log(`Usunięto ${countToDelete} fiszek testowych.`);
    
    // 4. Wylogowujemy się
    await supabaseNode.auth.signOut();
    console.log('Wylogowano.');
    
    console.log('Dane testowe zostały pomyślnie wyczyszczone!');
    return { success: true, message: `Usunięto ${countToDelete} fiszek testowych.` };
    
  } catch (error) {
    console.error('Wystąpił błąd podczas czyszczenia danych testowych:', error.message);
    return { success: false, error: error.message };
  }
}

// Funkcja główna wykonywana przy bezpośrednim uruchomieniu skryptu
async function main() {
  const result = await clearTestData();
  
  if (result.success) {
    console.log('SUCCESS:', result.message);
    process.exit(0);
  } else {
    console.error('ERROR:', result.error);
    process.exit(1);
  }
}

// Uruchamiamy funkcję główną, jeśli skrypt jest wykonywany bezpośrednio
if (process.argv[1] === import.meta.url) {
  main();
}

export { clearTestData };