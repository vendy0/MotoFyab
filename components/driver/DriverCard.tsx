import { Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import { MapPin, RefreshCcw, Star } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { CardShadow, Radii, BorderWidth } from '@/constants/theme';
import { Driver } from '@/types';

type Props = {
  driver: Driver;
  onPress: (driver: Driver) => void;
};

export default function DriverCard({ driver, onPress }: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'borderMuted');
  const iconColor = useThemeColor({}, 'icon');
  const goldColor = useThemeColor({}, 'gold');
  const tint = useThemeColor({}, 'tint');
  const cardShadow = CardShadow[colorScheme];

  return (
    <Pressable onPress={() => onPress(driver)}>
      <ThemedView style={[styles.card, { backgroundColor: cardColor, borderColor }, cardShadow]}>
        <View style={[styles.avatar, { backgroundColor: `${tint}26` }]}>
          <ThemedText style={[styles.avatarInitials, { color: tint }]}>
            {driver.username.slice(0, 2).toUpperCase()}
          </ThemedText>
        </View>

        <View style={styles.info}>
          <View style={styles.topRow}>
            <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.username}>
              {driver.username}
            </ThemedText>
            <View style={styles.ratingRow}>
              <Star size={16} color={goldColor} fill={goldColor} />
              <ThemedText style={[styles.ratingText, { color: goldColor }]}>
                {driver.rating.toFixed(1)}
              </ThemedText>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MapPin size={16} color={iconColor} strokeWidth={2.5} />
              <ThemedText style={styles.statText}>
                {Number.isFinite(driver.distanceMeters) ? `${driver.distanceMeters}m` : '—'}
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <RefreshCcw size={14} color={iconColor} strokeWidth={2.5} />
              <ThemedText style={styles.statText}>{driver.trips} courses</ThemedText>
            </View>
          </View>
        </View>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.lg,
    borderWidth: BorderWidth.thin,
    padding: 14,
    marginBottom: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarInitials: {
    fontWeight: '700',
    fontSize: 16,
  },
  info: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    fontSize: 17,
    flexShrink: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 18,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    opacity: 0.65,
  },
});
