import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Skeleton } from '../../components/ui/Skeleton';
import { useRouter } from 'expo-router';
import { useSessionStore } from '@/store/useSessionStore';
import { Ionicons } from '@expo/vector-icons';
import citiesData from '@/constants/cities.json';

export default function CreateSessionScreen() {
  const router = useRouter();
  const { createSession } = useSessionStore();
  
  const [step, setStep] = useState(1);
  const [cityFrom, setCityFrom] = useState('');
  const [cityTo, setCityTo] = useState('');
  
  // Step 2 state
  const [languages, setLanguages] = useState('');
  const [pullReason, setPullReason] = useState('');
  
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step === 1 && cityFrom && cityTo) {
      setStep(2);
    }
  };

  const handleCreate = async () => {
    if (!languages || !pullReason) return;
    
    setLoading(true);
    await createSession({
      cityFrom,
      cityTo,
      languages: languages.split(',').map(l => l.trim()),
      pullReason,
    });
    setLoading(false);
    
    // The layout component handles the routing based on sessions.length automatically
    // but we can also explicitly push if needed.
    router.replace('/(tabs)');
  };

  const renderCityList = (selectedCity: string, setCity: (c: string) => void) => (
    <View className="flex-row flex-wrap gap-2 mt-4">
      {citiesData.map((city) => (
        <TouchableOpacity
          key={city.id}
          onPress={() => setCity(city.name)}
          className={`px-4 py-2 rounded-full border ${selectedCity === city.name ? 'border-black bg-black' : 'border-gray-300 bg-white'}`}
        >
          <Text className={`${selectedCity === city.name ? 'text-white font-medium' : 'text-gray-700'}`}>
            {city.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-white" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="flex-1 px-6 pt-12 pb-8" contentContainerStyle={{ paddingBottom: 40 }}>
        {step > 1 && (
          <TouchableOpacity 
            className="mb-6 w-10 h-10 justify-center -ml-2"
            onPress={() => setStep(step - 1)}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        )}

        <Text className="text-3xl font-semibold mb-2">
          {step === 1 ? 'Where are you moving?' : 'Customize your journey'}
        </Text>
        <Text className="text-gray-500 text-base mb-8">
          {step === 1 ? 'Select your current city and your destination.' : 'Help us personalize your local experience.'}
        </Text>

        {step === 1 && (
          <View className="gap-8">
            <View>
              <Text className="text-lg font-semibold text-gray-800">Moving From</Text>
              {renderCityList(cityFrom, setCityFrom)}
            </View>

            <View>
              <Text className="text-lg font-semibold text-gray-800">Moving To</Text>
              {renderCityList(cityTo, setCityTo)}
            </View>

            <TouchableOpacity 
              className={`w-full py-4 rounded-xl flex-row justify-center items-center shadow-sm mt-8 ${(!cityFrom || !cityTo) ? 'bg-gray-300' : 'bg-black'}`}
              onPress={handleNext}
              disabled={!cityFrom || !cityTo}
            >
              <Text className="text-white font-semibold text-lg mr-2">Next</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View className="gap-6">
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-2">What language(s) do you already speak?</Text>
              <TextInput
                className="bg-gray-100 px-4 py-4 rounded-xl text-base"
                placeholder="e.g. English, Hindi"
                value={languages}
                onChangeText={setLanguages}
              />
            </View>

            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-2">What's pulling you to {cityTo}?</Text>
              <View className="flex-row flex-wrap gap-2">
                {['Job', 'College', 'Family', 'Other'].map((reason) => (
                  <TouchableOpacity
                    key={reason}
                    onPress={() => setPullReason(reason)}
                    className={`px-6 py-3 rounded-xl border ${pullReason === reason ? 'border-black bg-black' : 'border-gray-300 bg-white'}`}
                  >
                    <Text className={`${pullReason === reason ? 'text-white font-medium' : 'text-gray-700'}`}>
                      {reason}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              className={`w-full py-4 rounded-xl flex-row justify-center items-center shadow-sm mt-8 ${(!languages || !pullReason || loading) ? 'bg-gray-300' : 'bg-black'}`}
              onPress={handleCreate}
              disabled={!languages || !pullReason || loading}
            >
              {loading ? (
              <Skeleton width={24} height={24} borderRadius={12} style={{ backgroundColor: 'rgba(255,255,255,0.5)' }} />
              ) : (
                <>
                  <Text className="text-white font-semibold text-lg mr-2">Create session</Text>
                  <Ionicons name="checkmark" size={20} color="white" />
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
