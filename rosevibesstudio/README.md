# RoseVibesStudio Portfolio Website

Een moderne, responsive portfolio website voor RoseVibesStudio, gebouwd met HTML, Tailwind CSS en Vite.

## 🚀 Features

- **Modern Design**: Schone, minimalistische interface met prachtige animaties
- **Fully Responsive**: Werkt perfect op alle apparaten
- **Fast Performance**: Geoptimaliseerd voor snelheid
- **Smooth Animations**: Subtiele animaties voor een premium gevoel
- **SEO Friendly**: Goed gestructureerd voor zoekmachines

## 📋 Vereisten

- Node.js (versie 18 of hoger)
- npm of yarn

## 🛠️ Installatie

1. **Clone of download dit project**
   ```bash
   cd rosevibesstudio
   ```

2. **Installeer dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   De website is nu beschikbaar op `http://localhost:3000`

4. **Build voor productie**
   ```bash
   npm run build
   ```

## 📦 Project Structuur

```
rosevibesstudio/
├── index.html          # Hoofd HTML bestand
├── package.json        # Dependencies en scripts
├── vite.config.js      # Vite configuratie
├── vercel.json         # Vercel deployment configuratie
└── README.md          # Deze file
```

## 🔗 GitHub Setup

### Stap 1: Maak een nieuwe repository op GitHub

1. Ga naar [GitHub](https://github.com) en log in
2. Klik op "New repository"
3. Geef het de naam: `rosevibesstudio`
4. Kies **Public** of **Private**
5. **NIET** initialiseren met README, .gitignore of licentie (we hebben deze al)
6. Klik "Create repository"

### Stap 2: Koppel je lokale project aan GitHub

Open terminal in de `rosevibesstudio` directory en voer uit:

```bash
# Initialiseer git (als nog niet gedaan)
git init

# Voeg alle bestanden toe
git add .

# Maak eerste commit
git commit -m "Initial commit: RoseVibesStudio portfolio website"

# Voeg GitHub remote toe (vervang USERNAME met jouw GitHub username)
git remote add origin https://github.com/USERNAME/rosevibesstudio.git

# Push naar GitHub
git branch -M main
git push -u origin main
```

## 🚀 Vercel Deployment

### Optie 1: Via Vercel Dashboard (Aanbevolen)

1. **Ga naar [Vercel](https://vercel.com)** en log in met je GitHub account

2. **Klik op "Add New Project"**

3. **Importeer je GitHub repository**
   - Selecteer de `rosevibesstudio` repository
   - Vercel detecteert automatisch Vite

4. **Configureer project settings:**
   - Framework Preset: **Vite**
   - Build Command: `npm run build` (automatisch gedetecteerd)
   - Output Directory: `dist` (automatisch gedetecteerd)
   - Install Command: `npm install` (automatisch gedetecteerd)

5. **Klik "Deploy"**

6. **Je website is live!** 🎉
   - Vercel geeft je een URL zoals: `rosevibesstudio.vercel.app`
   - Je kunt een custom domain toevoegen in de project settings

### Optie 2: Via Vercel CLI

```bash
# Installeer Vercel CLI globaal
npm install -g vercel

# Login
vercel login

# Deploy (in de rosevibesstudio directory)
vercel

# Voor productie deployment
vercel --prod
```

## 🔄 Updates Deployen

Elke keer dat je wijzigingen maakt:

```bash
# Commit je wijzigingen
git add .
git commit -m "Beschrijving van je wijzigingen"
git push
```

Vercel detecteert automatisch de push en deployt een nieuwe versie! 🚀

## 📝 Custom Domain Toevoegen

1. Ga naar je Vercel project dashboard
2. Klik op "Settings" → "Domains"
3. Voeg je custom domain toe (bijv. `rosevibesstudio.com`)
4. Volg de DNS instructies die Vercel geeft

## 🎨 Aanpassingen Maken

### Kleuren Aanpassen

De hoofdkleuren zijn:
- **Roze**: `#FF6B9D`
- **Paars**: `#C44DFF`
- **Blauw**: `#4DA6FF`
- **Geel**: `#FFD93D`

Zoek en vervang deze kleuren in `index.html` om je eigen kleurenschema te maken.

### Content Aanpassen

Open `index.html` en pas de tekst, afbeeldingen en links aan naar jouw eigen content.

### Afbeeldingen Toevoegen

1. Maak een `public/` of `assets/` folder
2. Voeg je afbeeldingen toe
3. Update de `src` attributen in `index.html` naar je lokale bestanden

## ❓ Veelgestelde Vragen

### Heb ik Supabase nodig?

**Nee!** Voor een statische portfolio website heb je geen Supabase nodig. Supabase is alleen nodig als je:
- Een contact formulier met database wilt
- User authentication nodig hebt
- Een blog met database wilt
- Andere backend functionaliteit nodig hebt

Voor nu is dit een volledig statische website die perfect werkt zonder database.

### Kan ik een contact formulier toevoegen?

Ja! Je kunt:
1. Een simpele `mailto:` link gebruiken (zoals nu)
2. Een service zoals [Formspree](https://formspree.io/) gebruiken
3. Later Supabase toevoegen als je een database nodig hebt

## 📞 Support

Voor vragen of problemen, open een issue op GitHub of neem contact op via hello@rosevibesstudio.com

## 📄 Licentie

MIT License - voel je vrij om dit project te gebruiken voor je eigen portfolio!

---

**Made with ❤️ by RoseVibesStudio**

