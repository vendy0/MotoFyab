
// _layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useThemeColor } from "@/hooks/use-theme-color";

export default function RootLayout() {
	const backgroundColor = useThemeColor({}, "background");
    const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <View style={[styles.container, { backgroundColor }]}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
