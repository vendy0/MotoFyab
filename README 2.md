# MotoFyab — écran d'accueil (reconstruit depuis le wireframe koboyo)

## Installation

Dans un projet Expo existant (avec `expo-router` déjà configuré) :

```bash
npx expo install lucide-react-native react-native-svg
```

Puis copie les dossiers `app/` et `components/` ainsi que `types.ts`
à la racine de ton projet (en fusionnant avec ton `app/` existant si besoin).

## Structure

- `app/_layout.tsx` — Tabs (bottom bar) : Transactions, Historique, Home, Messages, Réglages.
  Le point jaune derrière l'icône maison reproduit l'état actif du wireframe.
- `app/index.tsx` — écran Home : logos, dropdown Ville, boutons tri/filtre, liste des chauffeurs.
- `components/DriverCard.tsx` — la carte chauffeur (avatar, nom, note, distance, courses).
- `components/ContactModal.tsx` — la popup "Voulez-vous contacter @username ?".
- `components/DropdownMenu.tsx` / `IconMenu.tsx` — menus réutilisables (Ville / Tri / Filtre).
- `types.ts` — type `Driver`.

## À faire de ton côté

- Remplacer `DRIVERS` (données statiques) par ton appel API/temps réel.
- Remplacer les deux `logoBox` jaunes dans `app/index.tsx` par de vraies images
  (`<Image source={require(...)} />`) une fois les logos MotoFyab et Infinity Holdings disponibles.
- Brancher `onConfirm` dans `ContactModal` sur l'action réelle (appel, chat, etc.).
- Les options de tri/filtre ("Le plus proche", "> ou < x mètres/km", etc.) sont pour l'instant
  juste sélectionnées visuellement — la logique de tri/filtrage réel de `DRIVERS` reste à implémenter.
