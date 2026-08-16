import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedTextInput } from '@/components/common/ThemedTextInput';
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
        <ThemedView style={styles.card} lightColor="#ffffff" darkColor="#1f2224">
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
            <Pressable style={styles.secondaryBtn} onPress={onCancel}>
              <ThemedText style={styles.secondaryLabel}>Non</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.primaryBtn, !canConfirm && styles.primaryBtnDisabled]}
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 320,
    borderRadius: 14,
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  secondaryLabel: {
    fontWeight: '600',
  },
  primaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#1e1e1e',
  },
  primaryBtnDisabled: {
    opacity: 0.4,
  },
  primaryLabel: {
    color: '#fff',
    fontWeight: '600',
  },
});
