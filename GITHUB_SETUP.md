# Configuration GitHub - Push vers helloneovia/adneo

## Problème
Le compte Git actuel (`eurlcernunnos-star`) n'a pas les permissions pour pousser vers le dépôt.

## Solution : Utiliser un Personal Access Token (PAT)

### Étape 1 : Créer un Personal Access Token GitHub

1. Allez sur GitHub : https://github.com/settings/tokens
2. Cliquez sur **"Generate new token"** → **"Generate new token (classic)"**
3. Donnez un nom au token (ex: "ADNEO Push")
4. Sélectionnez les permissions :
   - ✅ `repo` (accès complet aux dépôts)
5. Cliquez sur **"Generate token"**
6. **COPIEZ LE TOKEN** (vous ne pourrez plus le voir après !)

### Étape 2 : Configurer Git avec le token

**Option A : Utiliser le token dans l'URL (temporaire)**
```bash
git remote set-url origin https://VOTRE_TOKEN@github.com/helloneovia/adneo.git
git push origin main
```

**Option B : Utiliser Git Credential Manager (recommandé)**
```bash
# Windows
git config --global credential.helper wincred

# Puis lors du push, entrez votre username et le token comme password
git push origin main
```

**Option C : Utiliser SSH (plus sécurisé)**
```bash
# 1. Générer une clé SSH si vous n'en avez pas
ssh-keygen -t ed25519 -C "votre_email@example.com"

# 2. Ajouter la clé à votre compte GitHub
# Copiez le contenu de ~/.ssh/id_ed25519.pub
# Allez sur https://github.com/settings/keys et ajoutez la clé

# 3. Changer le remote en SSH
git remote set-url origin git@github.com:helloneovia/adneo.git
git push origin main
```

### Étape 3 : Vérifier que vous avez les droits

Assurez-vous que votre compte GitHub a les droits d'écriture sur le dépôt `helloneovia/adneo`. Si vous n'êtes pas propriétaire, demandez les droits au propriétaire du dépôt.

## Alternative : Fork le dépôt

Si vous n'avez pas les droits, vous pouvez :
1. Fork le dépôt vers votre compte
2. Pousser vers votre fork
3. Créer une Pull Request

```bash
# Fork manuellement sur GitHub, puis :
git remote set-url origin https://github.com/VOTRE_USERNAME/adneo.git
git push origin main
```
