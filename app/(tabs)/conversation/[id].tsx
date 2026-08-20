// import React, { useState } from 'react';
// import { StyleSheet } from 'react-native';
// import { router, useLocalSearchParams } from 'expo-router';
// import { ThemedView } from '@/components/themed-view';
// import { ThemedText } from '@/components/themed-text';
// import ChatView from '@/components/chat/ChatView';
// import {
//   CURRENT_CLIENT_ID,
//   formatDateFr,
//   getConversationMessages,
//   getConversationMeta,
// } from '@/services/conversationService';
// import { ChatMessage } from '@/types';

// export default function ActiveConversationScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const conversationId = Number(id);
//   const meta = getConversationMeta(conversationId);
//   const [messages, setMessages] = useState<ChatMessage[]>(() => getConversationMessages(conversationId));

//   if (!meta) {
//     return (
//       <ThemedView style={styles.notFound}>
//         <ThemedText>Conversation introuvable.</ThemedText>
//       </ThemedView>
//     );
//   }

//   const handleSend = (content: string) => {
//     // TODO: envoyer le message au chauffeur (API/socket) une fois branché.
//     const newMessage: ChatMessage = {
//       id: Date.now(),
//       conversationId,
//       senderId: CURRENT_CLIENT_ID,
//       receiverId: meta.ride.driver_id,
//       content,
//       sentAt: new Date().toISOString(),
//       status: 'sent',
//       isOwn: true,
//     };
//     setMessages((prev) => [...prev, newMessage]);
//   };

//   return (
//     <ChatView
//       username={meta.driverUsername}
//       rating={meta.driverRating}
//       dateLabel={formatDateFr(meta.conversation.started_at)}
//       messages={messages}
//       onBack={() => router.replace('/(tabs)/')}
//       onArchivePress={() => router.push('/conversation/archives')}
//       onSend={handleSend}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
// });

import React from 'react';
import { StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import ChatView from '@/components/chat/ChatView';
import { formatDateFr } from '@/services/conversationService';
import {
  useGetConversationMetaQuery,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
} from '@/store/api/conversationApi';

export default function ActiveConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = Number(id);

  // Caché par conversationId — revenir sur ce chat ne recalcule rien.
  const { data: meta, isFetching: metaLoading } = useGetConversationMetaQuery(conversationId);
  const { data: messages = [] } = useGetConversationMessagesQuery(conversationId);
  const [sendMessage] = useSendMessageMutation();

  if (metaLoading && !meta) return null; // TODO: loader
  if (!meta) {
    return (
      <ThemedView style={styles.notFound}>
        <ThemedText>Conversation introuvable.</ThemedText>
      </ThemedView>
    );
  }

  const handleSend = (content: string) => {
    // Met à jour le cache RTK Query de getConversationMessages
    // (voir store/api/conversationApi.ts -> sendMessage).
    sendMessage({ conversationId, content, ride: meta.ride });
  };

  return (
    <ChatView
      username={meta.driverUsername}
      rating={meta.driverRating}
      dateLabel={formatDateFr(meta.conversation.started_at)}
      messages={messages}
      onBack={() => router.replace('/(tabs)/')}
      onArchivePress={() => router.push('/conversation/archives')}
      onSend={handleSend}
    />
  );
}

const styles = StyleSheet.create({
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});