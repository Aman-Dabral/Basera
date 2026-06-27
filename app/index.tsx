import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';

WebBrowser.maybeCompleteAuthSession();

export default function WelcomeScreen() {
  const router = useRouter();
  const { loginWithGoogle } = useAuthStore();

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'placeholder',
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || 'placeholder',
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || 'placeholder',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      // In a real app we'd fetch user info using the token or send it to backend
      loginWithGoogle({
        id: 'google-uid',
        email: 'user@gmail.com',
        name: 'Google User'
      });
    }
  }, [response]);

  return (
    <View className="flex-1 bg-white items-center justify-center p-6">
      <View className="flex-1 items-center justify-center w-full">
        {/* We use a View with styled background if images don't exist yet, but let's try requiring them */}
        <Image 
          source={require('@/assets/illustrations/onboarding-howitworks.png')} 
          className="w-72 h-72 mb-8"
          resizeMode="contain"
          // We can use a default source to avoid crash if asset is missing, but expo might throw on require.
        />
        <Image 
          source={require('@/assets/brand/logo.png')} 
          className="w-48 h-16 mb-4"
          resizeMode="contain"
        />
        <Text className="text-xl font-medium text-gray-500 text-center mb-12">
          Your local friend for your City
        </Text>
      </View>

      <View className="w-full gap-4 pb-12">
        <TouchableOpacity 
          className="w-full bg-black py-4 rounded-xl flex-row justify-center items-center shadow-sm"
          onPress={() => promptAsync()}
          disabled={!request}
        >
          <Text className="text-white font-semibold text-lg">Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="w-full bg-gray-100 py-4 rounded-xl flex-row justify-center items-center"
          onPress={() => router.push('/(auth)/signup')}
        >
          <Text className="text-black font-semibold text-lg">Sign up with email</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="w-full py-4 flex-row justify-center items-center"
          onPress={() => router.push('/(auth)/login')}
        >
          <Text className="text-gray-500 font-medium text-base">
            Already have an account? <Text className="text-black font-semibold">Log in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
