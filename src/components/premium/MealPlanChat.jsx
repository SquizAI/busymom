import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../common/LoadingSpinner';
import { sendMessage, getMessages, createMealPlanningAssistant } from '../../services/agentService';
import { useUser } from '../../context/UserContext';

const MealPlanChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const chatEndRef = useRef(null);
  const { user } = useUser();

  // Initialize the chat when component mounts
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        
        // Get threadId from user's data or create a new assistant
        let threadIdFromStorage = localStorage.getItem(`mealPlanThreadId-${user.uid}`);
        
        if (!threadIdFromStorage) {
          // Create a new assistant and thread
          const { thread } = await createMealPlanningAssistant(user.uid);
          threadIdFromStorage = thread.id;
          localStorage.setItem(`mealPlanThreadId-${user.uid}`, thread.id);
        }
        
        setThreadId(threadIdFromStorage);
        
        // Load previous messages if any
        const previousMessages = await getMessages(threadIdFromStorage);
        
        if (previousMessages && previousMessages.length > 0) {
          const formattedMessages = previousMessages.map(msg => ({
            role: msg.role,
            content: msg.content[0].text.value
          }));
          setMessages(formattedMessages.reverse());
        } else {
          // Add a welcome message if this is the first time
          setMessages([{
            role: 'assistant',
            content: "👋 Hello! I'm your premium meal planning assistant. I can help you create personalized meal plans, suggest recipes for specific dietary needs, and answer food-related questions. How can I help you today?"
          }]);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        setMessages([{
          role: 'assistant',
          content: "Sorry, I'm having trouble connecting. Please try again in a moment."
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      initializeChat();
    }
  }, [user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim() || !threadId) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await sendMessage(threadId, input);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble processing your request right now. Please try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press (send on Enter)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Sample meal suggestions to help users get started
  const suggestions = [
    "Create a meal plan for a family of 4 with picky eaters",
    "I need 5 quick dinner ideas for this week",
    "Suggest healthy meal prep ideas for busy days",
    "Help me plan meals for someone with gluten intolerance",
    "Create a shopping list for a week of Mediterranean meals"
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">Premium Meal Planner</h1>
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              Premium
            </span>
          </div>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`mb-4 ${msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
          >
            <div 
              className={`p-3 max-w-[80%] rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-100'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>
      
      {/* Suggestions */}
      {messages.length < 2 && (
        <div className="px-4 py-3">
          <p className="text-sm text-gray-500 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput(suggestion);
                  // Focus on input after setting
                  setTimeout(() => document.getElementById('chatInput').focus(), 0);
                }}
                className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <textarea
            id="chatInput"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about meal planning..."
            rows={1}
            className="flex-1 resize-none border border-gray-300 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            style={{ 
              minHeight: '44px', 
              maxHeight: '120px' 
            }}
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default MealPlanChat;
