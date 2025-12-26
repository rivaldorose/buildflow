# Manual Deployment van Whisper Edge Function

Aangezien Supabase CLI niet automatisch geïnstalleerd kan worden, kun je het handmatig doen via het Supabase Dashboard.

## Optie 1: Via Supabase Dashboard (EASIEST) 🎯

### Stap 1: Maak Edge Function aan

1. Ga naar je Supabase Dashboard: https://app.supabase.com
2. Selecteer je project
3. Ga naar **Edge Functions** in de sidebar
4. Klik op **Create a new function**
5. Naam: `transcribe-audio`
6. Klik op **Create function**

### Stap 2: Plak de Code

Kopieer de code uit: `supabase/functions/transcribe-audio/index.ts`

En plak het in de Supabase editor.

### Stap 3: Set Environment Variable (Secret)

1. In de Edge Function editor, ga naar **Settings** tab
2. Scroll naar **Environment Variables**
3. Klik op **Add Secret**
4. Name: `OPENAI_API_KEY`
5. Value: `YOUR_OPENAI_API_KEY` (je API key die je hebt gekregen)

### Stap 4: Deploy

1. Klik op **Deploy** button
2. Wacht tot deployment klaar is
3. Test de function!

---

## Optie 2: Via Supabase CLI (Als je CLI hebt)

```bash
# Install Supabase CLI via Homebrew (macOS)
brew install supabase/tap/supabase

# Of via npm (alternatief)
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref xezygggzjlxclzndbxfl

# Set secret (gebruik je echte API key!)
supabase secrets set OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE

# Deploy
supabase functions deploy transcribe-audio
```

---

## Belangrijk: API Key Security 🔒

De API key hierboven is gevoelige informatie. Nadat de Edge Function werkt:
- ✅ Verwijder deze key NIET uit Supabase (die moet daar blijven)
- ⚠️ Deel deze key niet publiekelijk
- ✅ Als de key gecompromitteerd is, maak een nieuwe aan in OpenAI

---

## Test na Deployment

1. Open BuildFlow app
2. Ga naar Project Notes
3. Klik op microphone icon
4. Spreek in
5. Check of transcriptie werkt!

