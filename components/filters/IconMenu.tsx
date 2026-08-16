import { ReactNode, useState } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

type Props = {
  icon: ReactNode;
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
};

export default function IconMenu({ icon, options, selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const borderColor = useThemeColor({}, 'icon');

  return (
    <>
      <Pressable style={[styles.trigger, { borderColor }]} onPress={() => setOpen(true)}>
        {icon}
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <ThemedView style={styles.menu} lightColor="#ffffff" darkColor="#1f2224">
            {options.map((option) => (
              <Pressable
                key={option}
                style={[styles.option, option === selected && styles.optionActive]}
                onPress={() => {
                  onSelect(option);
                  setOpen(false);
                }}
              >
                <ThemedText style={styles.optionText}>{option}</ThemedText>
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
    borderRadius: 10,
    borderWidth: 1.5,
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
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    paddingVertical: 6,
    width: 250,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionActive: {
    backgroundColor: 'rgba(10,126,164,0.12)',
  },
  optionText: {
    fontSize: 14,
  },
});
