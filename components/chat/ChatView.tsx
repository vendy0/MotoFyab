import React, { useMemo, useRef } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/use-theme-color';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatBackgroundPattern from '@/components/chat/ChatBackgroundPattern';
import MessageComposer from '@/components/chat/MessageComposer';
import { ThemedText } from '@/components/themed-text';
import { ChatMessage } from '@/types';

type ChatViewProps = {
  /** Nom du chauffeur affiché dans le header. */
  username: string;
  rating: number;
  dateLabel: string;
  messages: ChatMessage[];
  onBack: () => void;
  onArchivePress?: () => void;
  /**
   * Callback d'envoi. Si omis, la vue passe en lecture seule
   * (pas de composer affiché) — utilisé pour les conversations archivées.
   */
  onSend?: (content: string) => void;
  /** ID du dernier message lu, pour un futur scroll ciblé au montage. */
  lastReadMessageId?: number;
  /** Petite mention affichée sous la liste (ex: "Conversation archivée — lecture seule"). */
  footerNote?: string;
};

export default function ChatView({
  username,
  rating,
  dateLabel,
  messages,
  onBack,
  onArchivePress,
  onSend,
  lastReadMessageId,
  footerNote,
}: ChatViewProps) {
  const listRef = useRef<FlatList>(null);
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const patternColor = useThemeColor({}, 'borderMuted');

  // Inverted : le plus récent (index 0) se retrouve visuellement en bas.
  const invertedMessages = useMemo(() => [...messages].reverse(), [messages]);

  const isReadOnly = !onSend;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={onSend ? ['top', 'left', 'right'] : ['top', 'left', 'right', 'bottom']}>
      <ChatHeader
        username={username}
        rating={rating}
        dateLabel={dateLabel}
        onBack={onBack}
        onArchivePress={onArchivePress}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.chatArea}>
          <ChatBackgroundPattern color={patternColor} opacity={colorScheme === 'dark' ? 0.5 : 0.75} />
          <FlatList
            ref={listRef}
            data={invertedMessages}
            inverted
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <ChatBubble message={item} />}
            contentContainerStyle={styles.list}
          />
        </View>
        {isReadOnly && footerNote && <ThemedText style={styles.footerNote}>{footerNote}</ThemedText>}
        {!isReadOnly && <MessageComposer onSend={onSend} />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chatArea: { flex: 1, position: 'relative' },
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  list: { padding: 16 },
  footerNote: { textAlign: 'center', fontSize: 12, opacity: 0.5, paddingVertical: 10 },
});
