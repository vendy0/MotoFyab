import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { CardShadow, Radii, BorderWidth } from '@/constants/theme';

type Props = {
  label: string;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
};

export default function DropdownMenu({ label, options, selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'borderMuted');
  const textColor = useThemeColor({}, 'text');
  const tint = useThemeColor({}, 'tint');
  const cardShadow = CardShadow[colorScheme];

  return (
    <>
      <Pressable style={[styles.trigger, { borderColor }]} onPress={() => setOpen(true)}>
        <ThemedText numberOfLines={1} style={styles.triggerText}>
          {selected || label}
        </ThemedText>
        <ChevronDown size={18} color={textColor} />
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <ThemedView style={[styles.menu, { backgroundColor: cardColor }, cardShadow]}>
            {options.map((option) => (
              <Pressable
                key={option}
                style={[styles.option, option === selected && { backgroundColor: `${tint}1F` }]}
                onPress={() => {
                  onSelect(option);
                  setOpen(false);
                }}
              >
                <ThemedText style={option === selected ? { color: tint, fontWeight: '700' } : undefined}>
                  {option}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: BorderWidth.thin,
    borderRadius: Radii.sm,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flex: 1,
  },
  triggerText: {
    fontSize: 15,
    marginRight: 6,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  menu: {
    position: 'absolute',
    top: 150,
    left: 16,
    borderRadius: Radii.sm,
    paddingVertical: 6,
    width: 220,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
