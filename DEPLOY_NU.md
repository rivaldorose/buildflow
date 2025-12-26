# 🚀 DEPLOY WHISPER FUNCTION NU!

## Methode 1: Via Terminal (SNELST) ⚡

**Open een nieuwe terminal en run:**

```bash
cd /Users/rivaldomacandrew/Desktop/apps/build-flow-9138e81d

# 1. Login (opent browser)
supabase login

# 2. Link project
supabase link --project-ref xezygggzjlxclzndbxfl

# 3. Set API key secret (gebruik je echte API key!)
supabase secrets set OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE

# 4. Deploy function
supabase functions deploy transcribe-audio
```

**Of run het script:**
```bash
bash deploy-whisper-function.sh
```

---

## Methode 2: Via Supabase Dashboard (ALS TERMINAL NIET WERKT) 🎯

### Stap 1: Ga naar Supabase Dashboard
1. Open: https://app.supabase.com
2. Selecteer je project (xezygggzjlxclzndbxfl)

### Stap 2: Maak Edge Function aan
1. Klik op **"Edge Functions"** in de sidebar
2. Klik op **"Create a new function"**
3. Function name: `transcribe-audio`
4. Klik **"Create function"**

### Stap 3: Plak de Code
1. Open het bestand: `SUPABASE_EDGE_FUNCTION_CODE.txt`
2. Kopieer ALLE code
3. Plak het in de Supabase editor

### Stap 4: Set API Key Secret
1. In de Edge Function editor, ga naar **"Settings"** tab
2. Scroll naar **"Secrets"** section
3. Klik op **"Add Secret"**
4. **Name:** `OPENAI_API_KEY`
5. **Value:** `YOUR_OPENAI_API_KEY` (zie terminal output of gebruik de key die je hebt gekregen)
6. Klik **"Save"**

### Stap 5: Deploy
1. Klik op **"Deploy"** button (bovenaan rechts)
2. Wacht tot deployment klaar is (~30 seconden)

### Stap 6: Test!
1. Open BuildFlow app
2. Ga naar Project Notes
3. Klik op microphone icon 🎤
4. Spreek in!
5. ✅ Should work!

---

## Troubleshooting

**Als deployment faalt:**
- Check Supabase logs: Edge Functions → transcribe-audio → Logs
- Check of API key correct is
- Check of code correct is geplakt

**Als CORS errors blijven:**
- De Edge Function heeft nu correct CORS headers
- Refresh de app na deployment

