import { TouchableOpacity, StyleSheet, View, useColorScheme } from 'react-native';
import { ArrowLeft, Archive, Star } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { CardShadow, Radii, BorderWidth } from '@/constants/theme';

type Props = {
  username: string;
  rating: number;
  dateLabel: string;
  /** Affiche une flèche retour (utilisé sur le détail d'archive, en dehors des onglets). */
  onBack?: () => void;
  /** Affiche un raccourci vers Archives (utilisé sur la conversation active). */
  onArchivePress?: () => void;
};

export default function ChatHeader({ username, rating, dateLabel, onBack, onArchivePress }: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'borderMuted');
  const textColor = useThemeColor({}, 'text');
  const goldColor = useThemeColor({}, 'gold');
  const tint = useThemeColor({}, 'tint');
  const cardShadow = CardShadow[colorScheme];

  const initials = username
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <ThemedView style={[styles.header, { backgroundColor: cardColor, borderColor }, cardShadow]}>
      {onBack && (
        <TouchableOpacity onPress={onBack} hitSlop={8} style={styles.sideButton}>
          <ArrowLeft size={22} color={textColor} strokeWidth={2.5} />
        </TouchableOpacity>
      )}

      <View style={[styles.avatar, { backgroundColor: `${tint}26` }]}>
        <ThemedText style={[styles.avatarInitials, { color: tint }]}>{initials}</ThemedText>
      </View>

      <View style={styles.info}>
        <ThemedText type="defaultSemiBold" numberOfLines={1}>
          {username}
        </ThemedText>
        <ThemedText style={styles.date}>{dateLabel}</ThemedText>
      </View>

        <View style={styles.headerEnd}>
          <View style={styles.ratingRow}>
            <Star size={16} color={goldColor} fill={goldColor} />
            <ThemedText style={[styles.ratingText, { color: goldColor }]}>{rating.toFixed(1)}</ThemedText>
          </View>
    
          {onArchivePress && (
            <TouchableOpacity onPress={onArchivePress} hitSlop={8} style={styles.sideButton}>
              <Archive size={25} color={textColor} strokeWidth={2.2} />
            </TouchableOpacity>
          )}
        </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: BorderWidth.thin,
    gap: 10,
  },
  sideButton: {
    padding: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontWeight: '700',
    fontSize: 14,
  },
  info: {
    flex: 1,
  },
  date: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 1,
  },
  headerEnd: {
      flexDirection: "row",
      gap: 30
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontWeight: '700',
  },
});
