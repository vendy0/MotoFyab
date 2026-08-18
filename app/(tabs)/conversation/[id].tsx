
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, useColorScheme, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from "@/hooks/use-theme-color";
import ChatHeader from '@/components/chat/ChatHeader';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatBackgroundPattern from '@/components/chat/ChatBackgroundPattern';
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
  const listRef = useRef<FlatList>(null);
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, "background");
  const patternColor = useThemeColor({}, 'borderMuted'); // ou une couleur dédiée dans theme.ts
  
  // Inverted : on affiche du plus récent au plus ancien, donc on reverse les données.
  // Le plus récent (index 0) se retrouve visuellement en bas.
  const invertedMessages = useMemo(() => [...messages].reverse(), [messages]);

  // TODO: calculer l'index du dernier message lu et scroller dessus au montage.
  // Pour l'instant, pass — on laisse la liste s'ouvrir à sa position par défaut (le plus récent).
  const scrollToLastReadMessage = useCallback(() => {
    // pass
  }, []);

  useEffect(() => {
    scrollToLastReadMessage();
  }, [scrollToLastReadMessage]);

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
    // On ajoute à la fin du tableau "normal" (chronologique) — le reverse au-dessus
    // se charge de le remettre en position 0 pour l'affichage inverted.
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor}]} edges={['top', "left", "right"]}>
      <ChatHeader
        username={meta.driverUsername}
        rating={meta.driverRating}
        onBack={()=>router.replace("/(tabs)/")}
        dateLabel={formatDateFr(meta.conversation.started_at)}
        onArchivePress={() => router.push('/conversation/archives')}
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
      <MessageComposer onSend={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chatArea: { flex: 1, position: 'relative' },
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  list: { padding: 16},
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
