import React from 'react';
import { Bot, User, ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import { Message } from './ChatInterface';

interface MessageBubbleProps {
  message: Message;
  onFeedback: (messageId: string, feedback: 'positive' | 'negative') => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onFeedback }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} group`}>
      <div className={`flex items-start space-x-3 max-w-[80%] ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
          message.isBot 
            ? 'bg-gradient-to-br from-purple-500 to-teal-600' 
            : 'bg-gradient-to-br from-gray-600 to-gray-700'
        }`}>
          {message.isBot ? (
            <Bot className="w-5 h-5 text-white" />
          ) : (
            <User className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`relative ${message.isBot ? '' : 'items-end'}`}>
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm ${
              message.isBot
                ? 'bg-white border border-gray-200 text-gray-800'
                : 'bg-gradient-to-r from-purple-600 to-teal-500 text-white'
            } ${
              message.isBot ? 'rounded-tl-sm' : 'rounded-tr-sm'
            }`}
          >
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.text}
            </div>
          </div>

          {/* Timestamp and Actions */}
          <div className={`flex items-center mt-2 space-x-2 text-xs text-gray-500 ${
            message.isBot ? '' : 'justify-end'
          }`}>
            <span>{formatTime(message.timestamp)}</span>
            
            {/* Bot message actions */}
            {message.isBot && (
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={handleCopy}
                  className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                  title="Copy message"
                >
                  {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => onFeedback(message.id, 'positive')}
                  className={`p-1 rounded transition-all duration-200 ${
                    message.feedback === 'positive'
                      ? 'bg-green-100 text-green-600'
                      : 'hover:bg-teal-100 hover:text-teal-600'
                  }`}
                  title="Helpful response"
                >
                  <ThumbsUp className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onFeedback(message.id, 'negative')}
                  className={`p-1 rounded transition-all duration-200 ${
                    message.feedback === 'negative'
                      ? 'bg-red-100 text-red-600'
                      : 'hover:bg-purple-100 hover:text-purple-600'
                  }`}
                  title="Not helpful"
                >
                  <ThumbsDown className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Feedback indicator */}
          {message.feedback && (
            <div className={`mt-1 text-xs ${
              message.feedback === 'positive' ? 'text-teal-600' : 'text-purple-600'
            }`}>
              Thanks for your feedback!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;