import { ReactNode, useState } from 'react';
import { Modal, Pressable, StyleSheet, useColorScheme } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { CardShadow, Radii, BorderWidth } from '@/constants/theme';

type Props = {
  icon: ReactNode;
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
};

export default function IconMenu({ icon, options, selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'borderMuted');
  const tint = useThemeColor({}, 'tint');
  const cardShadow = CardShadow[colorScheme];

  return (
    <>
      <Pressable style={[styles.trigger, { borderColor }]} onPress={() => setOpen(true)}>
        {icon}
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
                <ThemedText
                  style={[styles.optionText, option === selected && { color: tint, fontWeight: '700' }]}
                >
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
    width: 46,
    height: 46,
    borderRadius: Radii.sm,
    borderWidth: BorderWidth.thin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  menu: {
    position: 'absolute',
    top: 150,
    right: 16,
    borderRadius: Radii.sm,
    paddingVertical: 6,
    width: 250,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 14,
  },
});
