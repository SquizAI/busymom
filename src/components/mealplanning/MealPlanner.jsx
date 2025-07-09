import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, DollarSign, Zap, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { generateMealPlan, TIER_LIMITS } from '../../services/mealPlanningService';
import MealCard from './MealCard';
import ShoppingList from './ShoppingList';
import MealPlannerSettings from './MealPlannerSettings';
import { toast } from 'react-hot-toast';

const MealPlanner = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('planner');
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    dietaryRestrictions: [],
    allergies: [],
    cookingTimeLimit: 30,
    familySize: 2,
    cuisineTypes: [],
    kidFriendly: false,
    budget: null
  });

  // Determine user tier based on subscription
  const userTier = currentUser?.subscription?.plan || 'free';
  const tierConfig = TIER_LIMITS[userTier];

  // Generate initial meal plan on component mount
  useEffect(() => {
    generateNewMealPlan();
  }, []);

  const generateNewMealPlan = async () => {
    setLoading(true);
    try {
      const result = await generateMealPlan(preferences, userTier);
      if (result.success) {
        setMealPlan(result.mealPlan);
        toast.success('New meal plan generated!');
      } else {
        toast.error(result.error || 'Failed to generate meal plan');
      }
    } catch (error) {
      toast.error('Error generating meal plan');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderTierBadge = () => {
    const badges = {
      free: { color: 'bg-gray-100 text-gray-800', label: 'Free', icon: null },
      basic: { color: 'bg-blue-100 text-blue-800', label: 'Basic', icon: null },
      premium: { color: 'bg-purple-100 text-purple-800', label: 'Premium', icon: Zap },
      premiumPlus: { color: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800', label: 'Premium+', icon: Sparkles }
    };

    const badge = badges[userTier];
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        {Icon && <Icon className="w-4 h-4 mr-1" />}
        {badge.label}
      </span>
    );
  };

  const renderFeatureList = () => {
    const allFeatures = {
      mealHistory: 'Meal History Tracking',
      quickSwaps: 'Quick Meal Swaps',
      pantryTracker: 'Pantry Inventory',
      familySize: 'Family Size Adjustment',
      nutritionAnalysis: 'Nutrition Analysis',
      kidFriendly: 'Kid-Friendly Mode',
      mealPrep: 'Meal Prep Optimizer',
      budgetTracker: 'Budget Tracking',
      substitutions: 'Smart Substitutions',
      leftoverIdeas: 'Leftover Transformer',
      seasonalMenus: 'Seasonal Menus',
      familyProfiles: 'Family Profiles',
      aiChef: 'Personal AI Chef',
      healthGoals: 'Health Goal Integration',
      allergyAlert: 'Allergy Alert System',
      restaurantReplication: 'Restaurant Replication',
      macroTracking: 'Macro/Micro Tracking',
      cookingProgression: 'Cooking Skill Progress',
      integratedShopping: 'Integrated Shopping',
      monthlyReports: 'Monthly Reports',
      recipeVideos: 'Recipe Videos'
    };

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
        {Object.entries(allFeatures).map(([key, label]) => {
          const isAvailable = tierConfig.features.includes(key);
          return (
            <div key={key} className={`flex items-center p-2 rounded ${isAvailable ? 'text-green-700' : 'text-gray-400'}`}>
              {isAvailable ? (
                <Sparkles className="w-4 h-4 mr-2 text-green-500" />
              ) : (
                <Lock className="w-4 h-4 mr-2" />
              )}
              <span className="text-sm">{label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meal Planner</h1>
            <p className="text-gray-600 mt-2">Plan your meals, save time, eat better</p>
          </div>
          <div className="text-right">
            {renderTierBadge()}
            <p className="text-sm text-gray-500 mt-2">
              {userTier === 'free' ? '3 meals per week' : 
               userTier === 'premiumPlus' ? 'Unlimited meals' : 
               '21 meals per week'}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <Calendar className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold">{userTier === 'free' ? '1' : '7'}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Days Planned</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <Clock className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold">{preferences.cookingTimeLimit}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Min Cook Time</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <Users className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-bold">{preferences.familySize}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Family Size</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <DollarSign className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold">${preferences.budget || '---'}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Weekly Budget</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('planner')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'planner'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Meal Planner
            </button>
            <button
              onClick={() => setActiveTab('shopping')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'shopping'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Shopping List
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'features'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Features
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'planner' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Meal Plan</h2>
                <button
                  onClick={generateNewMealPlan}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate New Plan
                    </>
                  )}
                </button>
              </div>

              {/* Meal Plan Grid */}
              {mealPlan ? (
                <div className="space-y-8">
                  {mealPlan.days.map((day) => (
                    <div key={day.day}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">{day.day}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {day.meals.map((meal, index) => (
                          <MealCard
                            key={index}
                            meal={meal}
                            userTier={userTier}
                            onSwap={() => {/* Implement swap functionality */}}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Click "Generate New Plan" to get started!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'shopping' && (
            <ShoppingList mealPlan={mealPlan} userTier={userTier} />
          )}

          {activeTab === 'settings' && (
            <MealPlannerSettings
              preferences={preferences}
              setPreferences={setPreferences}
              userTier={userTier}
              onSave={generateNewMealPlan}
            />
          )}

          {activeTab === 'features' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Available Features</h2>
              <p className="text-gray-600 mb-6">
                Your {userTier} plan includes the following features:
              </p>
              {renderFeatureList()}
              
              {userTier !== 'premiumPlus' && (
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Upgrade to unlock more features</h3>
                  <p className="text-gray-600 mb-4">
                    Get access to advanced meal planning tools, nutrition insights, and personalized recommendations.
                  </p>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700">
                    View Upgrade Options
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;