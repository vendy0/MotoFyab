import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Send } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedTextInput } from '@/components/common/ThemedTextInput';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radii, BorderWidth } from '@/constants/theme';

type Props = {
  onSend: (content: string) => void;
};

export default function MessageComposer({ onSend }: Props) {
  const [text, setText] = useState('');
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'borderMuted');
  const tint = useThemeColor({}, 'tint');

  const canSend = text.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <SafeAreaView edges={['bottom']} style={[styles.wrap, { backgroundColor: cardColor, borderColor }]}>
      <ThemedTextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Écrire un message..."
        multiline
      />
      <Pressable
        style={[styles.sendButton, { backgroundColor: tint }, !canSend && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={!canSend}
      >
        <Send size={18} color="#FFFFFF" strokeWidth={2.5} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 8,
    borderTopWidth: BorderWidth.thin,
  },
  input: {
    flex: 1,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: Radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});
