/* eslint-env deno */
// Edge Function dla Supabase do generowania fiszek przy użyciu OpenAI API
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { OpenAI } from 'https://esm.sh/openai@4.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

Deno.serve(async (req) => {
  // Obsługa preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Tylko żądania POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Metoda nie jest dozwolona' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405,
      });
    }

    // Odczytaj klucze z zmiennych środowiskowych
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !supabaseServiceKey || !openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Brakujące zmienne środowiskowe' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Utwórz klienta Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Pobierz nagłówek autoryzacyjny
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Brak autoryzacji' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    // Dodaj więcej logów dotyczących autoryzacji do debugowania
    console.log('Otrzymany nagłówek autoryzacji:', authHeader.substring(0, 15) + '...');

    // Sprawdź token użytkownika
    const token = authHeader.replace('Bearer ', '');
    const { data, error: userError } = await supabase.auth.getUser(token);

    if (userError) {
      console.error('Błąd weryfikacji użytkownika:', userError);
      return new Response(
        JSON.stringify({ 
          error: 'Nieprawidłowy token', 
          details: userError.message 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    if (!data.user) {
      console.error('Brak użytkownika dla danego tokenu');
      return new Response(
        JSON.stringify({ error: 'Nieprawidłowy token - nie znaleziono użytkownika' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    console.log('Zweryfikowano użytkownika:', data.user.id);

    // Pobierz dane z ciała żądania
    const requestData = await req.json();
    const { text, count = 5 } = requestData;

    if (!text || text.length < 100) {
      return new Response(
        JSON.stringify({ error: 'Tekst musi mieć co najmniej 100 znaków' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Utwórz klienta OpenAI
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    // Wyślij żądanie do OpenAI
    const systemPrompt = `Jesteś ekspertem-nauczycielem angielskiego, który tworzy materiały do nauki dla swojego ucznia na poziomie B1 na podstawie własnego planu lekcji.

Zanim cokolwiek wygenerujesz, postępuj według następującego wewnętrznego procesu myślowego:
1.  **Analiza Persony:** "Muszę myśleć jak nauczyciel tworzący materiały dla ucznia, a nie dla siebie."
2.  **Skanowanie i Filtrowanie:** "Przejrzę plan i mentalnie odrzucę wszystko, co jest dla mnie (cele, czas, struktura)."
3.  **Ekstrakcja Treści dla Ucznia:** "Wyodrębnię tylko kluczowe materiały: słownictwo, zasady gramatyczne, przykłady zdań."
4.  **Generowanie Fiszek:** "Na podstawie tylko i wyłącznie wyodrębnionej treści, stworzę fiszki, przekształcając np. punkty gramatyczne w ćwiczenia."

CRITICAL RULES:
- NIE TWORZ fiszek, które opisują lekcję (np. 'Jaki jest cel lekcji?').
- TWÓRZ TYLKO fiszki, których uczeń może użyć do nauki.

Format odpowiedzi musi być JSON, który zawiera listę obiektów fiszek.

Przykład dobrej fiszki ze słownictwem:
{
  "front": "What does 'ubiquitous' mean?",
  "back": "Present, appearing, or found everywhere."
}

Przykład dobrej fiszki z gramatyką:
{
  "front": "Complete the sentence with the correct form of 'be': 'She ___ a doctor.'",
  "back": "is"
}
`;

    const userPrompt = `Wygeneruj ${count} fiszek edukacyjnych na podstawie poniższego tekstu.
    
    Tekst do analizy:
    ${text}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
      max_tokens: 1500,
    });

    // Parsowanie odpowiedzi
    const flashcardsData = JSON.parse(response.choices[0].message.content);
    const flashcards = flashcardsData.flashcards; // Zakładając, że klucz to "flashcards"

    // Zwróć wygenerowane fiszki
    return new Response(
      JSON.stringify({ flashcards }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Błąd:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});