/**
 * Palette MotoFyab.
 *
 * Direction : "signalétique de rue haïtienne" — aplats francs, contours encre
 * épais, ombres dures décalées (pas de flou/glow), sans le combo
 * crème + serif + terracotta ni le fond quasi-noir + accent néon qu'on voit
 * partout ailleurs.
 *
 * - `tint`   = orange Mangue : action principale, sélection, accent de marque.
 * - `tint2`  = bleu Encre : action secondaire, surfaces sombres, contraste.
 * - `star`   = or : réservé à la notation, pour ne jamais se confondre avec le tint.
 * - `border` = contour épais façon enseigne peinte (2px dans les composants).
 * - `card`   = surface des cartes/modales, distincte du fond de l'écran.
 */

import { Platform } from 'react-native';

const tintColorLight = '#F2760F'; // Mangue
const tintColorDark = '#FF8A3D'; // Mangue, éclaircie pour ressortir sur fond encre

export const Colors = {
  light: {
    text: '#12203A',
    background: '#F4F6F9',
    card: '#FFFFFF',
    border: '#12203A',
    borderMuted: '#D7DEE8',
    tint: tintColorLight,
    tint2: '#12203A',
    icon: '#4A5568',
    tabIconDefault: '#8B93A4',
    tabIconSelected: tintColorLight,
    star: '#F5A623',
    danger: '#E63946',
    success: '#2F9E5B',
    shadow: '#12203A',
  },
  dark: {
    text: '#EDEFF3',
    background: '#0F1E33',
    card: '#16294A',
    border: '#EDEFF3',
    borderMuted: '#2B3B57',
    tint: tintColorDark,
    tint2: '#FFA94D',
    icon: '#AAB4C6',
    tabIconDefault: '#7C8AA3',
    tabIconSelected: tintColorDark,
    star: '#FFD166',
    danger: '#FF8A8A',
    success: '#4CC38A',
    shadow: '#000000',
  },
};

/**
 * Ombre "dure" façon enseigne peinte : décalée, sans flou, sans dégradé.
 * À combiner avec un `border` épais sur le même élément.
 * NB : Android (elevation) ne permet pas un contrôle fin du décalage — c'est
 * une approximation volontaire, le rendu iOS/web reste fidèle.
 */
export const HardShadow = {
  light: {
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  dark: {
    shadowColor: Colors.dark.shadow,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 0,
    elevation: 4,
  },
};

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
};

export const BorderWidth = {
  thin: 1,
  thick: 2,
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
