import { View, Text } from 'react-native';

interface PlaceholderIllustrationProps {
  type: 'no-sessions' | 'empty-chat' | 'empty-deck';
  message?: string;
}

export function PlaceholderIllustration({ type, message }: PlaceholderIllustrationProps) {
  const getIllustrationText = () => {
    switch (type) {
      case 'no-sessions':
        return 'No Active Sessions';
      case 'empty-chat':
        return 'Start a conversation';
      case 'empty-deck':
        return 'No flashcards yet';
      default:
        return 'Nothing here';
    }
  };

  return (
    <View className="items-center justify-center p-8 bg-background rounded-3xl m-4 border-2 border-primary/20">
      <View className="w-32 h-32 bg-secondary/10 rounded-full items-center justify-center mb-6">
        <Text className="text-secondary text-opacity-50 font-body text-center px-4">
          [Illustration: {type}]
        </Text>
      </View>
      <Text className="text-xl font-heading text-text mb-2 text-center">
        {getIllustrationText()}
      </Text>
      {message && (
        <Text className="text-base font-body text-text text-opacity-70 text-center">
          {message}
        </Text>
      )}
    </View>
  );
}
