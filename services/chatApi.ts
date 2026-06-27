import { ActiveSession } from '@/store/useSessionStore';
import { generateBuddyPrompt } from '@/config/buddyPrompt';

export interface ChatMessageContext {
  sessionContext: ActiveSession;
  userName: string;
  userMessage: string;
}

/**
 * Mock streaming API call.
 * TODO: Replace with real LLM streaming API.
 * The architecture uses an onStreamUpdate callback to provide tokens seamlessly to the UI.
 */
export const sendMessageToBuddy = async (
  context: ChatMessageContext,
  onStreamUpdate: (token: string) => void,
  onComplete: (fullMessage: string) => void
) => {
  // Generate the system prompt silently just to show where it would go
  const systemPrompt = generateBuddyPrompt(context.sessionContext, context.userName);
  console.log('[MOCK AI] Using System Prompt:', systemPrompt.substring(0, 50) + '...');

  // Pre-bake some responses based on user messages for demo purposes
  const isGreeting = context.userMessage.toLowerCase().includes('hi') || context.userMessage.toLowerCase().includes('hello');
  const isHelp = context.userMessage.toLowerCase().includes('find a place');
  
  let mockResponseStr = '';
  
  if (isHelp) {
    mockResponseStr = `I can definitely help with that! Finding a place in ${context.sessionContext.cityTo} depends a lot on where your office or college is. 
<CARD>{"type":"place", "name":"Indiranagar", "description":"Great for food and connectivity"}</CARD>
What area will you be commuting to mostly?`;
  } else if (isGreeting) {
    mockResponseStr = `Hey there! Welcome to ${context.sessionContext.cityTo}. It's quite a shift from ${context.sessionContext.cityFrom}, but you'll love it. How can I help you settle in today?`;
  } else {
    mockResponseStr = `That sounds interesting! The local vibe here in ${context.sessionContext.cityTo} is pretty unique. Let me know if you need specific tips on transport or food.`;
  }

  // Simulate streaming by splitting into words
  const tokens = mockResponseStr.split(/(\s+)/); // split by whitespace keeping the whitespace
  let currentText = '';

  for (let i = 0; i < tokens.length; i++) {
    // Wait slightly to simulate network latency per token
    await new Promise(resolve => setTimeout(resolve, 50));
    currentText += tokens[i];
    onStreamUpdate(currentText);
  }

  onComplete(currentText);
};
