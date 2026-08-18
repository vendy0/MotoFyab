import { StyleSheet, View } from 'react-native';
import { Check, CheckCheck } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radii } from '@/constants/theme';
import { ChatMessage } from '@/types';
import { formatTime } from '@/services/conversationService';

type Props = {
  message: ChatMessage;
};

export default function ChatBubble({ message }: Props) {
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'borderMuted');
  const tint2 = useThemeColor({}, 'tint2');
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'icon');

  const isOwn = message.isOwn;
  // Les accusés de réception ne s'affichent que sur mes propres messages,
  // comme sur WhatsApp — un message reçu n'a pas de statut "lu par moi" à montrer.
  const TickIcon = message.status === 'sent' ? Check : CheckCheck;
  const tickOpacity = message.status === 'read' ? 1 : 0.55;

  return (
    <View style={[styles.row, isOwn ? styles.rowOwn : styles.rowOther]}>
      <View
        style={[
          styles.bubble,
          isOwn
            ? [styles.bubbleOwn, { backgroundColor: tint2 }]
            : [styles.bubbleOther, { backgroundColor: cardColor, borderColor }],
        ]}
      >
        <ThemedText style={isOwn ? styles.textOwn : { color: textColor }}>{message.content}</ThemedText>
        <View style={styles.meta}>
          <ThemedText style={[styles.time, isOwn ? styles.timeOwn : { color: mutedColor }]}>
            {formatTime(message.sentAt)}
          </ThemedText>
          {isOwn && (
            <TickIcon size={14} color="#FFFFFF" style={[styles.tick, { opacity: tickOpacity }]} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  rowOwn: {
    justifyContent: 'flex-end',
  },
  rowOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: Radii.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleOwn: {
    borderBottomRightRadius: 3,
  },
  bubbleOther: {
    borderBottomLeftRadius: 3,
    borderWidth: 1,
  },
  textOwn: {
    color: '#FFFFFF',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  time: {
    fontSize: 11,
  },
  timeOwn: {
    color: 'rgba(255,255,255,0.75)',
  },
  tick: {
    marginLeft: 2,
  },
});
