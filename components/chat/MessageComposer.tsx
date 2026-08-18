import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Send } from 'lucide-react-native';
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
    <View style={styles.wrap}>
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
    </View>
  );
}

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 5,
        gap: 5,
        paddingBottom: 10
    },
  input: {
    flex: 1,
    maxHeight: 100,
    height: "2em",
    borderRadius: 25
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
});
