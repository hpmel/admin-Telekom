# 🟢 Écono Télékom CRM

> CRM/TEM sur mesure pour Écono Télékom — Tour de contrôle pour la gestion des clients B2B en télécommunications.

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 16 (App Router) + React 19 + TypeScript |
| UI | Tailwind CSS v4 + shadcn/ui |
| Base de données | PostgreSQL via Supabase |
| Auth | Supabase Auth |
| Hébergement | Vercel |

## Démarrage rapide

```bash
# Cloner le repo
git clone https://github.com/hpmel/econotelekom-crm.git
cd econotelekom-crm

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env.local
# Remplir les valeurs Supabase dans .env.local

# Créer les tables dans Supabase
# → Copier le contenu de supabase/migrations/001_initial_schema.sql
# → Coller dans Supabase SQL Editor et exécuter

# Lancer le serveur de développement
npm run dev
```

## Modules

- **📊 Dashboard** — KPIs, pipeline, alertes, activité récente
- **👥 Clients** — CRUD complet, recherche, filtres par statut
- **📋 Pipeline** — Vue Kanban (Analyse → Négociation → Courtage → Client)
- **📡 Inventaire Télécom** — Services par client/fournisseur
- **💰 Facturation** — Calcul auto 27% + 77$/h, taxes QC (TPS/TVQ)
- **📄 Documents** — *(Phase 2)* Génération PDF, e-signatures
- **📧 Communications** — *(Phase 2)* Templates courriel automatisés

## Modèle d'affaires

- **27%** des économies générées (calculé sur 24 mois si sans contrat)
- **77 $/h** pour le travail administratif
- Taxes Québec : TPS 5% + TVQ 9.975%

## Structure

```
src/
├── app/
│   ├── dashboard/       # Toutes les pages CRM
│   ├── login/           # Page de connexion
│   └── layout.tsx       # Root layout
├── components/ui/       # shadcn/ui
├── lib/
│   ├── supabase/        # Client, server, queries
│   ├── facturation.ts   # Moteur de calcul
│   └── mock-data.ts     # Données de dev
└── types/               # TypeScript definitions
```

## Licence

Propriétaire — KMD Web © 2025
