# MotoFyab

Application de moto-taxi pour Haïti — commande directement depuis le téléphone, sans passer par un appel téléphonique à une compagnie.

## Contexte et positionnement

- Il n'existe quasiment pas d'application de transport en Haïti. Le secteur est informel : interpellation dans la rue ou appel direct à des compagnies.
- **Moto uniquement.** Pas de voiture — le moto-taxi est le moyen de transport urbain dominant en Haïti (environ 60% des déplacements à Port-au-Prince, Cap-Haïtien, Les Cayes), et il n'y a pas de service de taxi voiture établi à concurrencer.
- Le nom du projet est **MotoFyab** — "fyab" (fiable, en créole) porte l'argument différenciant central : la sécurité et la confiance, dans un pays où ces deux points sont un vrai souci pour les usagers.
- Positionnement design : une identité visuelle ancrée dans l'esthétique **tap-tap** (bus peints à la main, couleurs saturées, lettrage façon enseigne) — volontairement à l'opposé du look générique "app de transport" (fond sombre + accent qui brille, ou crème + serif) que produisent la plupart des outils IA par défaut.

## Architecture produit

- **Deux applications séparées** : une pour le client, une pour le chauffeur. Pas une seule appli avec double interface — trop de complexité de permissions/UX à gérer en une seule base de code pour un MVP.
- **Un rôle "livreur"** (commandes dans les grands markets type Giant, Extra Market, livrées par un chauffeur dédié) est envisagé mais **repoussé à une V2**. Ne pas développer maintenant.
- On construit d'abord l'**appli Client**.

## Rôles et vérification

- Trois rôles prévus à terme : `client`, `chauffeur`, `livreur` (livreur en V2).
- **Une seule table `profiles`** pour tous les utilisateurs (avec un champ `role`), pas une table séparée par rôle. Raisons : une seule identité d'auth Supabase par utilisateur, pas de duplication des champs communs, un utilisateur peut changer/cumuler des rôles sans migration.
- **Inscription chauffeur** : le chauffeur soumet une photo de son permis, une photo de sa plaque d'immatriculation, et un selfie. Un agent humain vérifie manuellement ces documents et valide ou rejette.
- Ces documents sont stockés dans un **bucket Supabase Storage privé** (`driver-documents`), **jamais visibles du client ni même relisibles par le chauffeur une fois soumis** — seul un rôle admin/agent (`service_role`) peut y accéder. Le champ `verification_status` (`pending`/`approved`/`rejected`) sur `profiles` détermine si le chauffeur apparaît dans les résultats de recherche.

## Paiement

- Le client paie le chauffeur **en cash**, directement, comme c'est déjà l'usage en Haïti. L'application ne gère aucune transaction d'argent entre client et chauffeur.
- Chaque chauffeur a un **wallet interne prépayé** dans l'application.
- À chaque course **confirmée dans l'app** (peu importe le prix réellement payé en cash), une **commission (10-15%) est déduite automatiquement** du wallet du chauffeur — calculée sur le **prix estimé par l'application** (formule distance/km), pas sur une déclaration du chauffeur.
- Si le solde tombe à zéro ou en négatif, le chauffeur ne reçoit plus de nouvelles courses jusqu'à recharge.
- Recharge du wallet via **MonCash** (mobile money Digicel, dominant en Haïti). L'enregistrement marchand direct auprès de MonCash nécessite un compte bancaire et un enregistrement au Ministère du Commerce — trop lourd pour démarrer. Solution retenue : passer par une **passerelle tierce** (ex: MonCashConnect, PeyeCash, Bazik) qui gère déjà ce statut marchand et expose une API REST simple. Ces passerelles prennent une commission au passage (ex: ~3% en plan gratuit) — à comparer avant de choisir un fournisseur. Ce n'est pas prioritaire tant qu'il n'y a pas de chauffeurs actifs.
- Pas de système d'abonnement/forfait de courses (rejeté — trop compliqué à comprendre pour l'utilisateur moyen).

## Déroulé d'une course (appli Client)

1. Écran carte : géolocalisation du client, chauffeurs disponibles affichés dans un rayon ajustable (~2-3 km au départ), via une fonction RPC `nearby_drivers` qui n'expose que prénom/note/modèle de moto/distance — jamais la plaque ni la position brute hors course active.
2. Point de départ et destination choisis en déplaçant un pin sur la carte (pas de recherche d'adresse texte — l'adressage est peu fiable en Haïti).
3. Prix estimé affiché avant confirmation (formule simple basée sur la distance).
4. À la confirmation, la demande est envoyée aux chauffeurs proches avec un **minuteur** (60 secondes par défaut) — passé ce délai sans acceptation, la course expire automatiquement.
5. **Un client ne peut avoir qu'une seule course active à la fois** (contrainte en base de données, pas seulement côté interface) — impossible de commander plusieurs motos en parallèle. Même règle côté chauffeur : une seule course active assignée à la fois.
6. Une fois un chauffeur assigné, un **chat texte in-app** s'ouvre (ex: "je suis devant le portail bleu"). **Aucun numéro de téléphone n'est jamais partagé ou visible** — c'est interdit par design, pas juste masqué. Le chat se ferme automatiquement à la fin de la course (statut `terminee`/`annulee`/`expiree`).
7. Fin de course → notation bidirectionnelle (client note chauffeur, chauffeur note client), historique enregistré.

## Fonctionnalités additionnelles retenues

- **Bouton SOS** visible pendant une course active (sauf en attente) — partage la position et les infos de la course à un contact/numéro d'urgence.
- **Système de notation** (1-5 étoiles + commentaire).
- **Historique des courses** consultable côté client.
- Application pensée pour une **faible consommation de données** et des connexions instables (contexte réseau haïtien).
- **Créole en langue par défaut**, pas de traduction française littérale de l'interface.

## Stack technique

- **React Native avec Expo SDK 54** (rester sur SDK 54, pas SDK 57 — trop récent, sorti le 30 juin 2026, risque de librairies pas encore à jour ; SDK 54 reçoit des correctifs critiques jusqu'à sa prochaine version prévue vers septembre-octobre 2026).
- **Supabase** comme backend (Auth, Postgres, Storage, Realtime, RLS).
- **Redux Toolkit** pour la gestion d'état (déjà en cours d'apprentissage côté développeur) — un slice `activeRide` alimenté par un abonnement Supabase Realtime sur la table des courses, plutôt qu'un re-fetch à chaque changement.
- **Cartes : OpenStreetMap**, probablement via MapLibre GL — gratuit, pas de facturation au volume contrairement à Google Maps. Mapbox reste une option de repli si besoin de plus de polish (tier gratuit généreux mais SDK de navigation limité à 100 utilisateurs actifs/mois gratuits).
- Le développeur part de zéro en React Native (background Python + JS partiel), a déjà rencontré des soucis d'environnement Android sur Windows 11 (NDK, émulateur).

## Schéma de base de données (état actuel)

Tables existantes côté Supabase (nommage conservé, en français) :
- `profiles` : id, role, ville, nom, prenom, telephone, verification_status, verification_submitted_at, is_online, rating, total_rides, avatar_url, rejection_reason — complété par : wallet_balance, current_lat, current_lng, last_location_update, moto_plate, moto_model
- `courses` : id, client_id, chauffeur_id, depart, destination, statut, created_at — complété par : pickup/dropoff lat-lng, estimated_distance_km, estimated_price, expires_at, accepted_at, arrived_at, started_at, completed_at, cancelled_at, cancellation_reason
- Tables ajoutées : `driver_documents` (privé), `ride_messages` (chat lié au statut de la course), `ratings`, `wallet_transactions`
- Contraintes clés : une seule course active par client (`courses_one_active_per_client`), une seule par chauffeur (`courses_one_active_per_chauffeur`) — index uniques partiels en base
- Bucket Storage `driver-documents` : privé, limite 5MB, types jpeg/png/heic uniquement

*(Remarque : la partie Supabase est actuellement mise de côté dans le développement — le focus est passé sur l'interface avant de reprendre le backend.)*

## Direction design (appli Client)

- **Aucune esthétique "générique IA"** : pas de fond quasi-noir avec un seul accent qui brille, pas de crème + serif + terracotta, pas de style broadsheet. C'est une contrainte explicite et non négociable du projet.
- Identité ancrée dans le **tap-tap haïtien** : couleurs plates saturées (jaune #FFB627, rouge #E63946, bleu #2A4494, sarcelle #1D7874, vert #3A9D23, fond papier #FBF0DB, encre #211C16), bandes peintes en diagonale façon toit de tap-tap, contours noirs épais façon enseigne peinte, **ombres dures décalées (pas de flou/glow)**, éléments légèrement pivotés pour un effet "peint à la main" plutôt qu'aligné à la grille.
- Typographies : **Bungee** (display, bloc, façon enseigne peinte) + **Baloo 2** (corps, rond, chaleureux et lisible) — délibérément différentes des typos SaaS habituelles.
- Pins de carte en forme de petits fanions colorés plutôt que des gouttes génériques ; étoiles décoratives ; badges/plaques légèrement pivotés.
- Textes de l'interface en créole (ex: "Rele yon moto", "Kounye a").
- Premier écran conçu : **Accueil** (carte + un seul bouton d'action "Rele yon moto"). Un mockup visuel React/Tailwind a été produit pour valider cette direction avant traduction en composants React Native réels.

## Arborescence Expo Router prévue (appli Client)

```
app/
├── _layout.tsx
├── (auth)/
│   ├── telephone.tsx        # saisie numéro
│   ├── verification.tsx     # code OTP SMS
│   └── inscription.tsx      # prénom, nom, ville
├── (app)/
│   ├── index.tsx             # Accueil : carte + bouton Commander
│   ├── historique.tsx
│   └── profil.tsx
├── commande/
│   ├── depart.tsx
│   ├── destination.tsx
│   └── confirmation.tsx
├── course/
│   └── [id].tsx               # écran unique, contenu selon statut (Realtime)
└── notation/
    └── [id].tsx
```

## Points encore ouverts / à trancher plus tard

- Choix final du fournisseur de passerelle MonCash (comparer MonCashConnect / PeyeCash / Bazik sur les frais et la fiabilité).
- Mécanisme précis du bouton SOS (SMS direct à un contact, ou notification à un numéro fixe MotoFyab).
- Développement du rôle livreur (V2).
- Traduction complète du mockup web en composants React Native/Expo réels.
