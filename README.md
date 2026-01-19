## ADNEO (Premium Domain Finder)

Monorepo minimal (MVP en cours).

### Prérequis

- Node.js (LTS recommandé)
- (Optionnel) Docker pour Redis

### Démarrage

1) Installer les dépendances

```bash
npm install
cd apps/web && npm install
cd ../api && npm install
```

2) (Optionnel) Lancer Redis (recommandé pour la queue/cache)

```bash
docker compose up -d
```

3) Lancer web + api

```bash
npm run dev
```

### Services

- Web: `http://localhost:3000`
- API: `http://localhost:3001` (health: `/health`)
