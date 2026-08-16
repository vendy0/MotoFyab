# MotoFyab — README projet

Application de réservation de moto-taxi pour Haïti (React Native / Expo), développée sous **Infinity Holdings S.A.** Vendy est co-fondateur et actionnaire minoritaire de la société.

Ce document résume tout ce qui a été décidé/construit jusqu'ici, pour servir de mémoire de projet.

---

## 1. Stack technique

- **Frontend** : React Native + Expo, TypeScript
- **Routing** : Expo Router (fichiers dans `app/`)
- **Backend prévu** : Supabase (Postgres)
- **Icônes** : `lucide-react-native`
- **State management** : pas encore implémenté. Décision prise : **Redux Toolkit** (pas Redux "classique").
  - `createSlice` pour l'état client (ex. session utilisateur)
  - `RTK Query` pour l'état serveur (listes de chauffeurs, historique, etc. — à faire plus tard)
- **Fonts** : aucune font custom installée pour l'instant. Le thème utilise les fonts système (`Platform.select` avec familles `sans`/`rounded`/`mono`). Une piste évoquée (Bungee/Baloo 2, esprit "tap-tap") a été abandonnée faute d'assets — à reconsidérer si Vendy ajoute les fichiers de fonts un jour.

---

## 2. Structure des dossiers (cible, bonnes pratiques Expo Router)

```
app/
  _layout.tsx              # Stack racine, englobe le groupe (tabs)
  (tabs)/
    _layout.tsx             # <Tabs> — layout des 5 onglets
    index.tsx                # Home — liste des chauffeurs (FAIT)
    conversation.tsx         # Chat course active (EN COURS)
    history.tsx               # Historique des courses (VIDE)
    transactions.tsx          # Transactions/solde (VIDE)
    settings.tsx               # Paramètres (VIDE)
# Ces fichiers peuvent devenir des folders cas il est possible que l'on fasse une Navigation imbriquée. 
components/
  driver/
    DriverCard.tsx
    ContactModal.tsx
  filters/
    DropdownMenu.tsx
    IconMenu.tsx
    FilterModal.tsx
  common/
    ThemedTextInput.tsx
constants/
  theme.ts                  # Palette + tokens de design (source unique de vérité)
services/
  driverService.ts           # Mock de récupération des chauffeurs
  options.ts                  # Villes, libellés de tri
```

**Migration `app/` → `app/(tabs)/` — effectuée dans les échanges précédents.** Points clés :
- L'ancien `_layout.tsx` (celui avec `<Tabs>`) est devenu `app/(tabs)/_layout.tsx`.
- Un **nouveau** `app/_layout.tsx` racine a été créé : un simple `<Stack>` avec un seul écran `"(tabs)"`, `headerShown: false`.
- Les groupes `(tabs)` d'Expo Router n'apparaissent pas dans l'URL — `index` reste la route `/`.
- Futurs flux hors-onglets (auth, détail de course, notation) viendront comme frères de `(tabs)` dans `app/`, chacun comme écran du Stack racine.

---

## 3. Schéma de données (mock actuel, pensé pour coller à Supabase)

Défini dans `mockData.tsx`. Tables :

- **`users`** — commune à tous les rôles (`client` | `driver` | `admin`), évite la duplication. Champs clés : `id`, `first_name`, `last_name`, `username`, `role`, `phone`, `email`, `password_hash`, `join_date`, `is_active`, `success_rides`, `cancel_rides`, `avatar_url`, `avg_rating_given`.
- **`driver_profiles`** — extension propre aux chauffeurs (FK `user_id`) : `plate`, `vehicle_model`, `vehicle_color`, `rate`, `solde`, `currency`, `nif`, `is_online`, `location_lon/lat`, `last_location_update`.
- **`rides`** — chaque course : `status` (`pending` | `accepted` | `ongoing` | `completed` | `cancelled`), `fee`, `estimation`, `final_fare`, `currency`, `payment_method` (`cash` | `moncash` | `card`), `start`, `end`, `distance_km`, `duration_min`, timestamps (`requested_at`, `accepted_at`, `started_at`, `completed_at`, `cancelled_at`), `cancel_reason`, `conversation_id`.
- **`conversations`** — **liée à une `ride` (1 conversation = 1 course)**, pas un chat libre entre utilisateurs. Champs : `id`, `ride_id`, `started_at`, `ended_at`, `status` (`active` | `closed`).
- **`messages`** — `conversation_id`, `sender_id`, `receiver_id`, `content`, `sent_at`, `status` (`sent` | `delivered` | `read`).
- **`ratings`** — `ride_id`, `rated_by`, `rated_user`, `score` (1–5), `comment`, `created_at`.
- **`transactions`** — mouvements de solde chauffeur : `driver_id`, `ride_id`, `type` (`ride_earning` | `top_up` | `withdrawal` | `commission`), `amount`, `currency`, `created_at`.

### Règle métier — conversation liée à une course

- La conversation démarre **quand le chauffeur accepte la course** (pas avant).
- Une fois la course terminée : **archivage côté client** (pas suppression), pour la sécurité/confidentialité tout en gardant un historique en cas de litige.
- Conséquence pour l'écran `conversation.tsx` : c'est un **fil de discussion pour la course active en cours**, pas une boîte de réception multi-conversations. (Design en attente de la part de Vendy — le code sera fourni une fois la maquette envoyée.)

---

## 4. Design system — `constants/theme.ts`

### Historique des décisions

- **v1 (rejetée)** : bleu marine quasi-noir + orange vif, contours épais (2px) partout, ombre "dure" décalée façon néo-brutalisme. Jugée trop "IA générique" / template — cliché du moment.
- **v2 (actuelle)** : palette adoucie où les teintes appartiennent à la même famille de saturation/luminosité, avec des couleurs de soutien pour former un vrai système plutôt qu'un duo qui s'affronte. Contours fins (1px) sur cartes/inputs, ombre douce classique (flou léger, pas de décalage dur). Contours plus marqués (1.5px) réservés aux éléments interactifs (boutons, toggles).
- Règle d'or établie : **toutes les couleurs viennent de `theme.ts`**, aucune couleur codée en dur dans les composants — un changement de palette doit pouvoir se faire en éditant uniquement ce fichier.

### Tokens (`Colors.light` / `Colors.dark`)

| Token | Light | Dark | Usage |
|---|---|---|---|
| `text` | `#26333F` | `#EAE6DE` | Texte principal |
| `background` | `#F1F3F5` | `#17212C` | Fond d'écran |
| `card` | `#FFFFFF` | `#1F2B38` | Surface des cartes/modales |
| `border` | `#3A5A78` | `#7FA0BE` | Contours des éléments interactifs |
| `borderMuted` | `#DEE2E7` | `#2C3A48` | Contours fins (cartes, inputs, séparateurs) |
| `tint` (Ambre) | `#C97A3D` | `#E0925A` | Action principale, sélection |
| `tint2` (Denim) | `#3A5A78` | `#7FA0BE` | Action/accent secondaire |
| `icon` | `#5C6B78` | `#9CAAB6` | Icônes, texte discret |
| `tabIconDefault` | `#9AA5AF` | `#6E7C88` | Icônes d'onglets inactives |
| `tabIconSelected` | = `tint` | = `tint` | Icône d'onglet active |
| `gold` | `#D9A441` | `#E6BB63` | Notation (étoiles) — distinct de `tint` |
| `sage` | `#5E8B7E` | `#7FAE9F` | Accent tertiaire discret / succès |
| `danger` | `#BC5544` | `#D97A68` | Erreurs, annulation |
| `success` | `#4C8567` | `#7FAE9F` | Confirmations |

### Autres exports de `theme.ts`

- `CardShadow.light` / `CardShadow.dark` — ombre douce (`shadowOffset {0,2}`, `shadowOpacity` 0.08 clair / 0.3 sombre, `shadowRadius` 8, `elevation` 2).
- `Radii` — `sm: 10`, `md: 14`, `lg: 18`.
- `BorderWidth` — `thin: 1` (cartes/inputs), `control: 1.5` (boutons/toggles).
- `Fonts` — familles système via `Platform.select` (`sans`, `serif`, `rounded`, `mono`), pas de font custom chargée.

### Comment appliquer les tokens dans un composant

```tsx
const cardColor = useThemeColor({}, "card");
const borderColor = useThemeColor({}, "borderMuted");
const colorScheme = useColorScheme() ?? "light";
const cardShadow = CardShadow[colorScheme];

<ThemedView style={[styles.card, { backgroundColor: cardColor, borderColor }, cardShadow]}>
```

`ThemedView`/`ThemedText` (composants du template Expo, non modifiés) utilisent par défaut le token `background`/`text` — pour une couleur de surface différente (`card`), il faut la passer explicitement via `style`, pas via `lightColor`/`darkColor` (sinon on retombe sur du hex en dur).

---

## 5. Composants déjà construits

Tous dans le nouveau système de couleurs (v2), 100% pilotés par `theme.ts`, aucune couleur en dur.

- **`DriverCard.tsx`** — carte chauffeur : avatar (initiales sur fond `tint` à 15% d'opacité), nom, note (icône étoile en `gold`), distance (`MapPin`), nombre de courses (`RefreshCcw`). Bordure fine + ombre douce.
- **`ContactModal.tsx`** — modale de prise de contact avec un chauffeur : champs "Lieu de départ" / "Destination", boutons Non/Oui. Le bouton "Oui" appelle `onConfirm({ pickupLocation, destination })`, qui construit un `ContactRequest` (l'envoi réel au chauffeur — API/socket — reste un TODO, pas encore branché).
- **`FilterModal.tsx`** — filtres avancés (note, courses réussies, distance), chacun avec un comparateur **Minimum/Maximum** (libellés en toutes lettres, plus de symboles `>`/`<`), une icône reprise de `DriverCard` pour la reconnaissance visuelle, et une **phrase de résumé en direct** sous chaque champ (ex. "Minimum 4.5 ★") pour confirmer ce que le filtre va faire avant d'appliquer. Champ vide = pas de filtre sur ce critère.
- **`DropdownMenu.tsx`** — sélecteur simple (utilisé pour la ville).
- **`IconMenu.tsx`** — menu déclenché par une icône (utilisé pour le tri).
- **`ThemedTextInput.tsx`** — input textuel générique, couleurs (bordure, fond, placeholder) tirées du thème.

## 6. Écrans

| Écran | Statut |
|---|---|
| `(tabs)/index.tsx` (Home) | **Fait** — logos MotoFyab/Infinity Holdings (blocs `tint`/`tint2`), sélection ville, tri, filtres, liste de `DriverCard`, `ContactModal`. |
| `(tabs)/conversation.tsx` | **En cours** — fil de discussion de la course active. Design en préparation par Vendy, code à fournir ensuite avec la palette. |
| `(tabs)/history.tsx` | Vide |
| `(tabs)/transactions.tsx` | Vide |
| `(tabs)/settings.tsx` | Vide |

### `(tabs)/_layout.tsx`

5 onglets sans labels texte (icônes seules) : Transactions (`ArrowLeftRight`), Historique (`Clock3`), Home (`House`, avec un fond en pastille `tint` + icône blanche quand actif), Conversation (`MessagesSquare`), Réglages (`Settings`). Couleurs actives/inactives, fond de la barre et bordure supérieure tirés du thème.

---

## 7. State management — état des lieux

**Rien n'est encore implémenté côté MotoFyab.** Décisions prises pour quand ce sera fait :

- **Redux Toolkit**, pas Redux classique (`createStore`/`combineReducers`/types d'actions manuels — vu comme "périmé" par rapport à ce que Vendy avait appris, alors que c'est juste une version antérieure de la même bibliothèque).
- **`createSlice`** pour l'état que l'app modifie elle-même et qui doit survivre à la navigation :
  - Session utilisateur (profil connecté, rôle, token) — **prochaine étape**, seul besoin confirmé pour l'instant.
  - Plus tard, probablement : course active (statut, chauffeur assigné), notifications non lues.
- **RTK Query** pour l'état qui vient du serveur (liste de chauffeurs une fois branchée sur Supabase, historique...) — gère loading/erreur/cache/refetch automatiquement, à la place d'un `useState` + service manuel comme `driverService.ts` actuellement.
- Ce qui reste et doit **rester** en `useState` local (pas dans Redux) : état propre à un seul écran, ex. `city`/`sortBy`/`filters`/`filterModalVisible`/`selectedDriver` dans `index.tsx`.

Une conversion d'un ancien projet (`InterPam`, recettes + todolist) a été faite à titre d'exemple pédagogique pour illustrer la différence Redux classique → RTK (slices + RTK Query) : `tasksSlice.js` (todolist, état local), `recipesApi.js` (recettes, RTK Query avec la logique de bascule de clé API Spoonacular préservée), `store/index.js` (`configureStore`). Ce n'est **pas** du code MotoFyab, juste une référence pour comprendre le pattern avant de l'appliquer au vrai projet.

---

## 8. Prochaines étapes identifiées

1. Design + code de `(tabs)/conversation.tsx` (fil de discussion, course active, palette v2).
2. `authSlice` (Redux Toolkit) pour la session utilisateur.
3. Écrans `history.tsx`, `transactions.tsx`, `settings.tsx` (actuellement vides).
4. Brancher `driverService.ts` sur Supabase (via RTK Query) une fois le backend prêt.
5. Éventuellement : ajout de fonts custom si Vendy fournit les fichiers.
