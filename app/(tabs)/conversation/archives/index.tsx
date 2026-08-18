import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Search } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedTextInput } from '@/components/common/ThemedTextInput';
import ArchiveCard from '@/components/archives/ArchiveCard';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getArchivedConversations } from '@/services/conversationService';
import { ConversationSummary } from '@/types';

export default function ArchivesListScreen() {
  const [query, setQuery] = useState('');
  const textColor = useThemeColor({}, 'text');
  const tint = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const conversations = useMemo(() => getArchivedConversations(), []);

  const filtered = conversations.filter((c) =>
    c.driverUsername.toLowerCase().includes(query.trim().toLowerCase())
  );

  const handleOpen = (conversation: ConversationSummary) => {
    router.push(`/conversation/archives/${conversation.id}`);
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor}]} edges={["top", "left", "right"]}>
      <ThemedView style={styles.screen}>
        <View style={[styles.headerRow, {backgroundColor: card}]}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ArrowLeft size={22} color={textColor} strokeWidth={2.5} />
          </Pressable>
          <ThemedText type="subtitle">Archives</ThemedText>
        </View>

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
              Aucune conversation
            </ThemedText>
            <ThemedText style={[styles.emptyLink, { color: tint }]} onPress={() => router.back()}>
              Revenir →
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <ArchiveCard conversation={item} onPress={handleOpen} />}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                <View style={styles.searchWrap}>
                  <Search size={16} color={textColor} style={styles.searchIcon} />
                  <ThemedTextInput
                    style={styles.searchInput}
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Rechercher un chauffeur..."
                  />
                </View>
            }
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
      flex: 1
  },
  screen: { flex: 1, paddingHorizontal: 16 },
  headerRow: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      gap: 14, 
      marginBottom: 16, 
      borderBottomColor: "gray", 
      borderBottomWidth: 1, 
      paddingVertical: 15,
      paddingHorizontal: 15,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.18,
      shadowRadius: 4,
      elevation: 4,
  },
  searchWrap: { justifyContent: 'center', marginBottom: 16 },
  searchIcon: { position: 'absolute', left: 12, zIndex: 1, opacity: 0.6 },
  searchInput: { paddingLeft: 36 },
  list: { paddingBottom: 24 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { marginBottom: 8 },
  emptyLink: { fontSize: 14, fontWeight: '600' },
});
