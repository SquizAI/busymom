import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import {
  ChatBubbleLeftIcon,
  CakeIcon,
  BeakerIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/solid'
import { generateResponse } from '../../services/geminiService'

const StickyFooter = ({ initialOpen = false }) => {
  const [chatOpen, setChatOpen] = useState(initialOpen)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm your personal meal planning assistant for busy moms. How can I help you today?",
      sender: 'agent',
      agent: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [activeAgent, setActiveAgent] = useState('assistant')
  const [isTyping, setIsTyping] = useState(false)
  const messageEndRef = useRef(null)
  
  const agents = [
    { 
      id: 'assistant', 
      name: 'Meal Assistant', 
      color: 'indigo', 
      icon: <ChatBubbleLeftIcon className="h-5 w-5" />,
      expertise: 'General help with meal planning' 
    },
    { 
      id: 'nutritionist', 
      name: 'Nutritionist', 
      color: 'green', 
      icon: <BeakerIcon className="h-5 w-5" />,
      expertise: 'Nutrition advice and dietary information' 
    },
    { 
      id: 'chef', 
      name: 'Chef', 
      color: 'amber', 
      icon: <CakeIcon className="h-5 w-5" />,
      expertise: 'Recipe assistance and cooking techniques' 
    },
    { 
      id: 'grocery', 
      name: 'Grocery Helper', 
      color: 'blue', 
      icon: <ShoppingBagIcon className="h-5 w-5" />,
      expertise: 'Shopping lists and food budget tips' 
    }
  ];
  
  // Handle sending a new message
  const handleSendMessage = async () => {
    if (currentMessage.trim() === '') return
    
    // Store the current message as we'll clear the input field
    const messageToSend = currentMessage
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: messageToSend,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    // Update messages state and clear input
    setMessages(prevMessages => [...prevMessages, newUserMessage])
    setCurrentMessage('')
    
    // Show typing indicator
    setIsTyping(true)
    
    try {
      // Get filtered messages for context (exclude system messages)
      const messageHistory = messages.filter(msg => msg.sender !== 'system')
      
      // Get AI response from Gemini API
      const response = await generateResponse(messageToSend, activeAgent, messageHistory)
      
      // Create and add the agent response message
      const agentResponse = {
        id: messages.length + 2,
        text: response,
        sender: 'agent',
        agent: activeAgent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      
      setMessages(prevMessages => [...prevMessages, agentResponse])
    } catch (error) {
      console.error('Error getting AI response:', error)
      
      // Add error message if API call fails
      const errorMessage = {
        id: messages.length + 2,
        text: "I'm having trouble connecting to my knowledge base right now. Could you try again in a moment?",
        sender: 'agent',
        agent: activeAgent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      
      setMessages(prevMessages => [...prevMessages, errorMessage])
    } finally {
      // Hide typing indicator
      setIsTyping(false)
    }
  }
  
  // Get a fallback response if the API fails
  const getFallbackResponse = (agent) => {
    switch(agent) {
      case 'assistant':
        return "I'd be happy to help with your meal planning! Would you like to see some quick 15-minute recipes or do you have specific dietary preferences?"
      case 'nutritionist':
        return "Great question about nutrition! I can help you balance your meals for optimal health and energy levels."
      case 'chef':
        return "From a culinary perspective, I'd suggest trying this technique for better flavor and texture in your meals."
      case 'grocery':
        return "I can help optimize your shopping list and suggest budget-friendly alternatives that still taste great!"
      default:
        return "How can I help with your meal planning today?"
    }
  }
  
  // Switch between different agents
  const switchAgent = async (agentId) => {
    setActiveAgent(agentId)
    
    // Add a system message about switching agents
    const switchMessage = {
      id: messages.length + 1,
      text: `You are now chatting with the ${agents.find(a => a.id === agentId).name}.`,
      sender: 'system',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    setMessages(prevMessages => [...prevMessages, switchMessage])
    
    // Show typing indicator
    setIsTyping(true)
    
    try {
      // Generate a personalized intro from Gemini based on agent type
      const introPrompt = `Introduce yourself as a ${agents.find(a => a.id === agentId).name} and explain how you can help with meal planning for busy moms. Keep it brief (1-2 sentences).`;
      
      // Get intro message from Gemini API
      const introResponse = await generateResponse(introPrompt, agentId, [])
      
      // Add intro message from the new agent
      const introMessage = {
        id: messages.length + 2,
        text: introResponse || getFallbackAgentIntro(agentId),
        sender: 'agent',
        agent: agentId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      
      setMessages(prevMessages => [...prevMessages, introMessage])
    } catch (error) {
      console.error('Error getting agent intro:', error)
      
      // Use fallback intro if API fails
      const fallbackIntro = {
        id: messages.length + 2,
        text: getFallbackAgentIntro(agentId),
        sender: 'agent',
        agent: agentId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      
      setMessages(prevMessages => [...prevMessages, fallbackIntro])
    } finally {
      setIsTyping(false)
    }
  }
  
  // Get fallback intro message for each agent if API fails
  const getFallbackAgentIntro = (agentId) => {
    switch(agentId) {
      case 'assistant':
        return "I'm your meal planning assistant! How can I help you create delicious meals in 15 minutes or less?"
      case 'nutritionist':
        return "I'm your nutritionist. I can help you make healthy food choices that fit your lifestyle and goals."
      case 'chef':
        return "Chef here! I can help with cooking techniques, flavor combinations, and recipe adjustments."
      case 'grocery':
        return "Grocery Helper at your service! Let me help you save money and time on your grocery shopping."
      default:
        return "How can I help you today?"
    }
  }
  
  // Handle Enter key to send message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  // Scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  return (
    <>
      {/* Chat Button - only visible on desktop */}
      <div className="hidden md:block fixed right-6 bottom-6 z-40">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className={`flex items-center justify-center rounded-full shadow-lg transition-all 
            ${chatOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'} 
            h-14 w-14 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          aria-label={chatOpen ? 'Close chat' : 'Open chat'}
        >
          {chatOpen ? (
            <XMarkIcon className="h-6 w-6 text-white" />
          ) : (
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      {/* Chat Panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white z-50 md:inset-auto md:bottom-20 md:right-6 md:w-96 md:h-[600px] md:max-h-[80vh] md:rounded-2xl md:shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Close button */}
            <button 
              onClick={() => setChatOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm"
              aria-label="Close chat"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b"
              style={{
                background: activeAgent === 'assistant' ? 'linear-gradient(to right, #EEF2FF, #F9FAFB)' :
                          activeAgent === 'nutritionist' ? 'linear-gradient(to right, #ECFDF5, #F9FAFB)' :
                          activeAgent === 'chef' ? 'linear-gradient(to right, #FFFBEB, #F9FAFB)' :
                          'linear-gradient(to right, #EFF6FF, #F9FAFB)'
              }}
            >
              <div className="flex items-center">
                <div className="mr-3 flex-shrink-0 rounded-full p-2"
                  style={{
                    background: activeAgent === 'assistant' ? 'rgba(79, 70, 229, 0.1)' :
                              activeAgent === 'nutritionist' ? 'rgba(16, 185, 129, 0.1)' :
                              activeAgent === 'chef' ? 'rgba(245, 158, 11, 0.1)' :
                              'rgba(59, 130, 246, 0.1)'
                  }}
                >
                  {agents.find(a => a.id === activeAgent)?.icon}
                </div>
                <div>
                  <h3 className="font-medium">
                    BusyWomen Chat
                  </h3>
                  <p className="text-xs text-gray-600">
                    {agents.find(a => a.id === activeAgent)?.expertise}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Agent Selector */}
            <div className="flex overflow-x-auto px-4 py-3 border-b space-x-3 bg-gray-50">
              {agents.map(agent => {
                // Get the correct background and text colors based on active state
                const bgColor = activeAgent === agent.id
                  ? agent.id === 'assistant' ? 'bg-indigo-100' :
                    agent.id === 'nutritionist' ? 'bg-green-100' :
                    agent.id === 'chef' ? 'bg-amber-100' :
                    'bg-blue-100'
                  : 'bg-white';
                
                const textColor = activeAgent === agent.id
                  ? agent.id === 'assistant' ? 'text-indigo-700' :
                    agent.id === 'nutritionist' ? 'text-green-700' :
                    agent.id === 'chef' ? 'text-amber-700' :
                    'text-blue-700'
                  : 'text-gray-500';
                
                const borderColor = activeAgent === agent.id
                  ? agent.id === 'assistant' ? 'border-indigo-200' :
                    agent.id === 'nutritionist' ? 'border-green-200' :
                    agent.id === 'chef' ? 'border-amber-200' :
                    'border-blue-200'
                  : 'border-gray-200';
                
                return (
                  <button
                    key={agent.id}
                    onClick={() => switchAgent(agent.id)}
                    className={`flex items-center space-x-2 p-2 rounded-full border ${bgColor} ${textColor} ${borderColor} shadow-sm transition-all`}
                  >
                    <span className="flex-shrink-0">{agent.icon}</span>
                    {activeAgent === agent.id && (
                      <span className="text-xs font-medium">{agent.name}</span>
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                  {message.sender === 'system' ? (
                    <div className="bg-gray-200 text-gray-800 rounded-lg py-2 px-3 text-sm max-w-[75%]">
                      {message.text}
                    </div>
                  ) : message.sender === 'agent' ? (
                    <div className="flex items-start max-w-[75%]">
                      <div 
                        className="rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0"
                        style={{
                          background: message.agent === 'assistant' ? 'rgba(79, 70, 229, 0.1)' :
                                    message.agent === 'nutritionist' ? 'rgba(16, 185, 129, 0.1)' :
                                    message.agent === 'chef' ? 'rgba(245, 158, 11, 0.1)' :
                                    'rgba(59, 130, 246, 0.1)'
                        }}
                      >
                        {agents.find(a => a.id === message.agent)?.icon}
                      </div>
                      <div
                        className="rounded-lg py-2 px-3 text-sm"
                        style={{
                          background: message.agent === 'assistant' ? 'rgba(79, 70, 229, 0.1)' :
                                    message.agent === 'nutritionist' ? 'rgba(16, 185, 129, 0.1)' :
                                    message.agent === 'chef' ? 'rgba(245, 158, 11, 0.1)' :
                                    'rgba(59, 130, 246, 0.1)',
                          color: message.agent === 'assistant' ? '#4338ca' :
                                message.agent === 'nutritionist' ? '#065f46' :
                                message.agent === 'chef' ? '#92400e' :
                                '#1e40af'
                        }}
                      >
                        {message.text}
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-indigo-600 text-white rounded-lg py-2 px-3 text-sm max-w-[75%]">
                      {message.text}
                      <div className="text-xs opacity-70 mt-1 text-right">
                        {message.timestamp}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div 
                    className="rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0"
                    style={{
                      background: activeAgent === 'assistant' ? 'rgba(79, 70, 229, 0.1)' :
                                activeAgent === 'nutritionist' ? 'rgba(16, 185, 129, 0.1)' :
                                activeAgent === 'chef' ? 'rgba(245, 158, 11, 0.1)' :
                                'rgba(59, 130, 246, 0.1)'
                    }}
                  >
                    {agents.find(a => a.id === activeAgent)?.icon}
                  </div>
                  <div 
                    className="rounded-lg py-2 px-4 text-sm inline-flex items-center"
                    style={{
                      background: activeAgent === 'assistant' ? 'rgba(79, 70, 229, 0.1)' :
                                activeAgent === 'nutritionist' ? 'rgba(16, 185, 129, 0.1)' :
                                activeAgent === 'chef' ? 'rgba(245, 158, 11, 0.1)' :
                                'rgba(59, 130, 246, 0.1)'
                    }}
                  >
                    <span className="typing-dot"></span>
                    <span className="typing-dot typing-dot-1"></span>
                    <span className="typing-dot typing-dot-2"></span>
                  </div>
                </div>
              )}
              
              {/* This is used to auto-scroll to the bottom */}
              <div ref={messageEndRef} />
            </div>
            
            {/* Message Input */}
            <div className="p-3 border-t bg-white">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={e => setCurrentMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask the meal assistant about meal planning..."
                  className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={currentMessage.trim() === ''}
                  className={`absolute right-2 rounded-full p-1.5 ${
                    currentMessage.trim() === '' 
                      ? 'text-gray-400 bg-gray-100' 
                      : 'text-white bg-indigo-600 hover:bg-indigo-700'
                  } transition-colors`}
                >
                  <PaperAirplaneIcon className="h-5 w-5 transform rotate-90" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for typing animation */}
      <style jsx>{`
        .typing-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: currentColor;
          opacity: 0.6;
          animation: typingAnimation 1.4s infinite both;
          margin: 0 1px;
        }
        
        .typing-dot-1 {
          animation-delay: 0.2s;
        }
        
        .typing-dot-2 {
          animation-delay: 0.4s;
        }
        
        @keyframes typingAnimation {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-2px);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}

export default StickyFooter
