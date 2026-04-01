# ADNEO — Todo

## Phase 1 : Base de données
- [x] Schéma DB : tables announcements, templates, submissions, submission_logs, api_config, site_accounts
- [x] Migration SQL appliquée

## Phase 2 : Backend (tRPC routers)
- [x] Router announcements : CRUD annonces + upload images S3
- [x] Router templates : CRUD templates avec variables dynamiques
- [x] Router submissions : soumettre annonce multi-sites, statut, logs
- [x] Router admin.users : liste, rôles, stats
- [x] Router admin.config : CRUD clés API (Capmonster, 5sim)
- [x] Router admin.logs : logs de soumissions globaux
- [x] Service d'automatisation : intégration Capmonster + 5sim (stubs)
- [x] Notifications propriétaire : nouvelle inscription, échec dépôt, quota API

## Phase 3 : Pages publiques
- [x] Landing page (hero, features, CTA inscription gratuite)
- [x] Page inscription (email/password via OAuth)
- [x] Page connexion

## Phase 4 : Dashboard utilisateur
- [x] Layout dashboard avec sidebar (DashboardLayout)
- [x] Page "Mes annonces" : liste, créer, éditer, supprimer
- [x] Formulaire annonce : titre, description, prix, catégorie, contact, photos (upload S3)
- [x] Variables optionnelles dans le formulaire
- [x] Page "Mes templates" : liste, créer, éditer, supprimer
- [x] Page "Déposer une annonce" : sélection multi-sites + lancement soumission
- [x] Page "Mes soumissions" : liste avec statut (en cours, succès, échec) + logs détaillés

## Phase 5 : Panneau d'administration
- [x] Page admin "Utilisateurs" : liste, rôles, stats d'utilisation
- [x] Page admin "Configuration" : clés API Capmonster, 5sim, autres paramètres
- [x] Page admin "Logs" : toutes les soumissions, filtres, détails

## Phase 6 : Finalisation
- [x] Tests Vitest (routers principaux)
- [x] Checkpoint et push GitHub
