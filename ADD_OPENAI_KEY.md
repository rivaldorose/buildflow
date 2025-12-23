# OpenAI API Key Toevoegen aan Vercel

## Stap 1: Vercel Dashboard

1. Ga naar [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecteer je project: **buildflow**
3. Ga naar **Settings** (bovenaan)
4. Klik op **Environment Variables** in het menu links

## Stap 2: Voeg de Key Toe

1. Klik op **Add New** button
2. Vul in:
   - **Key**: `VITE_OPENAI_API_KEY`
   - **Value**: `[PLAK HIER JE OPENAI API KEY]`
   - **Environments**: Vink ALLEEN aan:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development

3. Klik op **Save**

## Stap 3: Redeploy

**BELANGRIJK**: Na het toevoegen moet je de app opnieuw deployen:

1. Ga naar **Deployments** tab (bovenaan)
2. Klik op de **3 dots** (⋯) naast de laatste deployment
3. Klik op **Redeploy**
4. Wacht tot de deployment klaar is (1-2 minuten)

## Stap 4: Testen

1. Ga naar je live app (bijv. https://buildflow-oxa2.vercel.app)
2. Ga naar "Plak Project Structuur" of "Create with AI"
3. Test of het werkt!

## Voor Local Development (optioneel)

Als je lokaal wilt testen, maak een `.env` file in de root:

```bash
# Maak .env file (als deze nog niet bestaat)
touch .env
```

Voeg toe aan `.env`:
```
VITE_OPENAI_API_KEY=[PLAK HIER JE OPENAI API KEY]
```

**Belangrijk**: Herstart je dev server na het toevoegen:
```bash
npm run dev
```

## Troubleshooting

- Als het niet werkt na redeploy: wacht 2-3 minuten en refresh de pagina
- Check browser console (F12) voor errors
- Controleer of de key naam EXACT is: `VITE_OPENAI_API_KEY` (geen spelfouten!)

