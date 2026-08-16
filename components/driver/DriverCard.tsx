import { Pressable, StyleSheet, View } from 'react-native';
import { MapPin, RefreshCcw, Star } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Driver } from '@/types';

type Props = {
  driver: Driver;
  onPress: (driver: Driver) => void;
};

export default function DriverCard({ driver, onPress }: Props) {
  return (
    <Pressable onPress={() => onPress(driver)}>
      <ThemedView style={styles.card} lightColor="#ffffff" darkColor="#1f2224">
        <View style={styles.avatar}>
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
              <Star size={16} color="#f08c00" fill="#f08c00" />
              <ThemedText style={styles.ratingText}>{driver.rating.toFixed(1)}</ThemedText>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MapPin size={16} color="#7b7b7b" strokeWidth={3} />
              <ThemedText style={styles.statText}>
                {Number.isFinite(driver.distanceMeters) ? `${driver.distanceMeters}m` : '—'}
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <RefreshCcw size={14} color="#7b7b7b" strokeWidth={3} />
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
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 14,
    marginBottom: 10,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarInitials: {
    fontWeight: '600',
    color: '#495057',
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
    color: '#f08c00',
    fontWeight: '600',
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
