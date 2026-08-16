import { Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import { MapPin, RefreshCcw, Star } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { HardShadow, Radii, BorderWidth } from '@/constants/theme';
import { Driver } from '@/types';

type Props = {
  driver: Driver;
  onPress: (driver: Driver) => void;
};

export default function DriverCard({ driver, onPress }: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');
  const starColor = useThemeColor({}, 'star');
  const tint = useThemeColor({}, 'tint');
  const hardShadow = HardShadow[colorScheme];

  return (
    <Pressable onPress={() => onPress(driver)}>
      <ThemedView
        style={[styles.card, { borderColor }, hardShadow]}
        lightColor="#FFFFFF"
        darkColor="#16294A"
      >
        <View style={[styles.avatar, { backgroundColor: tint }]}>
          <ThemedText style={styles.avatarInitials}>
            {driver.username.slice(0, 2).toUpperCase()}
          </ThemedText>
        </View>

        <View style={styles.info}>
          <View style={styles.topRow}>
            <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.username}>
              {driver.username}
            </ThemedText>
            <View style={styles.ratingRow}>
              <Star size={16} color={starColor} fill={starColor} />
              <ThemedText style={[styles.ratingText, { color: starColor }]}>
                {driver.rating.toFixed(1)}
              </ThemedText>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MapPin size={16} color={iconColor} strokeWidth={3} />
              <ThemedText style={styles.statText}>
                {Number.isFinite(driver.distanceMeters) ? `${driver.distanceMeters}m` : '—'}
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <RefreshCcw size={14} color={iconColor} strokeWidth={3} />
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
    borderWidth: BorderWidth.thick,
    padding: 14,
    marginBottom: 12,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarInitials: {
    fontWeight: '700',
    color: '#FFFFFF',
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
    fontSize: 18,
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
    opacity: 0.7,
  },
});
