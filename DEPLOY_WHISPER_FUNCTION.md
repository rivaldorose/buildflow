# Deploy Whisper Edge Function naar Supabase

## Stap 1: Installeer Supabase CLI

```bash
npm install -g supabase
```

## Stap 2: Login bij Supabase

```bash
supabase login
```

Dit opent je browser om in te loggen.

## Stap 3: Link je Supabase Project

```bash
cd /Users/rivaldomacandrew/Desktop/apps/build-flow-9138e81d
supabase link --project-ref xezygggzjlxclzndbxfl
```

**Project Reference ID:** `xezygggzjlxclzndbxfl` (uit je Supabase dashboard)

## Stap 4: Zet OpenAI API Key als Secret

```bash
supabase secrets set OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

**Belangrijk:** Vervang `sk-proj-xxxxxxxxxxxxx` met je echte OpenAI API key!

Je kunt je API key krijgen van:
- https://platform.openai.com/api-keys

## Stap 5: Deploy de Edge Function

```bash
supabase functions deploy transcribe-audio
```

## Stap 6: Verify Deployment

Na deployment zou je moeten zien:
```
Deployed Function transcribe-audio
```

Test de function:
```bash
supabase functions invoke transcribe-audio --method POST
```

## Troubleshooting

### "Project not linked"
- Run `supabase link` eerst
- Check of je de juiste project ref gebruikt

### "OPENAI_API_KEY not set"
- Check secrets: `supabase secrets list`
- Zet de secret: `supabase secrets set OPENAI_API_KEY=xxxxx`

### CORS Errors
- De Edge Function heeft nu CORS headers
- Check Supabase logs: `supabase functions logs transcribe-audio`

### Function werkt nog niet
1. Check Supabase Dashboard → Edge Functions
2. Kijk naar logs voor errors
3. Test met curl of Postman

## Alternative: Test Locally

```bash
# Start local Supabase (optioneel)
supabase start

# Set local secret
supabase secrets set OPENAI_API_KEY=xxxxx --env local

# Serve function locally
supabase functions serve transcribe-audio
```

## Kosten

- Whisper API: $0.006 per minuut
- Supabase Edge Functions: Gratis tier heeft 500K invocations/maand

Zeer betaalbaar! 💰

