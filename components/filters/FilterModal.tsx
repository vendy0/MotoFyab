import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View, useColorScheme } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedTextInput } from '@/components/common/ThemedTextInput';
import { useThemeColor } from '@/hooks/use-theme-color';
import { HardShadow, Radii, BorderWidth } from '@/constants/theme';
import { Comparator, DriverFilters, NumericFilter } from '@/types';

type Props = {
  visible: boolean;
  initialFilters: DriverFilters;
  onClose: () => void;
  onApply: (filters: DriverFilters) => void;
};

type FieldState = {
  comparator: Comparator;
  value: string; // texte brut de l'input, converti au moment d'appliquer
};

const EMPTY_FIELD: FieldState = { comparator: '>', value: '' };

function toFieldState(filter?: NumericFilter): FieldState {
  if (!filter) return { ...EMPTY_FIELD };
  return { comparator: filter.comparator, value: String(filter.value) };
}

function toNumericFilter(field: FieldState): NumericFilter | undefined {
  const parsed = Number(field.value.replace(',', '.'));
  if (field.value.trim() === '' || Number.isNaN(parsed)) return undefined;
  return { comparator: field.comparator, value: parsed };
}

function ComparatorToggle({
  value,
  onChange,
}: {
  value: Comparator;
  onChange: (comparator: Comparator) => void;
}) {
  const borderColor = useThemeColor({}, 'border');
  const tint = useThemeColor({}, 'tint');

  return (
    <View style={[styles.toggleGroup, { borderColor }]}>
      {(['>', '<'] as Comparator[]).map((option) => (
        <Pressable
          key={option}
          style={[styles.toggleOption, value === option && { backgroundColor: tint }]}
          onPress={() => onChange(option)}
        >
          <ThemedText
            style={[styles.toggleText, value === option && styles.toggleTextActive]}
          >
            {option}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

function FilterRow({
  label,
  suffix,
  field,
  onChange,
}: {
  label: string;
  suffix: string;
  field: FieldState;
  onChange: (field: FieldState) => void;
}) {
  return (
    <View style={styles.row}>
      <ThemedText style={styles.rowLabel}>{label}</ThemedText>
      <View style={styles.rowControls}>
        <ComparatorToggle
          value={field.comparator}
          onChange={(comparator) => onChange({ ...field, comparator })}
        />
        <ThemedTextInput
          style={styles.rowInput}
          keyboardType="numeric"
          value={field.value}
          onChangeText={(value) => onChange({ ...field, value })}
          placeholder="0"
        />
        <ThemedText style={styles.suffix}>{suffix}</ThemedText>
      </View>
    </View>
  );
}

export default function FilterModal({ visible, initialFilters, onClose, onApply }: Props) {
  const [rating, setRating] = useState<FieldState>(EMPTY_FIELD);
  const [trips, setTrips] = useState<FieldState>(EMPTY_FIELD);
  const [distance, setDistance] = useState<FieldState>(EMPTY_FIELD);

  const colorScheme = useColorScheme() ?? 'light';
  const borderColor = useThemeColor({}, 'border');
  const borderMutedColor = useThemeColor({}, 'borderMuted');
  const tint = useThemeColor({}, 'tint');
  const hardShadow = HardShadow[colorScheme];

  // Recharge les champs avec les filtres actifs à chaque ouverture
  useEffect(() => {
    if (visible) {
      setRating(toFieldState(initialFilters.rating));
      setTrips(toFieldState(initialFilters.trips));
      setDistance(toFieldState(initialFilters.distanceMeters));
    }
  }, [visible, initialFilters]);

  const handleReset = () => {
    setRating({ ...EMPTY_FIELD });
    setTrips({ ...EMPTY_FIELD });
    setDistance({ ...EMPTY_FIELD });
  };

  const handleApply = () => {
    onApply({
      rating: toNumericFilter(rating),
      trips: toNumericFilter(trips),
      distanceMeters: toNumericFilter(distance),
    });
    onClose();
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <ThemedView
          style={[styles.card, { borderColor }, hardShadow]}
          lightColor="#ffffff"
          darkColor="#16294A"
        >
          <ThemedText type="subtitle" style={styles.title}>
            Filtrer les chauffeurs
          </ThemedText>

          <FilterRow label="Note" suffix="☆" field={rating} onChange={setRating} />
          <FilterRow label="Courses" suffix="courses" field={trips} onChange={setTrips} />
          <FilterRow label="Distance" suffix="m" field={distance} onChange={setDistance} />

          <View style={styles.actions}>
            <Pressable style={[styles.secondaryBtn, { borderColor: borderMutedColor }]} onPress={handleReset}>
              <ThemedText style={styles.secondaryLabel}>Réinitialiser</ThemedText>
            </Pressable>
            <Pressable style={[styles.primaryBtn, { backgroundColor: tint, borderColor }]} onPress={handleApply}>
              <ThemedText style={styles.primaryLabel}>Appliquer</ThemedText>
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
    marginBottom: 16,
  },
  row: {
    marginBottom: 14,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    opacity: 0.8,
  },
  rowControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleGroup: {
    flexDirection: 'row',
    borderWidth: BorderWidth.thick,
    borderRadius: Radii.sm,
    overflow: 'hidden',
  },
  toggleOption: {
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  toggleText: {
    fontWeight: '700',
  },
  toggleTextActive: {
    color: '#fff',
  },
  rowInput: {
    flex: 1,
    paddingVertical: 9,
  },
  suffix: {
    fontSize: 13,
    opacity: 0.7,
    width: 56,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
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
  primaryLabel: {
    color: '#fff',
    fontWeight: '700',
  },
});
