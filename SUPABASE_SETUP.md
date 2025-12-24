# Supabase Setup voor Buildflow

Volg deze stappen om Supabase te configureren voor de Buildflow app.

## 1. Supabase Project Aanmaken

1. Ga naar [supabase.com](https://supabase.com) en log in (of maak een account aan)
2. Klik op "New Project"
3. Vul de project details in:
   - Name: buildflow (of een andere naam)
   - Database Password: kies een sterk wachtwoord
   - Region: kies de regio die het dichtst bij je is
4. Klik op "Create new project"
5. Wacht tot het project klaar is (dit kan een paar minuten duren)

## 2. Database Schema Opzetten

1. Ga naar je Supabase project dashboard
2. Klik op "SQL Editor" in de sidebar
3. Klik op "New query"
4. Open het bestand `supabase_schema.sql` in deze map
5. Kopieer alle SQL code uit dat bestand
6. Plak het in de SQL Editor
7. Klik op "Run" (of druk op Cmd/Ctrl + Enter)
8. Controleer dat alle tabellen zijn aangemaakt (ga naar "Table Editor" in de sidebar)

## 3. Authentication Instellen

1. Ga naar "Authentication" in de sidebar
2. Klik op "Providers"
3. Zorg dat "Email" provider is ingeschakeld
4. Optioneel: schakel andere providers in (Google, GitHub, etc.)

## 4. Storage Buckets Aanmaken (Optioneel - voor file uploads)

1. Ga naar "Storage" in de sidebar
2. Klik op "New bucket"
3. Maak een bucket genaamd: `files`
   - Set als public: Yes (als je publieke files wilt)
   - Set policies naar wens
4. Maak nog een bucket genaamd: `private-files`
   - Set als public: No

## 5. API Credentials Ophalen

1. Ga naar "Settings" → "API" in de sidebar
2. Kopieer de volgende waarden:
   - **Project URL**: bijvoorbeeld `https://xxxxx.supabase.co`
   - **anon/public key**: de `anon` key (niet de `service_role` key!)

## 6. Environment Variables Instellen

1. Maak een `.env` bestand in de root van het project (als die nog niet bestaat)
2. Voeg de volgende regels toe:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Vervang de waarden met je eigen Supabase URL en anon key

## 7. Test de Setup

1. Start de development server:
```bash
npm run dev
```

2. Open de app in je browser
3. Probeer je aan te melden (sign up / sign in)
4. Controleer in Supabase "Authentication" → "Users" of je account is aangemaakt

## Troubleshooting

### Error: "relation does not exist"
- Zorg dat je het `supabase_schema.sql` script hebt uitgevoerd in de SQL Editor

### Error: "permission denied"
- Controleer dat Row Level Security (RLS) policies correct zijn ingesteld
- Zorg dat je ingelogd bent

### Error: "invalid API key"
- Controleer dat je de `anon` key gebruikt, niet de `service_role` key
- Zorg dat de environment variables correct zijn ingesteld

### Authentication werkt niet
- Controleer dat de Email provider is ingeschakeld in Authentication → Providers
- Controleer je email voor verificatie links (als email verificatie is ingeschakeld)

## Next Steps

- Configureer eventuele LLM integrations (OpenAI, etc.) als je AI features wilt gebruiken
- Zet up email service (Resend, SendGrid) als je emails wilt versturen
- Deploy naar Vercel en voeg de environment variables toe in Vercel dashboard

