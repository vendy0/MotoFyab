import { Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import { Star } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { CardShadow, Radii, BorderWidth } from '@/constants/theme';
import { ConversationSummary } from '@/types';
import { formatDateFr } from '@/services/conversationService';

type Props = {
  conversation: ConversationSummary;
  onPress: (conversation: ConversationSummary) => void;
};

const STATUS_LABEL: Record<string, string> = {
  completed: 'Terminée',
  cancelled: 'Annulée',
};

export default function ArchiveCard({ conversation, onPress }: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'borderMuted');
  const goldColor = useThemeColor({}, 'gold');
  const tint = useThemeColor({}, 'tint');
  const successColor = useThemeColor({}, 'success');
  const dangerColor = useThemeColor({}, 'danger');
  const cardShadow = CardShadow[colorScheme];

  const initials = conversation.driverUsername
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isCancelled = conversation.rideStatus === 'cancelled';
  const statusColor = isCancelled ? dangerColor : successColor;
  const statusLabel = STATUS_LABEL[conversation.rideStatus] ?? conversation.rideStatus;

  return (
    <Pressable onPress={() => onPress(conversation)}>
      <ThemedView style={[styles.card, { backgroundColor: cardColor, borderColor }, cardShadow]}>
        <View style={[styles.avatar, { backgroundColor: `${tint}26` }]}>
          <ThemedText style={[styles.avatarInitials, { color: tint }]}>{initials}</ThemedText>
        </View>

        <View style={styles.info}>
          <View style={styles.topRow}>
            <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.username}>
              {conversation.driverUsername}
            </ThemedText>
            <View style={styles.ratingRow}>
              <Star size={14} color={goldColor} fill={goldColor} />
              <ThemedText style={[styles.ratingText, { color: goldColor }]}>
                {conversation.driverRating.toFixed(1)}
              </ThemedText>
            </View>
          </View>

          <ThemedText style={styles.route} numberOfLines={1}>
            {conversation.route}
          </ThemedText>

          <View style={styles.bottomRow}>
            <ThemedText style={styles.date}>{formatDateFr(conversation.date)}</ThemedText>
            <View style={[styles.statusPill, { backgroundColor: `${statusColor}1F` }]}>
              <ThemedText style={[styles.statusText, { color: statusColor }]}>{statusLabel}</ThemedText>
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
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarInitials: {
    fontWeight: '700',
    fontSize: 14,
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
    fontSize: 15,
    flexShrink: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontWeight: '700',
    fontSize: 13,
  },
  route: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 3,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  date: {
    fontSize: 12,
    opacity: 0.55,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
