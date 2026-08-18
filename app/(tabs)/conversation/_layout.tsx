import { Stack } from 'expo-router';

// `conversation` devient un stack pour porter 4 écrans :
// index (état de la course active), [id] (chat actif), archives/index
// (liste), archives/[id] (détail archivé, lecture seule).
export default function ConversationStackLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
