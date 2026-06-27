import { Stack } from 'expo-router';

export default function RecallLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="review" 
        options={{ 
          presentation: 'modal', 
          animation: 'slide_from_bottom' 
        }} 
      />
    </Stack>
  );
}
