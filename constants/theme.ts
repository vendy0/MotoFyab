/**
 * Palette MotoFyab — v2.
 *
 * Reprise après retour : la v1 (bleu marine très sombre + orange vif,
 * contours épais partout) lisait "template néo-brutaliste IA". Cette
 * version adoucit les teintes pour qu'elles appartiennent à la même
 * famille (saturation/luminosité rapprochées), ajoute des couleurs de
 * soutien pour que ce soit un vrai système et pas un duo qui s'affronte,
 * et remplace les contours épais + ombre dure décalée par des bordures
 * fines et une ombre douce classique.
 *
 * - `tint`   = Ambre : action principale, sélection.
 * - `tint2`  = Denim : action/accent secondaire.
 * - `gold`   = notation (étoiles) — distinct de `tint` pour ne pas se confondre
 *   avec un bouton actif.
 * - `sage`   = accent tertiaire discret (badges, succès).
 * - `border` = réservé aux éléments interactifs (boutons, toggles) — pas aux cartes.
 * - `borderMuted` = bordure fine des cartes/inputs, à peine visible.
 */

import { Platform } from 'react-native';

const tintColorLight = '#C97A3D'; // Ambre
const tintColorDark = '#E0925A'; // Ambre, éclairci pour le fond sombre

export const Colors = {
  light: {
    text: '#26333F',
    background: '#F1F3F5',
    card: '#FFFFFF',
    border: '#3A5A78',
    borderMuted: '#DEE2E7',
    tint: tintColorLight,
    tint2: '#3A5A78',
    icon: '#5C6B78',
    tabIconDefault: '#9AA5AF',
    tabIconSelected: tintColorLight,
    gold: '#D9A441',
    sage: '#5E8B7E',
    danger: '#BC5544',
    success: '#4C8567',
  },
  dark: {
    text: '#EAE6DE',
    background: '#17212C',
    card: '#1F2B38',
    border: '#7FA0BE',
    borderMuted: '#2C3A48',
    tint: tintColorDark,
    tint2: '#7FA0BE',
    icon: '#9CAAB6',
    tabIconDefault: '#6E7C88',
    tabIconSelected: tintColorDark,
    gold: '#E6BB63',
    sage: '#7FAE9F',
    danger: '#D97A68',
    success: '#7FAE9F',
  },
};

/**
 * Ombre douce classique (flou léger, décalage discret) — remplace l'ombre
 * "dure" décalée de la v1, trop tape-à-l'œil.
 */
export const CardShadow = {
  light: {
    shadowColor: '#26333F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  dark: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 2,
  },
};

export const Radii = {
  sm: 10,
  md: 14,
  lg: 18,
};

/** `thin` pour les cartes/inputs (quasi invisible), `control` pour les éléments
 * interactifs qu'on veut clairement délimiter (boutons, toggles). */
export const BorderWidth = {
  thin: 1,
  control: 1.5,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
