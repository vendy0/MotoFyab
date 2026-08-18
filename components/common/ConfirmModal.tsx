import { Modal, Pressable, StyleSheet, View, useColorScheme } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { CardShadow, Radii, BorderWidth } from '@/constants/theme';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  /** Utilise `danger` au lieu de `tint` pour le bouton de confirmation. */
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  destructive,
  onConfirm,
  onCancel,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const cardColor = useThemeColor({}, 'card');
  const borderMutedColor = useThemeColor({}, 'borderMuted');
  const tint = useThemeColor({}, 'tint');
  const danger = useThemeColor({}, 'danger');
  const cardShadow = CardShadow[colorScheme];

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <ThemedView style={[styles.card, { backgroundColor: cardColor }, cardShadow]}>
          <ThemedText type="subtitle" style={styles.title}>
            {title}
          </ThemedText>
          <ThemedText style={styles.body}>{message}</ThemedText>
          <View style={styles.actions}>
            <Pressable style={[styles.secondaryBtn, { borderColor: borderMutedColor }]} onPress={onCancel}>
              <ThemedText style={styles.secondaryLabel}>{cancelLabel}</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.primaryBtn, { backgroundColor: destructive ? danger : tint }]}
              onPress={onConfirm}
            >
              <ThemedText style={styles.primaryLabel}>{confirmLabel}</ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 300,
    borderRadius: Radii.lg,
    padding: 20,
  },
  title: {
    marginBottom: 10,
  },
  body: {
    fontSize: 15,
    marginBottom: 18,
    opacity: 0.8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  secondaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: Radii.sm,
    borderWidth: BorderWidth.thin,
  },
  secondaryLabel: {
    fontWeight: '600',
  },
  primaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: Radii.sm,
  },
  primaryLabel: {
    color: '#fff',
    fontWeight: '700',
  },
});
