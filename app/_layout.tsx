import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import {
  ArrowLeftRight,
  Clock3,
  House,
  MessagesSquare,
  Settings,
} from 'lucide-react-native';

import { HapticTab } from '@/components/haptic-tab';

export default function RootLayout() {
  return (
    <Tabs initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1e1e1e',
        tabBarInactiveTintColor: '#7b7b7b',
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="transactions"
        options={{
          tabBarIcon: ({ color, size }) => (
            <ArrowLeftRight color={color} size={size} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ color, size }) => <Clock3 color={color} size={size} strokeWidth={2.5} />,
        }}
      />
      {/* "index" est l'écran Home, actif par défaut dans le wireframe */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused, size }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              <House color="#1e1e1e" size={size} strokeWidth={2.5} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="conversation"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MessagesSquare color={color} size={size} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} strokeWidth={2.5} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 64,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  activeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffd43b',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
