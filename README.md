# ADNEO

## Résoudre le conflit de merge sur `lib/i18n.ts`

Si GitHub affiche **"This branch has conflicts that must be resolved"**, ce n’est pas un problème de `git push` :
le push est fait, mais la branche doit être synchronisée avec `main`.

### Option recommandée (rebase)

```bash
git fetch origin
git checkout <ta-branche>
git rebase origin/main
```

Ensuite, résous le conflit dans `lib/i18n.ts`, puis :

```bash
git add lib/i18n.ts
git rebase --continue
git push --force-with-lease
```

### Option merge (plus simple)

```bash
git fetch origin
git checkout <ta-branche>
git merge origin/main
```

Puis :

```bash
git add lib/i18n.ts
git commit
git push
```

### Vérification rapide

Après résolution, lance :

```bash
npx tsc --noEmit
```

Puis retourne sur la PR GitHub : le bouton *Merge* devrait réapparaître.
