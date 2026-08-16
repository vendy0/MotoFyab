import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View, useColorScheme } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedTextInput } from '@/components/common/ThemedTextInput';
import { useThemeColor } from '@/hooks/use-theme-color';
import { HardShadow, Radii, BorderWidth } from '@/constants/theme';
import { Driver } from '@/types';

type Props = {
  visible: boolean;
  driver: Driver | null;
  onCancel: () => void;
  onConfirm: (details: { pickupLocation: string; destination: string }) => void;
};

export default function ContactModal({ visible, driver, onCancel, onConfirm }: Props) {
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');

  const colorScheme = useColorScheme() ?? 'light';
  const borderColor = useThemeColor({}, 'border');
  const borderMutedColor = useThemeColor({}, 'borderMuted');
  const tint = useThemeColor({}, 'tint');
  const hardShadow = HardShadow[colorScheme];

  // Réinitialise les champs à chaque nouvelle ouverture
  useEffect(() => {
    if (visible) {
      setPickupLocation('');
      setDestination('');
    }
  }, [visible]);

  const canConfirm = pickupLocation.trim().length > 0 && destination.trim().length > 0;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <ThemedView
          style={[styles.card, { borderColor }, hardShadow]}
          lightColor="#ffffff"
          darkColor="#16294A"
        >
          <ThemedText type="subtitle" style={styles.title}>
            Contacter
          </ThemedText>
          <ThemedText style={styles.body}>
            Voulez-vous contacter {driver ? `@${driver.username}` : 'ce chauffeur'} ? Ces
            informations lui seront envoyées.
          </ThemedText>

          <View style={styles.field}>
            <ThemedText style={styles.label}>Lieu de départ</ThemedText>
            <ThemedTextInput
              value={pickupLocation}
              onChangeText={setPickupLocation}
              placeholder="Ex. Pétion-Ville, devant le portail bleu"
            />
          </View>

          <View style={styles.field}>
            <ThemedText style={styles.label}>Destination</ThemedText>
            <ThemedTextInput
              value={destination}
              onChangeText={setDestination}
              placeholder="Ex. Delmas 33"
            />
          </View>

          <View style={styles.actions}>
            <Pressable style={[styles.secondaryBtn, { borderColor: borderMutedColor }]} onPress={onCancel}>
              <ThemedText style={styles.secondaryLabel}>Non</ThemedText>
            </Pressable>
            <Pressable
              style={[
                styles.primaryBtn,
                { backgroundColor: tint, borderColor },
                !canConfirm && styles.primaryBtnDisabled,
              ]}
              disabled={!canConfirm}
              onPress={() => onConfirm({ pickupLocation, destination })}
            >
              <ThemedText style={styles.primaryLabel}>Oui</ThemedText>
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
    backgroundColor: 'rgba(18,32,58,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 320,
    borderRadius: Radii.lg,
    borderWidth: BorderWidth.thick,
    padding: 20,
  },
  title: {
    marginBottom: 10,
  },
  body: {
    fontSize: 15,
    marginBottom: 18,
    opacity: 0.85,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    opacity: 0.8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 6,
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
    borderWidth: BorderWidth.thick,
  },
  primaryBtnDisabled: {
    opacity: 0.4,
  },
  primaryLabel: {
    color: '#fff',
    fontWeight: '700',
  },
});
