import React from 'react';
import { View, useWindowDimensions, TouchableOpacity, Text } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const TAB_ITEMS = [
    { name: 'index', title: 'Home', icon: 'house' },
    { name: 'explore', title: 'Explore', icon: 'map' },
    { name: 'learn', title: 'Learn', icon: 'book' },
    { name: 'recall', title: 'Recall', icon: 'brain' },
    { name: 'buddy', title: 'Buddy', icon: 'bubble.left.and.bubble.right' },
    { name: 'profile', title: 'Profile', icon: 'person' },
  ];

  if (isTablet) {
    // Custom Side Rail layout for Tablets
    return (
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#FAF3E8' }}>
        <View 
          style={{ 
            width: 250, 
            paddingTop: insets.top + 40,
            paddingBottom: insets.bottom + 20,
            paddingHorizontal: 20,
            borderRightWidth: 1,
            borderRightColor: '#E5E7EB',
            backgroundColor: '#FAF3E8'
          }}
        >
          <Text className="text-3xl font-heading text-primary mb-10 ml-2">Basera</Text>
          {TAB_ITEMS.map(item => {
            // Very naive active check; actual route matching requires more precision with expo-router
            const isActive = pathname === `/${item.name === 'index' ? '' : item.name}`;
            return (
              <TouchableOpacity
                key={item.name}
                onPress={() => router.push(`/(tabs)/${item.name}` as any)}
                className={`flex-row items-center mb-4 px-4 py-3 rounded-2xl ${isActive ? 'bg-primary/10' : 'bg-transparent'}`}
                accessibilityRole="button"
                accessibilityLabel={item.title}
              >
                <SymbolView 
                  name={item.icon as any} 
                  tintColor={isActive ? '#C85322' : '#6B7280'} 
                  size={24} 
                />
                <Text 
                  className={`ml-4 text-lg font-medium ${isActive ? 'text-primary' : 'text-gray-500'}`}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
        <View style={{ flex: 1 }}>
          <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
             {TAB_ITEMS.map(item => (
               <Tabs.Screen key={item.name} name={item.name} />
             ))}
          </Tabs>
        </View>
      </View>
    );
  }

  // Standard Bottom Tabs for Mobile
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#C85322', // Updated primary color
        tabBarInactiveTintColor: '#2B2521',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FAF3E8',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}>
      {TAB_ITEMS.map(item => (
        <Tabs.Screen
          key={item.name}
          name={item.name}
          options={{
            title: item.title,
            tabBarIcon: ({ color }) => (
              <SymbolView name={item.icon as any} tintColor={color} size={24} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
