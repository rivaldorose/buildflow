# AI Project Generator Setup

De AI Project Generator gebruikt OpenAI's GPT-4o-mini model om app ideeën om te zetten naar concrete projecten.

## Stap 1: OpenAI API Key Aanmaken

1. Ga naar [OpenAI Platform](https://platform.openai.com/)
2. Log in of maak een account aan
3. Ga naar [API Keys](https://platform.openai.com/api-keys)
4. Klik op "Create new secret key"
5. Geef de key een naam (bijv. "BuildFlow AI")
6. Kopieer de key (je ziet deze maar één keer!)

## Stap 2: API Key Toevoegen aan Vercel

### Voor Production (Vercel):

1. Ga naar je Vercel dashboard: https://vercel.com/dashboard
2. Selecteer je project: `buildflow`
3. Ga naar **Settings** → **Environment Variables**
4. Klik op **Add New**
5. Voeg toe:
   - **Name**: `VITE_OPENAI_API_KEY`
   - **Value**: Je OpenAI API key (bijv. `sk-...`)
   - **Environment**: Selecteer "Production", "Preview", en "Development"
6. Klik op **Save**
7. **Belangrijk**: Ga naar **Deployments** en trigger een nieuwe deployment (of wacht tot de volgende automatic deployment)

### Voor Local Development:

1. Maak een `.env` bestand in de root van je project (als deze nog niet bestaat)
2. Voeg toe:
   ```
   VITE_OPENAI_API_KEY=sk-your-api-key-here
   ```
3. Herstart je development server (`npm run dev`)

## Stap 3: Kosten

- OpenAI's GPT-4o-mini is zeer betaalbaar ($0.15 / 1M input tokens, $0.60 / 1M output tokens)
- Voor een typische project generatie kost dit ongeveer $0.001-0.005 per project
- Je krijgt $5 gratis credits bij aanmaken van een OpenAI account

## Stap 4: Testen

1. Ga naar de Home pagina
2. Klik op "Create with AI" (paarse knop met sparkles icoon)
3. Beschrijf je app idee (bijv. "Een app voor het delen van recepten")
4. De AI analyseert je idee en genereert:
   - Project naam
   - Beschrijving
   - Features
   - Tech stack
   - Platform suggesties
5. Klik op "Project aanmaken" om het project daadwerkelijk aan te maken

## Alternatief: Claude gebruiken

Als je liever Claude (Anthropic) gebruikt, kun je de code aanpassen:

1. Vervang in `src/pages/AIProjectGenerator.jsx`:
   - De API endpoint naar: `https://api.anthropic.com/v1/messages`
   - Voeg `VITE_ANTHROPIC_API_KEY` environment variable toe
   - Pas de request body aan naar Claude's API format

Laat me weten als je hulp nodig hebt met Claude integratie!

