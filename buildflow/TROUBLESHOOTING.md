# Troubleshooting - Projecten worden niet opgeslagen

## Probleem: Projecten worden niet opgeslagen in Supabase

### Mogelijke Oorzaken:

1. **Environment Variables niet ingesteld**
   - Check of `VITE_SUPABASE_URL` en `VITE_SUPABASE_ANON_KEY` zijn ingesteld in Vercel
   - Check browser console voor warnings over missing environment variables

2. **Gebruiker niet ingelogd**
   - De app vereist authenticatie om projecten aan te maken
   - Check of je ingelogd bent voordat je een project aanmaakt

3. **RLS Policies blokkeren insert**
   - Check Supabase → Authentication → Policies
   - Zorg dat RLS policies toestaan dat gebruikers hun eigen projecten aanmaken

4. **Database Schema niet correct**
   - Check of de `projects` tabel bestaat in Supabase
   - Check of alle benodigde kolommen aanwezig zijn

## Debugging Stappen:

### 1. Check Browser Console
1. Open je live site: https://buildflow-oxa2.vercel.app
2. Open Developer Tools (F12 of Cmd+Option+I)
3. Ga naar Console tab
4. Probeer een project aan te maken
5. Check voor errors of warnings

### 2. Check Supabase Logs
1. Ga naar Supabase Dashboard
2. Ga naar Logs → Database
3. Check voor SQL errors wanneer je een project aanmaakt
4. Check Logs → API voor request/response issues

### 3. Check Environment Variables

**In Vercel:**
1. Ga naar Vercel Dashboard → Project → Settings
2. Ga naar Environment Variables
3. Check of deze aanwezig zijn:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Als ze ontbreken: voeg ze toe en redeploy

**Lokaal (voor testing):**
1. Maak `.env` file aan in de root van buildflow
2. Voeg toe:
   ```
   VITE_SUPABASE_URL=https://xezygqgzjlxclzndbxfl.supabase.co
   VITE_SUPABASE_ANON_KEY=je_anon_key_hier
   ```

### 4. Check Database Schema

1. Ga naar Supabase Dashboard → Table Editor
2. Check of `projects` tabel bestaat
3. Check of deze kolommen aanwezig zijn:
   - id (UUID, primary key)
   - name (text)
   - description (text)
   - user_id (UUID, foreign key naar auth.users)
   - created_date (timestamptz)
   - etc.

4. Als tabel ontbreekt: Run `supabase_schema.sql` opnieuw in SQL Editor

### 5. Check RLS Policies

1. Ga naar Supabase Dashboard → Authentication → Policies
2. Selecteer `projects` tabel
3. Check of er een policy is voor INSERT:
   ```sql
   CREATE POLICY "Users can create their own projects"
     ON projects FOR INSERT
     WITH CHECK (auth.uid() = user_id);
   ```

4. Als policy ontbreekt: Run deze SQL in SQL Editor

### 6. Test Authenticatie

1. Probeer eerst in te loggen/registreren
2. Check Supabase → Authentication → Users of je account bestaat
3. Check browser console voor authentication errors

## Veelvoorkomende Errors:

### "permission denied for table projects"
- **Oorzaak**: RLS policies blokkeren toegang
- **Oplossing**: Check en fix RLS policies zoals hierboven

### "relation 'projects' does not exist"
- **Oorzaak**: Database tabel bestaat niet
- **Oplossing**: Run `supabase_schema.sql` script opnieuw

### "new row violates row-level security policy"
- **Oorzaak**: RLS policy vereist user_id maar die is null
- **Oplossing**: Zorg dat je ingelogd bent voordat je project aanmaakt

### "invalid input syntax for type uuid"
- **Oorzaak**: user_id is niet een geldig UUID
- **Oplossing**: Check authentication, zorg dat je ingelogd bent

## Test Stappen:

1. **Test lokaal eerst:**
   ```bash
   cd /Users/rivaldomacandrew/Desktop/apps/breathe/buildflow
   npm install
   # Maak .env file aan met credentials
   npm run dev
   ```

2. **Test authenticatie:**
   - Probeer in te loggen/registreren
   - Check browser console voor errors
   - Check Supabase → Authentication → Users

3. **Test project aanmaken:**
   - Log in
   - Maak een project aan
   - Check browser console voor errors
   - Check Supabase → Table Editor → projects tabel

4. **Check Supabase Logs:**
   - Ga naar Supabase Dashboard → Logs
   - Check Database logs voor SQL errors
   - Check API logs voor request errors

## Als het nog steeds niet werkt:

1. Check de exacte error message in browser console
2. Check Supabase logs voor meer details
3. Check of alle environment variables correct zijn
4. Verify dat database schema correct is ingesteld
5. Check of RLS policies correct zijn geconfigureerd

