# Development Workflow

Hoe voeg je nieuwe features toe of los je bugs op in de Buildflow app.

## 🚀 Workflow Overzicht

```
Lokaal werken → Testen → Commit → Push naar GitHub → Automatisch deployen op Vercel
```

## 📝 Stappen voor Nieuwe Features of Bugfixes

### 1. Lokaal Werken

```bash
# Ga naar je project map
cd /Users/rivaldomacandrew/Desktop/breathe/buildflow

# Zorg dat je de laatste code hebt
git pull origin main

# Start development server
npm run dev
```

De app draait nu lokaal op `http://localhost:5173` (of een andere poort)

### 2. Maak Wijzigingen

- Pas code aan in je editor
- Test lokaal in de browser
- Check browser console voor errors
- Test of alles werkt

### 3. Commit je Wijzigingen

```bash
# Bekijk wat je hebt gewijzigd
git status

# Voeg bestanden toe
git add .

# Of voeg specifieke bestanden toe
git add src/pages/Home.jsx
git add src/components/MyNewComponent.jsx

# Maak een commit met duidelijke beschrijving
git commit -m "Add: nieuwe feature X"
# of
git commit -m "Fix: bug in login functionaliteit"
```

**Goede commit messages:**
- `Add: nieuwe feature voor project sharing`
- `Fix: authentication error bij login`
- `Update: verbeter UI van dashboard`
- `Remove: oude ongebruikte code`

### 4. Push naar GitHub

```bash
git push origin main
```

### 5. Vercel Deployt Automatisch

- Vercel detecteert automatisch de nieuwe push
- Start automatisch een nieuwe build
- Deployt de nieuwe versie naar je live site
- Je ziet de wijzigingen binnen 1-2 minuten live!

## 🔀 Werken met Branches (Optioneel - Aanbevolen)

Voor grotere features of experimenten is het beter om branches te gebruiken:

### Maak een nieuwe branch

```bash
# Maak en switch naar nieuwe branch
git checkout -b feature/mijn-nieuwe-feature
# of voor bugfixes:
git checkout -b fix/login-bug
```

### Werk aan je feature

```bash
# Maak wijzigingen
# Test lokaal
npm run dev

# Commit
git add .
git commit -m "Add: nieuwe feature"

# Push branch naar GitHub
git push origin feature/mijn-nieuwe-feature
```

### Merge naar main

```bash
# Switch terug naar main
git checkout main

# Pull laatste wijzigingen
git pull origin main

# Merge je feature branch
git merge feature/mijn-nieuwe-feature

# Push naar GitHub
git push origin main
```

Of gebruik GitHub Pull Requests (aanbevolen):
1. Push je branch naar GitHub
2. Ga naar GitHub → Pull Requests → New Pull Request
3. Selecteer je branch
4. Review en merge

## 🐛 Bug Fixing Workflow

### 1. Identificeer de Bug

- Test de app lokaal of op Vercel
- Check browser console voor errors
- Check Supabase logs als het database gerelateerd is
- Noteer wat er mis gaat

### 2. Fix de Bug Lokaal

```bash
# Start development server
npm run dev

# Maak je fix
# Test dat de fix werkt
```

### 3. Commit en Push

```bash
git add .
git commit -m "Fix: beschrijving van de bug fix"
git push origin main
```

### 4. Test op Production

- Wacht tot Vercel deployed heeft (1-2 minuten)
- Test de fix op je live site
- Check of de bug opgelost is

## 🔍 Debugging Tips

### Lokaal Testen

```bash
# Development server met hot reload
npm run dev

# Check voor build errors
npm run build

# Lint checken
npm run lint
```

### Browser Console

- Open Developer Tools (F12 of Cmd+Option+I)
- Check Console voor JavaScript errors
- Check Network tab voor API call errors
- Check Application tab voor LocalStorage issues

### Supabase Logs

1. Ga naar Supabase Dashboard
2. Ga naar Logs
3. Check Database logs voor SQL errors
4. Check API logs voor request/response issues

### Vercel Logs

1. Ga naar Vercel Dashboard
2. Klik op je project
3. Ga naar Deployments
4. Klik op een deployment
5. Bekijk Build Logs of Runtime Logs

## 📦 Dependencies Toevoegen

### Nieuwe Package Installeren

```bash
# Installeer package
npm install package-naam

# Test lokaal
npm run dev

# Commit package.json en package-lock.json
git add package.json package-lock.json
git commit -m "Add: package-naam dependency"
git push origin main
```

### Package Updaten

```bash
# Update alle packages
npm update

# Of update specifieke package
npm install package-naam@nieuwe-versie

# Test dat alles nog werkt
npm run dev
npm run build

# Commit
git add package.json package-lock.json
git commit -m "Update: package-naam naar versie X"
git push origin main
```

## 🔐 Environment Variables Wijzigen

### Lokaal (.env)

```bash
# Bewerk .env file
# Voeg nieuwe variabele toe
VITE_MY_NEW_VAR=waarde

# Herstart development server
npm run dev
```

### Vercel

1. Ga naar Vercel Dashboard → Project → Settings
2. Ga naar Environment Variables
3. Voeg nieuwe variabele toe
4. Selecteer environments (Production, Preview, Development)
5. Klik Save
6. **Redeploy** (of wacht tot volgende deployment)

## 📁 Project Structuur

```
buildflow/
├── src/
│   ├── api/          # API calls (Supabase)
│   ├── components/   # React components
│   ├── pages/        # Page components
│   ├── config/       # Configuratie (Supabase)
│   └── utils/        # Utility functies
├── public/           # Static files
├── package.json      # Dependencies
└── vercel.json       # Vercel configuratie
```

## ✅ Checklist voor Nieuwe Features

- [ ] Feature werkt lokaal
- [ ] Geen console errors
- [ ] Code is getest
- [ ] Geen build errors (`npm run build`)
- [ ] Git commit met duidelijke message
- [ ] Code gepusht naar GitHub
- [ ] Getest op Vercel (na deployment)
- [ ] Geen errors in Vercel logs

## 🚨 Belangrijke Best Practices

1. **Test altijd lokaal** voordat je pusht
2. **Gebruik duidelijke commit messages**
3. **Push regelmatig** (niet alles in één grote commit)
4. **Check Vercel logs** als iets niet werkt
5. **Backup belangrijk** - gebruik branches voor grote wijzigingen
6. **Documenteer** complexe features in code comments

## 📚 Handige Commando's

```bash
# Status checken
git status

# Wijzigingen bekijken
git diff

# Laatste commits bekijken
git log --oneline -10

# Pull laatste wijzigingen
git pull origin main

# Reset naar laatste commit (voorzichtig!)
git reset --hard HEAD

# Branch lijst
git branch

# Verwijder lokale branch
git branch -d branch-naam
```

## 🆘 Problemen Oplossen

### "npm run build" faalt lokaal
- Check voor import errors
- Check voor TypeScript errors
- Check console voor hints

### Deployment faalt op Vercel
- Check build logs in Vercel
- Test `npm run build` lokaal
- Check environment variables

### App werkt lokaal maar niet op Vercel
- Check environment variables in Vercel
- Check browser console op live site
- Check Supabase logs
- Check Vercel runtime logs

### Git merge conflicts
```bash
# Pull met rebase
git pull origin main --rebase

# Los conflicts op in editor
# Voeg opgeloste files toe
git add .
git commit
git push origin main
```

## 📞 Hulp Nodig?

- Check Vercel docs: https://vercel.com/docs
- Check Supabase docs: https://supabase.com/docs
- Check React docs: https://react.dev
- Check Vite docs: https://vitejs.dev

