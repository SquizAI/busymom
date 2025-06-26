import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatbotAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'bot', 
      text: 'Hi there! I\'m your BusyWomen meal planning assistant. How can I help you today?',
      options: ['Tell me about meal plans', 'How does pricing work?', 'Dietary restrictions?']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text = inputValue) => {
    if (!text.trim()) return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: text
    };
    
    setMessages([...messages, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      let botResponse;
      
      // Simple response logic based on keywords
      const lowercaseMessage = text.toLowerCase();
      if (lowercaseMessage.includes('pricing') || lowercaseMessage.includes('cost') || lowercaseMessage.includes('price')) {
        botResponse = {
          id: messages.length + 2,
          sender: 'bot',
          text: 'We offer three subscription plans:\n\n• Basic: $9.97/month - 5 meal plans per week\n• Premium: $19.97/month - 21 meal plans per week\n• Annual: $197.97/year - All premium features with a 16% discount',
          options: ['Tell me about the Basic plan', 'Tell me about Premium features', 'How to subscribe?']
        };
      } else if (lowercaseMessage.includes('meal plan') || lowercaseMessage.includes('recipe')) {
        botResponse = {
          id: messages.length + 2,
          sender: 'bot',
          text: 'Our meal plans are personalized based on your dietary preferences, health goals, and schedule. Each plan includes recipes, grocery lists, and preparation instructions.',
          options: ['See sample meal plans', 'How are plans customized?', 'Start 14-day free trial'],
          link: { text: 'View all sample meal plans', url: '/meal-plans' }
        };
      } else if (lowercaseMessage.includes('diet') || lowercaseMessage.includes('restriction') || lowercaseMessage.includes('allerg')) {
        botResponse = {
          id: messages.length + 2,
          sender: 'bot',
          text: 'We accommodate many dietary restrictions including vegetarian, vegan, keto, gluten-free, dairy-free, and various allergies. You can set your preferences in your profile after signing up.',
          options: ['How to set preferences?', 'Can I change later?', 'Start my free trial'],
          link: { text: 'See filtered meal plans', url: '/meal-plans' }
        };
      } else if (lowercaseMessage.includes('subscribe') || lowercaseMessage.includes('sign up') || lowercaseMessage.includes('register')) {
        botResponse = {
          id: messages.length + 2,
          sender: 'bot',
          text: 'To subscribe, simply click "Register" at the top of the page, create an account, and choose your preferred subscription plan. You can start with a 14-day free trial!',
          options: ['What payment methods?', 'Can I cancel anytime?', 'See pricing details'],
          link: { text: 'Create my account now', url: '/register' }
        };
      } else if (lowercaseMessage.includes('sample') || lowercaseMessage.includes('example')) {
        botResponse = {
          id: messages.length + 2,
          sender: 'bot',
          text: 'We have several sample meal plans you can browse right now! Check out our vegetarian, keto, family-friendly, and quick-prep options.',
          options: ['Vegetarian options', 'Kid-friendly meals', 'Quick meals'],
          link: { text: 'View all sample meal plans', url: '/meal-plans' }
        };
      } else if (lowercaseMessage.includes('how to set preferences') || lowercaseMessage.includes('set preferences')) {
        botResponse = {
          id: messages.length + 2,
          sender: 'bot',
          text: 'After signing up, go to your Dashboard and click "My Preferences". There you can select dietary restrictions, allergies, and meal preferences. Changes apply to your next week\'s meal plan.',
          options: ['Can I change later?', 'Start my free trial', 'See sample plans'],
          link: { text: 'Sign up & set preferences', url: '/register' }
        };
      } else if (lowercaseMessage.includes('can i change') || lowercaseMessage.includes('change later')) {
        botResponse = {
          id: messages.length + 2,
          sender: 'bot',
          text: 'Absolutely! You can change your preferences any time from your Dashboard. Your next week\'s meal plan will automatically update with your new preferences.',
          options: ['See sample plans', 'Start my free trial', 'Pricing options'],
          link: { text: 'Create account to try it', url: '/register' }
        };
      } else {
        botResponse = {
          id: messages.length + 2,
          sender: 'bot',
          text: 'Thanks for your message! Our AI meal planning system helps busy women save time while eating healthier. Would you like to learn more about our meal plans or pricing options?',
          options: ['Tell me about meal plans', 'Pricing options', 'Start free trial'],
          link: { text: 'View sample meal plans', url: '/meal-plans' }
        };
      }
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating chat button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-indigo-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </button>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-96 bg-white rounded-lg shadow-xl flex flex-col z-50 overflow-hidden"
          >
            {/* Chat header */}
            <div className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className="rounded-full bg-white h-8 w-8 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">BusyWomen Assistant</h3>
                  <div className="text-xs text-indigo-100">AI Meal Planning Helper</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-indigo-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Messages container */}
            <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
              {messages.map((msg) => (
                <div key={msg.id} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  {/* Quick reply options */}
                  {msg.sender === 'bot' && msg.options && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleSendMessage(option)}
                          className="bg-white text-indigo-600 border border-indigo-300 rounded-full px-3 py-1 text-sm hover:bg-indigo-50 transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Direct action link */}
                  {msg.sender === 'bot' && msg.link && (
                    <div className="mt-3">
                      <a 
                        href={msg.link.url}
                        className="inline-block bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors"
                      >
                        {msg.link.text} →
                      </a>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="mb-4">
                  <div className="inline-block bg-gray-200 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            <div className="border-t border-gray-200 p-3 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white p-2 rounded-r-lg hover:bg-indigo-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotAssistant;
