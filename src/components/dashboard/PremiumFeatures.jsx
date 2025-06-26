import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { motion } from 'framer-motion';
import { 
  generateEnhancedMealRecommendations, 
  generateSmartShoppingList,
  generateNutritionInsights
} from '../../lib/enhancedGeminiClient';

/**
 * PremiumFeatures component that showcases premium AI capabilities
 * Only shown to premium subscribers
 */
const PremiumFeatures = ({ userProfile = {} }) => {
  const { user } = useContext(UserContext) || { user: null };
  const [activeTab, setActiveTab] = useState('nutrition');
  const [loading, setLoading] = useState(false);
  const [nutritionInsights, setNutritionInsights] = useState(null);
  const [error, setError] = useState(null);
  
  // Mock data for demonstration
  const mockMealHistory = [
    { 
      date: '2025-06-01', 
      meals: [
        { name: 'Greek Yogurt Bowl', type: 'breakfast', rating: 5 },
        { name: 'Quinoa Salad', type: 'lunch', rating: 4 },
        { name: 'Grilled Salmon', type: 'dinner', rating: 5 }
      ]
    },
    { 
      date: '2025-06-02', 
      meals: [
        { name: 'Avocado Toast', type: 'breakfast', rating: 4 },
        { name: 'Chicken Wrap', type: 'lunch', rating: 3 },
        { name: 'Vegetable Stir Fry', type: 'dinner', rating: 4 }
      ]
    },
    { 
      date: '2025-06-03', 
      meals: [
        { name: 'Smoothie Bowl', type: 'breakfast', rating: 5 },
        { name: 'Mediterranean Bowl', type: 'lunch', rating: 5 },
        { name: 'Lentil Soup', type: 'dinner', rating: 3 }
      ]
    }
  ];
  
  const mockHealthGoals = {
    primary: 'Weight management',
    secondary: ['Increase energy', 'Reduce inflammation'],
    dietaryFocus: 'Balanced macros with emphasis on protein',
    restrictions: ['Limit processed sugar', 'Moderate gluten']
  };

  // Load nutrition insights on component mount
  useEffect(() => {
    const loadNutritionInsights = async () => {
      if (user) {
        try {
          setLoading(true);
          setError(null);
          
          // In a real app, we would fetch the user's actual meal history and health goals
          const insights = await generateNutritionInsights(mockMealHistory, mockHealthGoals);
          
          if (insights.error) {
            setError(insights.error);
          } else {
            setNutritionInsights(insights);
          }
        } catch (err) {
          setError('Failed to load nutrition insights. Please try again later.');
          console.error('Error loading nutrition insights:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadNutritionInsights();
  }, [user]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Render nutrition insights
  const renderNutritionInsights = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-700">Analyzing your nutrition data with AI...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      );
    }

    if (!nutritionInsights) {
      return (
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-700">No nutrition data available.</p>
        </div>
      );
    }

    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Macro Distribution */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Macro Distribution</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-md text-center">
              <div className="text-blue-600 font-bold text-xl mb-1">
                {nutritionInsights.nutritionalAnalysis?.macroDistribution?.protein || "N/A"}
              </div>
              <div className="text-sm text-gray-600">Protein</div>
            </div>
            <div className="bg-green-50 p-4 rounded-md text-center">
              <div className="text-green-600 font-bold text-xl mb-1">
                {nutritionInsights.nutritionalAnalysis?.macroDistribution?.carbs || "N/A"}
              </div>
              <div className="text-sm text-gray-600">Carbs</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-md text-center">
              <div className="text-yellow-600 font-bold text-xl mb-1">
                {nutritionInsights.nutritionalAnalysis?.macroDistribution?.fat || "N/A"}
              </div>
              <div className="text-sm text-gray-600">Fat</div>
            </div>
          </div>
        </motion.div>
        
        {/* Goal Alignment */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Goal Alignment</h3>
          {nutritionInsights.goalAlignment?.map((goal, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{goal.goal}</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  goal.status.toLowerCase().includes('good') ? 'bg-green-100 text-green-800' : 
                  goal.status.toLowerCase().includes('needs') ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-blue-100 text-blue-800'
                }`}>
                  {goal.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">{goal.recommendations}</p>
            </div>
          ))}
        </motion.div>
        
        {/* Nutrient Focus Areas */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Nutrient Focus Areas</h3>
          {nutritionInsights.nutrientFocusAreas?.map((area, index) => (
            <div key={index} className="mb-4 last:mb-0 pb-4 border-b last:border-b-0">
              <div className="font-medium text-indigo-700 mb-1">{area.nutrient}</div>
              <p className="text-sm text-gray-600 mb-2">{area.reason}</p>
              <div className="flex flex-wrap gap-2">
                {area.foodSources?.map((food, idx) => (
                  <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded">
                    {food}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Weekly Targets */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Targets</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-md p-3">
              <div className="text-sm text-gray-500">Daily Calories</div>
              <div className="font-bold text-lg">{nutritionInsights.weeklyTargets?.calories || "N/A"}</div>
            </div>
            <div className="border rounded-md p-3">
              <div className="text-sm text-gray-500">Protein</div>
              <div className="font-bold text-lg">{nutritionInsights.weeklyTargets?.protein || "N/A"}</div>
            </div>
            <div className="border rounded-md p-3">
              <div className="text-sm text-gray-500">Carbs</div>
              <div className="font-bold text-lg">{nutritionInsights.weeklyTargets?.carbs || "N/A"}</div>
            </div>
            <div className="border rounded-md p-3">
              <div className="text-sm text-gray-500">Fat</div>
              <div className="font-bold text-lg">{nutritionInsights.weeklyTargets?.fat || "N/A"}</div>
            </div>
            <div className="border rounded-md p-3">
              <div className="text-sm text-gray-500">Fiber</div>
              <div className="font-bold text-lg">{nutritionInsights.weeklyTargets?.fiber || "N/A"}</div>
            </div>
            <div className="border rounded-md p-3">
              <div className="text-sm text-gray-500">Water</div>
              <div className="font-bold text-lg">{nutritionInsights.weeklyTargets?.water || "N/A"}</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <h2 className="text-xl font-bold text-white">Premium AI Features</h2>
        <p className="mt-1 text-sm text-indigo-100">
          Powered by Gemini 2.5 Pro AI
        </p>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'nutrition'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Nutrition Insights
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'recommendations'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Smart Recommendations
          </button>
          <button
            onClick={() => setActiveTab('shopping')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'shopping'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Smart Shopping
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'nutrition' && renderNutritionInsights()}
        
        {activeTab === 'recommendations' && (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Smart Recommendations</h3>
            <p className="mt-1 text-sm text-gray-500">
              Personalized meal recommendations based on your preferences and nutritional needs.
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Generate Recommendations
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'shopping' && (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Smart Shopping List</h3>
            <p className="mt-1 text-sm text-gray-500">
              AI-generated shopping list based on your meal plan and pantry inventory.
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Generate Shopping List
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumFeatures;
