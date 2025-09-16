import React from 'react';
import { Bot, MessageCircle, HelpCircle, Sparkles, Clock, Users } from 'lucide-react';

const WelcomeMessage: React.FC = () => {
  const features = [
    { icon: MessageCircle, text: "Ask me anything - from simple questions to complex inquiries" },
    { icon: HelpCircle, text: "Get instant help with FAQs and support topics" },
    { icon: Clock, text: "Available 24/7 for immediate assistance" },
    { icon: Users, text: "Rate responses to help improve my answers" }
  ];

  const exampleQuestions = [
    "What are your business hours?",
    "How can I reset my password?",
    "Tell me about your pricing plans",
    "I need help with my account"
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-teal-100 rounded-3xl p-8 border border-purple-200 shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-br from-purple-600 to-teal-600 p-3 rounded-full shadow-lg">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            Welcome to AI Assistant
            <Sparkles className="w-5 h-5 text-purple-500 ml-2" />
          </h2>
          <p className="text-gray-600">Your intelligent companion for instant support and information</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <MessageCircle className="w-4 h-4 mr-2 text-purple-600" />
            What I can help you with:
          </h3>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <feature.icon className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <HelpCircle className="w-4 h-4 mr-2 text-teal-600" />
            Try asking:
          </h3>
          <div className="space-y-2">
            {exampleQuestions.map((question, index) => (
              <div key={index} className="bg-white bg-opacity-60 rounded-lg px-3 py-2 text-sm text-gray-700 border border-purple-200">
                "{question}"
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white bg-opacity-70 rounded-xl p-4 border border-purple-200">
        <div className="flex items-start space-x-3">
          <div className="bg-purple-100 p-2 rounded-full">
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-800 mb-1">Getting Started</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Simply type your question in the message box below and press Enter. I understand natural language, 
              so feel free to ask in your own words. Use the feedback buttons (👍 👎) to help me provide better responses!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;