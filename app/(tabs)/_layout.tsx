import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#E2703A',
        tabBarInactiveTintColor: '#2B2521',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FAF3E8',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <SymbolView name="house" tintColor={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <SymbolView name="map" tintColor={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color }) => (
            <SymbolView name="book" tintColor={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="recall"
        options={{
          title: 'Recall',
          tabBarIcon: ({ color }) => (
            <SymbolView name="brain" tintColor={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="buddy"
        options={{
          title: 'Buddy',
          tabBarIcon: ({ color }) => (
            <SymbolView name="bubble.left.and.bubble.right" tintColor={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <SymbolView name="person" tintColor={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
