# GitHub Push Instructies voor Fesa Repository

## Probleem
Je bent ingelogd met een ander GitHub account (`konsensi-tl`) en hebt geen toegang tot `rivaldorose/fesa`.

## Oplossing 1: Personal Access Token (Aanbevolen)

### Stap 1: Maak een Personal Access Token
1. Ga naar GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Klik op "Generate new token (classic)"
3. Geef het een naam: "fesa-flutter"
4. Selecteer scopes: `repo` (alle repo permissions)
5. Klik "Generate token"
6. **Kopieer het token** (je ziet het maar één keer!)

### Stap 2: Push met Token
```bash
cd /Users/rivaldomacandrew/Desktop/breathe

# Push met token (gebruik je token als wachtwoord)
git push -u origin main
# Username: rivaldorose
# Password: [plak hier je token]
```

## Oplossing 2: SSH gebruiken

### Stap 1: Check of je SSH key hebt
```bash
ls -la ~/.ssh
```

### Stap 2: Als je geen SSH key hebt, maak er een
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Druk Enter voor alle prompts
```

### Stap 3: Voeg SSH key toe aan GitHub
```bash
# Kopieer je public key
cat ~/.ssh/id_ed25519.pub
```

1. Ga naar GitHub → Settings → SSH and GPG keys
2. Klik "New SSH key"
3. Plak je public key
4. Klik "Add SSH key"

### Stap 4: Update remote naar SSH
```bash
cd /Users/rivaldomacandrew/Desktop/breathe
git remote set-url origin git@github.com:rivaldorose/fesa.git
git push -u origin main
```

## Oplossing 3: GitHub CLI gebruiken

### Installeer GitHub CLI
```bash
brew install gh
```

### Login
```bash
gh auth login
# Volg de instructies
```

### Push
```bash
git push -u origin main
```

## Verificatie

Na het pushen, check of het gelukt is:
```bash
git remote -v
# Moet tonen: origin  https://github.com/rivaldorose/fesa.git (of git@github.com:rivaldorose/fesa.git)

# Check laatste commit
git log --oneline -1
```

## Troubleshooting

### "Permission denied" blijft
- Check of je de juiste GitHub account gebruikt
- Check of je toegang hebt tot de repository
- Probeer SSH in plaats van HTTPS

### "Repository not found"
- Check of de repository bestaat op GitHub
- Check of je de juiste username gebruikt (rivaldorose)

### "Authentication failed"
- Gebruik een Personal Access Token in plaats van wachtwoord
- Of gebruik SSH

