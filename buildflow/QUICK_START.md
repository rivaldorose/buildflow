# Quick Start - Nieuwe Features of Bugfixes

Snelle referentie voor het toevoegen van features of oplossen van bugs.

## 🚀 Snelle Workflow

```bash
# 1. Ga naar project map
cd /Users/rivaldomacandrew/Desktop/breathe/buildflow

# 2. Haal laatste code op
git pull origin main

# 3. Start development server
npm run dev

# 4. Maak wijzigingen in je editor
# ... test in browser ...

# 5. Commit en push
git add .
git commit -m "Add: nieuwe feature"  # of "Fix: bug beschrijving"
git push origin main

# 6. Wacht 1-2 minuten → Vercel deployt automatisch!
```

## 📝 Voorbeelden

### Nieuwe Component Toevoegen

```bash
# 1. Maak component
# Maak bestand: src/components/MyComponent.jsx

# 2. Test lokaal
npm run dev

# 3. Commit
git add src/components/MyComponent.jsx
git commit -m "Add: MyComponent voor X functionaliteit"
git push origin main
```

### Bug Oplossen

```bash
# 1. Reproduceer bug lokaal
npm run dev

# 2. Fix de bug
# Pas code aan

# 3. Test fix
npm run dev

# 4. Commit
git add .
git commit -m "Fix: bug in login functionaliteit"
git push origin main
```

### Nieuwe Dependency Toevoegen

```bash
# 1. Installeer
npm install nieuwe-package

# 2. Test
npm run dev

# 3. Commit
git add package.json package-lock.json
git commit -m "Add: nieuwe-package dependency"
git push origin main
```

## ⚡ Snelle Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Test build
npm run lint         # Check code quality

# Git
git status           # Check wijzigingen
git add .            # Voeg alles toe
git commit -m "..."  # Commit
git push             # Push naar GitHub
git pull             # Haal laatste code op
```

## 🎯 Waar Werken Aan?

- **Components**: `src/components/`
- **Pages**: `src/pages/`
- **API/Supabase**: `src/api/`
- **Utils**: `src/utils/`
- **Config**: `src/config/`

## ✅ Na Pushen

1. Wacht 1-2 minuten
2. Check Vercel dashboard voor deployment status
3. Test op live site: https://buildflow-oxa2.vercel.app
4. Klaar! ✨

