import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, DollarSign, Zap, Lock, Sparkles, BarChart3, Heart, Package, History, RefreshCw, Image, CalendarDays } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { generateMealPlan, TIER_LIMITS, saveMealToHistory } from '../../services/mealPlanningService';
import MealCard from './MealCard';
import ShoppingList from './ShoppingList';
import MealPlannerSettings from './MealPlannerSettings';
import { toast } from 'react-hot-toast';
import OnboardingWizard from '../onboarding/OnboardingWizard';
import QuickActionsBar from '../ui/QuickActionsBar';
import MealHistory from './MealHistory';
import DraggableMealPlanner from './DraggableMealPlanner';
import NutritionalDashboard from './NutritionalDashboard';
import FamilyProfiles from './FamilyProfiles';
import BudgetTracker from './BudgetTracker';
import MealPrepMode from './MealPrepMode';
import OfflineIndicator from '../ui/OfflineIndicator';
import SmartNotifications from '../notifications/SmartNotifications';
import MealSwapModal from './MealSwapModal';
import MealImageGenerator from './MealImageGenerator';
import MealCalendar from './MealCalendar';

const EnhancedMealPlanner = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('planner');
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isDragMode, setIsDragMode] = useState(false);
  const [familyProfiles, setFamilyProfiles] = useState([]);
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [preferences, setPreferences] = useState({
    dietaryRestrictions: [],
    allergies: [],
    cookingTimeLimit: 30,
    familySize: 2,
    cuisineTypes: [],
    kidFriendly: false,
    budget: 150
  });

  // Determine user tier based on subscription
  const userTier = currentUser?.subscription?.plan || 'free';
  const tierConfig = TIER_LIMITS[userTier];

  // Check for onboarding and generate initial meal plan
  useEffect(() => {
    const checkOnboarding = async () => {
      if (currentUser && !currentUser.onboarding_completed && !localStorage.getItem('onboardingCompleted') && !localStorage.getItem('onboardingSkipped')) {
        setShowOnboarding(true);
      } else {
        generateNewMealPlan();
      }
    };
    checkOnboarding();
  }, [currentUser]);

  // Enable offline support
  useEffect(() => {
    if (mealPlan) {
      localStorage.setItem('cachedMealPlan', JSON.stringify(mealPlan));
      localStorage.setItem('cachedMealPlanDate', new Date().toISOString());
    }
  }, [mealPlan]);

  // Load cached meal plan if offline
  useEffect(() => {
    if (!navigator.onLine) {
      const cached = localStorage.getItem('cachedMealPlan');
      if (cached) {
        setMealPlan(JSON.parse(cached));
        toast.info('Loaded cached meal plan (offline mode)');
      }
    }
  }, []);

  const generateNewMealPlan = async () => {
    setLoading(true);
    try {
      const result = await generateMealPlan(preferences, userTier);
      if (result.success) {
        setMealPlan(result.mealPlan);
        // Save meals to history
        if (currentUser && result.mealPlan?.days) {
          result.mealPlan.days.forEach(day => {
            day.meals?.forEach(meal => {
              saveMealToHistory({ ...meal, day: day.day }, currentUser.uid);
            });
          });
        }
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

  const handleMealSwap = (day, mealType, newMeal) => {
    const updatedPlan = { ...mealPlan };
    const dayIndex = updatedPlan.days.findIndex(d => d.day === day);
    if (dayIndex !== -1) {
      const mealIndex = updatedPlan.days[dayIndex].meals.findIndex(m => m.type === mealType);
      if (mealIndex !== -1) {
        updatedPlan.days[dayIndex].meals[mealIndex] = newMeal;
        setMealPlan(updatedPlan);
        saveMealToHistory(newMeal, currentUser.uid);
      }
    }
  };

  const handleMealFavorite = (meal, isFavorite) => {
    // Update meal favorite status in history
    const history = JSON.parse(localStorage.getItem('mealHistory') || '[]');
    const mealInHistory = history.find(m => m.name === meal.name);
    if (mealInHistory) {
      mealInHistory.isFavorite = isFavorite;
      localStorage.setItem('mealHistory', JSON.stringify(history));
    }
  };

  const handleAddMealFromHistory = (meal) => {
    // Add meal to current plan
    toast.success(`Added ${meal.name} to your meal plan`);
  };

  const handleMealsReorder = (reorderedMeals) => {
    // Update meal plan with new order
    const updatedPlan = { ...mealPlan };
    // Group meals by day
    const mealsByDay = {};
    reorderedMeals.forEach(meal => {
      if (!mealsByDay[meal.day]) {
        mealsByDay[meal.day] = [];
      }
      mealsByDay[meal.day].push(meal);
    });
    
    // Update plan
    updatedPlan.days = updatedPlan.days.map(day => ({
      ...day,
      meals: mealsByDay[day.day] || []
    }));
    
    setMealPlan(updatedPlan);
  };

  const handleOnboardingComplete = (prefs) => {
    setPreferences(prefs);
    setShowOnboarding(false);
    generateNewMealPlan();
  };

  const handleGenerateTodaysMeal = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todaysMeals = mealPlan?.days.find(d => d.day === today);
    if (todaysMeals) {
      toast.success(`Today's meals are ready! Check ${today} in your meal plan.`);
      setActiveTab('planner');
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

  const tabs = [
    { id: 'planner', label: 'Meal Planner', icon: Calendar },
    { id: 'calendar', label: 'Calendar View', icon: CalendarDays },
    { id: 'shopping', label: 'Shopping List', icon: DollarSign },
    { id: 'nutrition', label: 'Nutrition', icon: BarChart3, premium: true },
    { id: 'family', label: 'Family', icon: Users, premium: true },
    { id: 'budget', label: 'Budget', icon: DollarSign, premium: true },
    { id: 'prep', label: 'Meal Prep', icon: Package, premium: true },
    { id: 'settings', label: 'Settings', icon: Users },
    { id: 'features', label: 'Features', icon: Sparkles }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Offline Indicator */}
      <OfflineIndicator />

      {/* Onboarding Wizard */}
      {showOnboarding && (
        <OnboardingWizard onComplete={handleOnboardingComplete} />
      )}

      {/* Quick Actions Bar */}
      <QuickActionsBar
        onGenerateMeal={handleGenerateTodaysMeal}
        onViewShoppingList={() => setActiveTab('shopping')}
        onSearch={() => setShowQuickSearch(true)}
        onViewHistory={() => setShowHistory(true)}
      />

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meal Planner</h1>
            <p className="text-gray-600">Plan your week, save time, eat healthy</p>
          </div>
          <div className="flex items-center gap-4">
            <SmartNotifications mealPlan={mealPlan} preferences={preferences} />
            {renderTierBadge()}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <Calendar className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold">{mealPlan?.days.length || 0}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Days Planned</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <Clock className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold">{preferences.cookingTimeLimit}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Min Prep Time</p>
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
          <nav className="-mb-px flex flex-wrap gap-2 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isLocked = tab.premium && userTier === 'free';
              
              return (
                <button
                  key={tab.id}
                  onClick={() => !isLocked && setActiveTab(tab.id)}
                  disabled={isLocked}
                  className={`py-4 px-4 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : isLocked
                      ? 'border-transparent text-gray-400 cursor-not-allowed'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isLocked && <Lock className="w-3 h-3 ml-1" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'planner' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Meal Plan</h2>
                <div className="flex gap-2">
                  {userTier !== 'free' && mealPlan && (
                    <button
                      onClick={() => setShowImageGenerator(true)}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2"
                    >
                      <Image className="w-4 h-4" />
                      Generate Images
                    </button>
                  )}
                  <button
                    onClick={() => setIsDragMode(!isDragMode)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isDragMode
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {isDragMode ? 'Exit Drag Mode' : 'Reorder Meals'}
                  </button>
                  <button
                    onClick={generateNewMealPlan}
                    disabled={loading}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
              </div>

              {/* Meal Plan Grid */}
              {mealPlan ? (
                isDragMode ? (
                  <DraggableMealPlanner
                    initialMeals={mealPlan.days.flatMap(day => 
                      day.meals.map(meal => ({ ...meal, day: day.day, id: `${day.day}-${meal.type}` }))
                    )}
                    onMealsReorder={handleMealsReorder}
                  />
                ) : (
                  <div className="space-y-8">
                    {mealPlan.days.map((day) => (
                      <div key={day.day}>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{day.day}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {day.meals.map((meal, index) => (
                            <MealCard
                              key={index}
                              meal={{ ...meal, day: day.day }}
                              userTier={userTier}
                              onSwap={(newMeal) => handleMealSwap(day.day, meal.type, newMeal)}
                              onFavorite={handleMealFavorite}
                              preferences={preferences}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
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

          {activeTab === 'calendar' && mealPlan && (
            <MealCalendar
              mealPlan={mealPlan}
              userTier={userTier}
              onMealSwap={handleMealSwap}
              onMealFavorite={handleMealFavorite}
              preferences={preferences}
            />
          )}

          {activeTab === 'nutrition' && (
            <NutritionalDashboard 
              mealPlan={mealPlan} 
              familyProfiles={familyProfiles}
              userTier={userTier}
            />
          )}

          {activeTab === 'family' && (
            <FamilyProfiles 
              onProfilesUpdate={setFamilyProfiles}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetTracker
              mealPlan={mealPlan}
              preferences={preferences}
              userTier={userTier}
            />
          )}

          {activeTab === 'prep' && (
            <MealPrepMode
              mealPlan={mealPlan}
              preferences={preferences}
            />
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries({
                  mealHistory: { label: 'Meal History Tracking', icon: History },
                  quickSwaps: { label: 'Quick Meal Swaps', icon: RefreshCw },
                  pantryTracker: { label: 'Pantry Inventory', icon: Package },
                  familySize: { label: 'Family Size Adjustment', icon: Users },
                  nutritionAnalysis: { label: 'Nutrition Analysis', icon: BarChart3 },
                  kidFriendly: { label: 'Kid-Friendly Mode', icon: Heart },
                  mealPrep: { label: 'Meal Prep Optimizer', icon: Clock },
                  budgetTracker: { label: 'Budget Tracking', icon: DollarSign },
                  substitutions: { label: 'Smart Substitutions', icon: Sparkles },
                  leftoverIdeas: { label: 'Leftover Transformer', icon: Package },
                  seasonalMenus: { label: 'Seasonal Menus', icon: Calendar },
                  familyProfiles: { label: 'Family Profiles', icon: Users }
                }).map(([key, feature]) => {
                  const isAvailable = tierConfig.features.includes(key);
                  const Icon = feature.icon;
                  
                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-lg border-2 ${
                        isAvailable
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isAvailable ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className={`font-medium ${isAvailable ? 'text-gray-900' : 'text-gray-500'}`}>
                          {feature.label}
                        </span>
                      </div>
                      {!isAvailable && (
                        <Lock className="w-4 h-4 text-gray-400 mt-2" />
                      )}
                    </div>
                  );
                })}
              </div>
              
              {userTier !== 'premiumPlus' && (
                <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Upgrade to unlock more features</h3>
                  <p className="text-gray-600 mb-4">
                    Get access to advanced meal planning tools, nutrition insights, and personalized recommendations.
                  </p>
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700">
                    View Upgrade Options
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Meal History Modal */}
      {showHistory && (
        <MealHistory
          onAddMeal={handleAddMealFromHistory}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* Meal Image Generator Modal */}
      {showImageGenerator && (
        <MealImageGenerator
          mealPlan={mealPlan}
          userTier={userTier}
          onClose={() => setShowImageGenerator(false)}
        />
      )}
    </div>
  );
};

export default EnhancedMealPlanner;