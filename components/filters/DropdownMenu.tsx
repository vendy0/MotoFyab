import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

type Props = {
  label: string;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
};

export default function DropdownMenu({ label, options, selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const borderColor = useThemeColor({}, 'icon');
  const textColor = useThemeColor({}, 'text');

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
                <ThemedText>{option}</ThemedText>
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
    borderWidth: 1.5,
    borderRadius: 10,
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
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    paddingVertical: 6,
    width: 220,
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
});
