// Edge Function dla Supabase do generowania fiszek przy użyciu OpenAI API
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { OpenAI } from 'https://esm.sh/openai@4.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Sprawdź token użytkownika
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Nieprawidłowy token' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

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
    const prompt = `Wygeneruj ${count} fiszek edukacyjnych na podstawie poniższego tekstu. 
    Każda fiszka powinna składać się z pytania (przód) i odpowiedzi (tył).
    Pytania powinny dotyczyć najważniejszych koncepcji, definicji lub faktów z tekstu.
    Odpowiedzi powinny być zwięzłe, ale kompletne.
    
    Format odpowiedzi powinien być w formacie JSON:
    [
      { "front": "Pytanie 1", "back": "Odpowiedź 1" },
      { "front": "Pytanie 2", "back": "Odpowiedź 2" }
    ]
    
    Tekst do analizy:
    ${text}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Jesteś asystentem pomagającym tworzyć wysokiej jakości fiszki edukacyjne.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    // Parsowanie odpowiedzi
    const content = response.choices[0].message.content;
    const jsonStartIndex = content.indexOf('[');
    const jsonEndIndex = content.lastIndexOf(']') + 1;
    
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error('Nie udało się przetworzyć odpowiedzi API');
    }
    
    const jsonString = content.substring(jsonStartIndex, jsonEndIndex);
    const flashcards = JSON.parse(jsonString);

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