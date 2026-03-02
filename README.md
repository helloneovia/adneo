# ADNEO

## Pourquoi le bouton **Merge pull request** est grisé

Si GitHub affiche :

- **This branch has conflicts that must be resolved**
- fichier en conflit: `lib/i18n.ts`

alors c’est normal que **Merge pull request** soit désactivé.

👉 Ce n’est **pas** un problème de push.
C’est un problème de **conflit entre ta branche et `main`**.

---

## Solution simple (depuis GitHub)

1. Clique sur **Resolve conflicts**.
2. Garde la version correcte de `lib/i18n.ts` (ou fusionne les deux versions).
3. Clique **Mark as resolved**.
4. Clique **Commit merge**.
5. Reviens sur la PR : le bouton **Merge pull request** sera disponible.

---

## Solution recommandée (depuis ton terminal)

> Remplace `<ta-branche>` par le nom de ta branche PR.

```bash
git fetch origin
git checkout <ta-branche>
git rebase origin/main
```

Résous le conflit dans `lib/i18n.ts`, puis:

```bash
git add lib/i18n.ts
git rebase --continue
git push --force-with-lease
```

Ensuite retourne sur la PR: tu pourras cliquer sur **Merge pull request**.

---

## Vérification rapide avant merge

```bash
npx tsc --noEmit
```
