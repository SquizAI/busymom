import { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { motion } from 'framer-motion';
import { generateMealRecommendations } from '../lib/geminiClient';
import { generateEnhancedMealRecommendations } from '../lib/enhancedGeminiClient';
import { isPremiumUser, hasAccess } from '../lib/featureGate';
import PremiumFeatures from '../components/dashboard/PremiumFeatures';
import FeatureUpgrade from '../components/subscription/FeatureUpgrade';

const Dashboard = () => {
  const { user, loading, logoutDummy, isAdmin, demoMode } = useContext(UserContext) || { user: null, loading: true, demoMode: false };
  const [mealPlan, setMealPlan] = useState(null);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [error, setError] = useState(null);

  // Default user preferences - in a real app, these would come from the user's profile
  const userPreferences = {
    dietaryRestrictions: 'None',
    allergies: 'None',
    calorieTarget: '1800',
    cookingTimeLimit: '15 minutes',
    cuisineTypes: ['Mediterranean', 'Asian', 'American']
  };

  useEffect(() => {
    const loadMealPlan = async () => {
      if (user && !mealPlan && !demoMode) {
        try {
          setLoadingMeals(true);
          setError(null);
          
          // Check if user has premium access and use appropriate meal generation method
          const userIsPremium = isPremiumUser(user);
          
          // Use enhanced meal recommendations for premium users
          const recommendations = userIsPremium
            ? await generateEnhancedMealRecommendations(userPreferences, user.profile || {}, true)
            : await generateMealRecommendations(userPreferences);
            
          setMealPlan(recommendations);
        } catch (err) {
          setError('Failed to load meal recommendations. Please try again later.');
          console.error('Error loading meal recommendations:', err);
        } finally {
          setLoadingMeals(false);
        }
      } else if (user && !mealPlan && demoMode) {
        // Use placeholder data for demo mode
        setMealPlan({
          days: [
            {
              day: 'Monday',
              meals: [
                {
                  type: 'breakfast',
                  name: 'Greek Yogurt Parfait',
                  description: 'Greek yogurt with honey, berries, and granola',
                  prepTime: 5,
                  tags: ['vegetarian', 'kid-friendly'],
                  ingredients: ['Greek yogurt', 'honey', 'mixed berries', 'granola']
                },
                {
                  type: 'lunch',
                  name: 'Mediterranean Chickpea Bowl',
                  description: 'Chickpeas, cucumber, tomato, feta, and olive oil',
                  prepTime: 15,
                  tags: ['vegetarian', 'make-ahead'],
                  ingredients: ['chickpeas', 'cucumber', 'tomato', 'feta cheese', 'olive oil']
                },
                {
                  type: 'dinner',
                  name: 'Sheet Pan Chicken & Veggies',
                  description: 'Chicken breast, bell peppers, broccoli, and olive oil',
                  prepTime: 20,
                  tags: ['kid-friendly', 'one-pan'],
                  ingredients: ['chicken breast', 'bell peppers', 'broccoli', 'olive oil', 'garlic']
                }
              ]
            }
          ]
        });
      }
    };

    loadMealPlan();
  }, [user, mealPlan, demoMode]);

  // Redirect if not logged in
  if (!loading && !user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user has premium access
  const userIsPremium = isPremiumUser(user);
  
  // Admin dashboard view component
  const renderAdminDashboard = () => {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8 grid grid-cols-1 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Dashboard</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-700 mb-2">User Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-md text-center">
                      <div className="text-2xl font-bold text-blue-600">842</div>
                      <div className="text-sm text-gray-500">Total Users</div>
                    </div>
                    <div className="bg-white p-3 rounded-md text-center">
                      <div className="text-2xl font-bold text-green-600">73%</div>
                      <div className="text-sm text-gray-500">Premium Users</div>
                    </div>
                    <div className="bg-white p-3 rounded-md text-center">
                      <div className="text-2xl font-bold text-purple-600">38</div>
                      <div className="text-sm text-gray-500">New Today</div>
                    </div>
                    <div className="bg-white p-3 rounded-md text-center">
                      <div className="text-2xl font-bold text-amber-600">91%</div>
                      <div className="text-sm text-gray-500">Retention</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-700 mb-2">Content Management</h4>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="flex items-center text-purple-600 hover:text-purple-800">
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        Manage Meal Plans
                      </a>
                    </li>
                    <li>
                      <a href="#" className="flex items-center text-purple-600 hover:text-purple-800">
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                        </svg>
                        Edit Recipe Database
                      </a>
                    </li>
                    <li>
                      <a href="#" className="flex items-center text-purple-600 hover:text-purple-800">
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                        </svg>
                        Manage User Accounts
                      </a>
                    </li>
                    <li>
                      <a href="#" className="flex items-center text-purple-600 hover:text-purple-800">
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        Edit Chatbot Responses
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="flow-root">
                <ul className="-mb-8">
                  <li>
                    <div className="relative pb-8">
                      <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      <div className="relative flex items-start space-x-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center">
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              New Premium User Registration
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">
                              12 minutes ago
                            </p>
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            <p>
                              Emma S. registered for a Premium Annual Plan ($119.97)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="relative pb-8">
                      <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      <div className="relative flex items-start space-x-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              New Meal Plan Published
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">
                              1 hour ago
                            </p>
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            <p>
                              'Summer Fresh Meals Under 30 Minutes' plan published by Admin
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="relative pb-8">
                      <div className="relative flex items-start space-x-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Weekly Report Generated
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">
                              3 hours ago
                            </p>
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            <p>
                              Weekly user engagement report has been generated and emailed to administrators
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin() ? 'Admin Dashboard' : 'My Dashboard'}
          </h1>
          <div className="flex items-center">
            <div className="text-right mr-4">
              <p className="text-sm font-medium text-gray-900">{user?.email || user?.name}</p>
              <p className="text-xs text-gray-500">{isAdmin() ? 'Administrator' : 'Premium Member'}</p>
            </div>
            <button
              onClick={logoutDummy}
              className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {isAdmin() ? (
          renderAdminDashboard()
        ) : (
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Weekly Meal Plan</h2>
              {loadingMeals ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-2 text-gray-700">Loading your personalized meal plan...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-md">
                  <p className="text-red-700">{error}</p>
                </div>
              ) : mealPlan ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mealPlan.days && mealPlan.days[0]?.meals ? (
                    mealPlan.days[0].meals.map((meal, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="bg-white overflow-hidden shadow rounded-lg"
                      >
                        <div className="px-4 py-4 sm:p-6">
                          <h3 className="text-lg font-medium text-gray-900">{meal.name}</h3>
                          <p className="mt-1 text-sm text-gray-500">{meal.description}</p>
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {meal.prepTime} min
                            </span>
                            {meal.tags && meal.tags.map((tag, tagIdx) => (
                              <span key={tagIdx} className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-900">Ingredients:</h4>
                            <ul className="mt-2 text-sm text-gray-500 list-disc pl-5 space-y-1">
                              {meal.ingredients && meal.ingredients.map((ingredient, idx) => (
                                <li key={idx}>{ingredient}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : Array.isArray(mealPlan) ? (
                    mealPlan.map((meal, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="bg-white overflow-hidden shadow rounded-lg"
                      >
                        <div className="px-4 py-4 sm:p-6">
                          <h3 className="text-lg font-medium text-gray-900">{meal.name}</h3>
                          <p className="mt-1 text-sm text-gray-500">{meal.description}</p>
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-900">Ingredients:</h4>
                            <ul className="mt-2 text-sm text-gray-500 list-disc pl-5 space-y-1">
                              {meal.ingredients && meal.ingredients.map((ingredient, idx) => (
                                <li key={idx}>{ingredient}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-4">
                      <p className="text-gray-500">No meal data available</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-md">
                  <p className="text-yellow-700">No meal plan generated yet.</p>
                </div>
              )}
            </div>

            {/* Shopping List Section */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Shopping List</h2>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <ul className="divide-y divide-gray-200">
                    <li className="py-3 flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700">Chicken breast (1 lb)</span>
                    </li>
                    <li className="py-3 flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700">Olive oil (2 tbsp)</span>
                    </li>
                    <li className="py-3 flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700">Greek yogurt (1 cup)</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    View complete list <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Subscription status card */}
            <div className="mt-10 bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Subscription</h3>
                <div className="mt-3">
                  <div className="flex items-center">
                    {userIsPremium ? (
                      <>
                        <div className="bg-green-100 rounded-full p-1">
                          <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="ml-2 text-gray-700 font-medium">
                          {user?.subscription?.tier === 'annual' ? 'Annual' : 'Premium'} Plan Active
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="bg-blue-100 rounded-full p-1">
                          <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="ml-2 text-gray-700 font-medium">Basic Plan Active</span>
                      </>
                    )}
                  </div>
                  {userIsPremium && (
                    <p className="mt-2 text-sm text-gray-500">
                      Your subscription renews on {new Date().setMonth(new Date().getMonth() + 1).toLocaleDateString()}
                    </p>
                  )}
                  <div className="mt-4 bg-gray-50 p-3 rounded-md">
                    <h4 className="font-medium text-gray-900">Plan Features</h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-700">
                      <li className="flex items-center">
                        <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Basic meal plans
                      </li>
                      <li className="flex items-center">
                        <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Simple shopping lists
                      </li>
                      <li className="flex items-center">
                        {userIsPremium ? (
                          <>
                            <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Enhanced AI personalization
                          </>
                        ) : (
                          <>
                            <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span className="text-gray-400">Enhanced AI personalization</span>
                            <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">Premium</span>
                          </>
                        )}
                      </li>
                      {userIsPremium && (
                        <li className="flex items-center">
                          <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Nutrition insights
                        </li>
                      )}
                      {user?.subscription?.tier === 'annual' && (
                        <li className="flex items-center">
                          <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Advanced analytics
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                {userIsPremium ? (
                  <a href="/account/subscription" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Manage subscription <span aria-hidden="true">&rarr;</span>
                  </a>
                ) : (
                  <a href="/subscribe/premium" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Upgrade to Premium <span aria-hidden="true">&rarr;</span>
                  </a>
                )}
              </div>
            </div>
            
            {/* Premium Features section - only shown to premium users */}
            {userIsPremium && (
              <div className="mt-10">
                <PremiumFeatures userProfile={user?.profile} />
              </div>
            )}
            
            {/* Feature upgrade prompt - only shown to basic users */}
            {!userIsPremium && (
              <div className="mt-10">
                <FeatureUpgrade 
                  featureKey="ENHANCED_MEAL_PLAN" 
                  title="Upgrade to Premium for Enhanced AI Features" 
                  description="Get personalized nutrition insights, smart shopping lists, and advanced meal planning powered by Gemini 2.5 Pro AI."
                />
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default Dashboard;
