import { FlatList, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatBubble from '@/components/chat/ChatBubble';
import { formatDateFr, getConversationMessages, getConversationMeta } from '@/services/conversationService';

export default function ArchivedConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = Number(id);
  const meta = getConversationMeta(conversationId);
  const messages = meta ? getConversationMessages(conversationId) : [];

  if (!meta) {
    return (
      <ThemedView style={styles.notFound}>
        <ThemedText>Conversation introuvable.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', "right"]}>
      <ChatHeader
        username={meta.driverUsername}
        rating={meta.driverRating}
        dateLabel={formatDateFr(meta.conversation.started_at)}
        onBack={() => router.back()}
      />
      <FlatList
        data={messages}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.list}
      />
      <ThemedText style={styles.archivedNote}>Conversation archivée — lecture seule.</ThemedText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  list: { padding: 16, flexGrow: 1, justifyContent: 'flex-end' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  archivedNote: { textAlign: 'center', fontSize: 12, opacity: 0.5, paddingVertical: 10 },
});
