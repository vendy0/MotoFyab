import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatBubble from '@/components/chat/ChatBubble';
import MessageComposer from '@/components/chat/MessageComposer';
import {
  CURRENT_CLIENT_ID,
  formatDateFr,
  getConversationMessages,
  getConversationMeta,
} from '@/services/conversationService';
import { ChatMessage } from '@/types';

export default function ActiveConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = Number(id);
  const meta = getConversationMeta(conversationId);
  const [messages, setMessages] = useState<ChatMessage[]>(() => getConversationMessages(conversationId));

  if (!meta) {
    return (
      <ThemedView style={styles.notFound}>
        <ThemedText>Conversation introuvable.</ThemedText>
      </ThemedView>
    );
  }

  const handleSend = (content: string) => {
    // TODO: envoyer le message au chauffeur (API/socket) une fois branché.
    // Pour l'instant, ajout local uniquement — non persisté dans mockData.tsx.
    const newMessage: ChatMessage = {
      id: Date.now(),
      conversationId,
      senderId: CURRENT_CLIENT_ID,
      receiverId: meta.ride.driver_id,
      content,
      sentAt: new Date().toISOString(),
      status: 'sent',
      isOwn: true,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ChatHeader
        username={meta.driverUsername}
        rating={meta.driverRating}
        dateLabel={formatDateFr(meta.conversation.started_at)}
        onArchivePress={() => router.push('/conversation/archives')}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.list}
        />
        <MessageComposer onSend={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  list: { padding: 16, flexGrow: 1, justifyContent: 'flex-end' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
