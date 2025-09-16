import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ThumbsUp, ThumbsDown, MessageCircle, HelpCircle, Sparkles } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import WelcomeMessage from './WelcomeMessage';

export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  feedback?: 'positive' | 'negative';
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase().trim();
    
    // FAQ responses
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! I'm here to help you with any questions you might have. Feel free to ask me about our services, general information, or anything else you'd like to know!";
    }
    
    if (input.includes('help') || input.includes('support')) {
      return "I'm happy to help! You can ask me about:\n\n• Frequently asked questions\n• Product information\n• Account assistance\n• Technical support\n• General inquiries\n\nWhat specifically would you like help with?";
    }
    
    if (input.includes('hours') || input.includes('open') || input.includes('schedule')) {
      return "Our support hours are:\n\n• Monday - Friday: 9:00 AM - 6:00 PM EST\n• Saturday: 10:00 AM - 4:00 PM EST\n• Sunday: Closed\n\nThis chatbot is available 24/7 to assist you with common questions!";
    }
    
    if (input.includes('price') || input.includes('cost') || input.includes('pricing')) {
      return "I'd be happy to help you with pricing information! Our plans start at $9.99/month for basic features. For detailed pricing and custom solutions, I recommend:\n\n• Visiting our pricing page\n• Speaking with our sales team\n• Scheduling a demo\n\nWould you like me to connect you with a specialist?";
    }
    
    if (input.includes('contact') || input.includes('phone') || input.includes('email')) {
      return "Here are the ways you can reach us:\n\n📧 Email: support@example.com\n📞 Phone: 1-800-123-4567\n💬 Live Chat: Available during business hours\n📍 Address: 123 Business St, City, ST 12345\n\nIs there a specific department you'd like to contact?";
    }
    
    if (input.includes('account') || input.includes('login') || input.includes('password')) {
      return "For account-related assistance:\n\n• Password reset: Use the 'Forgot Password' link on the login page\n• Account recovery: Contact support with your email address\n• Profile updates: Access your account settings\n• Billing questions: Check your account dashboard\n\nIf you need immediate assistance, I can connect you with our account specialists.";
    }
    
    if (input.includes('thank') || input.includes('thanks')) {
      return "You're very welcome! I'm glad I could help. If you have any other questions or need further assistance, please don't hesitate to ask. Have a wonderful day! 😊";
    }
    
    // Complex inquiry handling
    if (input.length > 50) {
      return "I understand you have a detailed question. Based on what you've shared, I'd recommend:\n\n• For complex technical issues: Contact our technical support team\n• For account-specific concerns: Reach out to customer service\n• For general guidance: I can provide more information if you'd like to break down your question\n\nWould you like me to connect you with a specialist who can better assist with your specific situation?";
    }
    
    // Default responses
    const defaultResponses = [
      "That's an interesting question! Could you provide a bit more detail so I can give you the most helpful answer?",
      "I'd be happy to help with that. Can you tell me more about what you're looking for?",
      "Thanks for your question! To give you the best response, could you clarify what specific information you need?",
      "I want to make sure I understand correctly. Could you rephrase your question or provide more context?",
      "Great question! Let me see how I can best assist you. Can you be more specific about what you'd like to know?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    setShowWelcome(false);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const sendToBackend = async (userInput: string): Promise<string> => {
      try {
        const response = await fetch("http://127.0.0.1:8000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userInput }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        // prefer `reply` but accept `response` or `message`
        return data.reply || data.response || data.message || "";
      } catch (error) {
        console.error("Chat API error:", error);
        return "⚠️ Sorry, I’m having trouble connecting to the server.";
      }
    };

    // Call backend and display the reply (with a small artificial delay for UX)
    try {
      const backendReply = await sendToBackend(userMessage.text);
      // small delay to simulate typing rhythm
      await new Promise((res) => setTimeout(res, 400 + Math.random() * 700));

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: backendReply || generateBotResponse(userMessage.text),
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );
  };

  const quickPrompts = [
    "How can I get help?",
    "What are your hours?",
    "Pricing information",
    "Contact support"
  ];

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Assistant</h1>
            <p className="text-purple-100 text-sm">Always here to help • Online now</p>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Active</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {showWelcome && <WelcomeMessage />}
        
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onFeedback={handleFeedback}
          />
        ))}
        
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length === 0 && !showWelcome && (
        <div className="px-6 py-3 bg-white border-t">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 mb-2 w-full">Quick questions:</span>
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInputValue(prompt)}
                className="px-3 py-2 bg-purple-50 text-purple-700 rounded-full text-sm hover:bg-purple-100 transition-colors duration-200"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-6">
        <div className="flex items-end space-x-4">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
              className="w-full resize-none border border-gray-300 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 min-h-[48px] max-h-32"
              rows={1}
              style={{ height: 'auto' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 128) + 'px';
              }}
            />
            <div className="absolute right-3 bottom-3 text-xs text-gray-400">
              {inputValue.length}/1000
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 disabled:bg-gray-300 text-white p-3 rounded-full transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <span>✨ Powered by advanced AI • Always improving</span>
          <span>{messages.length} messages exchanged</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;