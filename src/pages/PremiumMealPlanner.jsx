import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MealPlanChat from '../components/premium/MealPlanChat';
import { useUser } from '../context/UserContext';
import { Link, Navigate } from 'react-router-dom';

const PremiumMealPlanner = () => {
  const { user, isPremium } = useUser();
  const [activeTab, setActiveTab] = useState('chat');
  
  // Check if user has premium access
  const hasPremiumAccess = isPremium();
  
  // Redirect non-premium users to subscription page
  if (!hasPremiumAccess) {
    return <Navigate to="/subscribe" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Premium Meal Planning</h1>
            <p className="mt-2 text-lg text-gray-600">
              Create personalized meal plans and get cooking inspiration with our AI assistant.
            </p>
          </div>
          
          {/* Navigation tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('chat')}
                className={`${
                  activeTab === 'chat'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
              >
                AI Assistant
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`${
                  activeTab === 'saved'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
              >
                Saved Plans
              </button>
              <button
                onClick={() => setActiveTab('groceries')}
                className={`${
                  activeTab === 'groceries'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
              >
                Shopping List
              </button>
            </nav>
          </div>
          
          {/* Main content area */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden" style={{ height: '75vh' }}>
            {activeTab === 'chat' && (
              <MealPlanChat />
            )}
            
            {activeTab === 'saved' && (
              <div className="p-8 h-full flex flex-col items-center justify-center text-center">
                <img 
                  src="/images/saved-plans-placeholder.svg" 
                  alt="No saved plans" 
                  className="w-48 h-48 mb-4 opacity-50"
                />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No saved meal plans yet</h3>
                <p className="text-gray-500 mb-6">
                  Your saved meal plans will appear here. Chat with the AI assistant to create your first plan!
                </p>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Create Your First Plan
                </button>
              </div>
            )}
            
            {activeTab === 'groceries' && (
              <div className="p-8 h-full flex flex-col items-center justify-center text-center">
                <img 
                  src="/images/grocery-placeholder.svg" 
                  alt="No shopping lists" 
                  className="w-48 h-48 mb-4 opacity-50"
                />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No shopping lists yet</h3>
                <p className="text-gray-500 mb-6">
                  Your shopping lists will appear here. Ask the AI assistant to create a shopping list for your meal plans!
                </p>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Create Shopping List
                </button>
              </div>
            )}
          </div>
          
          {/* Premium badge */}
          <div className="mt-6 text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <svg className="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 8l-3.293-3.293A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              Premium Feature
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumMealPlanner;
