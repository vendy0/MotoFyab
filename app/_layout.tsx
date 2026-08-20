
// _layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux'; // ← ajout
import { store } from '@/store'; // ← ajout
import { useThemeColor } from "@/hooks/use-theme-color";

export default function RootLayout() {
	const backgroundColor = useThemeColor({}, "background");
    const colorScheme = useColorScheme();

  return (
	<Provider store={store}>
    	<SafeAreaProvider>
          <View style={[styles.container, { backgroundColor }]}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </View>
        </SafeAreaProvider>
	</Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
