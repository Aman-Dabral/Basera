import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { loginWithEmail } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await loginWithEmail(email, password);
      // Route change handled by _layout.tsx based on auth state
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 px-6 pt-12 pb-8">
        <TouchableOpacity 
          className="mb-8 w-10 h-10 items-center justify-center -ml-2"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text className="text-3xl font-semibold mb-2">Welcome back</Text>
        <Text className="text-gray-500 text-base mb-8">Log in to continue</Text>

        <View className="gap-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">Email</Text>
            <TextInput
              className="bg-gray-100 px-4 py-4 rounded-xl text-base"
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">Password</Text>
            <View className="relative justify-center">
              <TextInput
                className="bg-gray-100 pl-4 pr-12 py-4 rounded-xl text-base"
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                className="absolute right-4 p-1"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="gray" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity className="items-end mt-1">
            <Text className="text-sm text-gray-500 font-medium">Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text className="text-red-500 mt-4 text-center">{error}</Text> : null}

        <View className="flex-1 justify-end">
          <TouchableOpacity 
            className="w-full bg-black py-4 rounded-xl flex-row justify-center items-center shadow-sm disabled:opacity-70"
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-lg">Log in</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
