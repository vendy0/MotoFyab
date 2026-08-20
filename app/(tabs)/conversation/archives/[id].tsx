import React from 'react';
import { StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import ChatView from '@/components/chat/ChatView';
import { formatDateFr } from '@/services/conversationService';
// archives/[id].tsx — remplace conversationService par :
import { useGetConversationMetaQuery, useGetConversationMessagesQuery } from '@/store/api/conversationApi';

export default function ArchivedConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = Number(id);
  const { data: meta } = useGetConversationMetaQuery(conversationId);
  const { data: messages = [] } = useGetConversationMessagesQuery(conversationId, { skip: !meta });
  // const meta = getConversationMeta(conversationId);
  // const messages = meta ? getConversationMessages(conversationId) : [];

  if (!meta) {
    return (
      <ThemedView style={styles.notFound}>
        <ThemedText>Conversation introuvable.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ChatView
      username={meta.driverUsername}
      rating={meta.driverRating}
      dateLabel={formatDateFr(meta.conversation.started_at)}
      messages={messages}
      onBack={() => router.back()}
      footerNote="Conversation terminée et archivée — lecture seule."
      // pas de onSend → ChatView masque le composer et affiche footerNote
    />
  );
}

const styles = StyleSheet.create({
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});