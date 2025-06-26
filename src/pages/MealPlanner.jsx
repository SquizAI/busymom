import { useContext, useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { generateMealRecommendations, generateShoppingList, getMealsForDay } from '../lib/geminiClient'

const MealPlanner = () => {
  const { user, loading } = useContext(UserContext) || { user: null, loading: true }
  const [preferences, setPreferences] = useState({
    dietaryRestrictions: '',
    allergies: '',
    calorieTarget: '1800',
    cookingTimeLimit: '15',
    cuisineTypes: []
  })
  const [mealPlan, setMealPlan] = useState(null)
  const [currentDayMeals, setCurrentDayMeals] = useState(null)
  const [shoppingList, setShoppingList] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('plan')
  const [selectedDay, setSelectedDay] = useState('Monday')

  // Redirect if not logged in
  if (!loading && !user) {
    return <Navigate to="/login" />
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPreferences({
      ...preferences,
      [name]: value
    })
  }

  // Handle cuisine type selection
  const handleCuisineToggle = (cuisine) => {
    const updatedCuisines = [...preferences.cuisineTypes]
    
    if (updatedCuisines.includes(cuisine)) {
      const index = updatedCuisines.indexOf(cuisine)
      updatedCuisines.splice(index, 1)
    } else {
      updatedCuisines.push(cuisine)
    }
    
    setPreferences({
      ...preferences,
      cuisineTypes: updatedCuisines
    })
  }

  // Update current day meals when selected day changes or meal plan changes
  useEffect(() => {
    if (mealPlan) {
      const dayMeals = getMealsForDay(mealPlan, selectedDay);
      setCurrentDayMeals(dayMeals);
    }
  }, [selectedDay, mealPlan]);

  // Generate meal plan based on preferences
  const handleGenerateMealPlan = async (e) => {
    e.preventDefault()
    
    try {
      setIsGenerating(true)
      setError(null)
      
      const recommendations = await generateMealRecommendations(preferences)
      setMealPlan(recommendations)
      
      // Set initial day meals
      if (recommendations && recommendations.days) {
        const dayMeals = getMealsForDay(recommendations, selectedDay);
        setCurrentDayMeals(dayMeals);
      }
      
      // Generate shopping list based on meal plan
      if (recommendations) {
        const list = await generateShoppingList(recommendations)
        setShoppingList(list)
      }
      
    } catch (err) {
      setError('Failed to generate meal plan. Please try again.')
      console.error('Error generating meal plan:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }

  const cuisineOptions = [
    'Mediterranean', 'Asian', 'Mexican', 'Italian', 'American', 
    'Indian', 'Middle Eastern', 'Greek', 'French', 'Japanese'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Meal Planner</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('plan')}
                className={`${
                  activeTab === 'plan'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Create Meal Plan
              </button>
              <button
                onClick={() => setActiveTab('shopping')}
                className={`${
                  activeTab === 'shopping'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                disabled={!shoppingList}
              >
                Shopping List
              </button>
            </nav>
          </div>

          {activeTab === 'plan' ? (
            <div>
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <div className="px-4 sm:px-0">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Meal Preferences</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Customize your meal plan based on your dietary needs and preferences.
                    </p>
                    <div className="mt-6 bg-indigo-50 p-4 rounded-lg">
                      <h4 className="font-medium text-indigo-800 mb-2">Powered by AI</h4>
                      <p className="text-sm text-indigo-700">
                        Our meal planning uses Google's Gemini 2.5 AI to create personalized recipes tailored to your specific needs.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <form onSubmit={handleGenerateMealPlan}>
                    <div className="shadow sm:rounded-md sm:overflow-hidden">
                      <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                        {error && (
                          <div className="bg-red-50 border-l-4 border-red-500 p-4">
                            <p className="text-red-700">{error}</p>
                          </div>
                        )}
                        
                        <div>
                          <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700">
                            Dietary Restrictions
                          </label>
                          <div className="mt-1">
                            <select
                              id="dietaryRestrictions"
                              name="dietaryRestrictions"
                              value={preferences.dietaryRestrictions}
                              onChange={handleInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            >
                              <option value="">None</option>
                              <option value="vegetarian">Vegetarian</option>
                              <option value="vegan">Vegan</option>
                              <option value="gluten-free">Gluten-Free</option>
                              <option value="dairy-free">Dairy-Free</option>
                              <option value="keto">Keto</option>
                              <option value="paleo">Paleo</option>
                              <option value="low-carb">Low Carb</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
                            Allergies or Ingredients to Avoid
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="allergies"
                              id="allergies"
                              value={preferences.allergies}
                              onChange={handleInputChange}
                              placeholder="e.g., nuts, shellfish, eggs"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="calorieTarget" className="block text-sm font-medium text-gray-700">
                            Daily Calorie Target
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              name="calorieTarget"
                              id="calorieTarget"
                              value={preferences.calorieTarget}
                              onChange={handleInputChange}
                              min="1200"
                              max="3000"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="cookingTimeLimit" className="block text-sm font-medium text-gray-700">
                            Maximum Cooking Time (minutes)
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              name="cookingTimeLimit"
                              id="cookingTimeLimit"
                              value={preferences.cookingTimeLimit}
                              onChange={handleInputChange}
                              min="5"
                              max="60"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preferred Cuisine Types
                          </label>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                            {cuisineOptions.map((cuisine) => (
                              <div key={cuisine} className="flex items-center">
                                <input
                                  id={`cuisine-${cuisine}`}
                                  name="cuisineTypes"
                                  type="checkbox"
                                  checked={preferences.cuisineTypes.includes(cuisine)}
                                  onChange={() => handleCuisineToggle(cuisine)}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`cuisine-${cuisine}`} className="ml-2 text-sm text-gray-700">
                                  {cuisine}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <button
                          type="submit"
                          disabled={isGenerating}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75"
                        >
                          {isGenerating ? 'Generating...' : 'Generate Meal Plan'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Meal Plan Results */}
              {mealPlan && !isGenerating && (
                <div className="mt-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Personalized Meal Plan</h2>
                  
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <div className="bg-indigo-50 px-4 py-5 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Weekly Plan
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Your AI-generated meal plan based on your preferences
                      </p>
                      
                      {/* Day selector */}
                      <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                          <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`px-4 py-2 rounded-full text-sm font-medium ${selectedDay === day 
                              ? 'bg-indigo-600 text-white' 
                              : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                          >
                            {day.substring(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 p-4">
                      {/* Display meals for selected day */}
                      <div className="space-y-6">
                        {currentDayMeals ? (
                          currentDayMeals.map((meal, index) => (
                            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                              <div className="flex justify-between items-center">
                                <h4 className="text-gray-500 font-medium">{meal.type.toUpperCase()}</h4>
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {meal.prepTime} min
                                </span>
                              </div>
                              <h3 className="text-xl font-bold mt-1">{meal.name}</h3>
                              <p className="text-gray-600 mt-1">{meal.description}</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {meal.tags && meal.tags.map((tag, tagIndex) => {
                                  // Determine tag color based on tag content
                                  let tagClass = "bg-blue-50 text-blue-700";
                                  if (tag.toLowerCase().includes('veg')) {
                                    tagClass = "bg-green-50 text-green-700";
                                  } else if (tag.toLowerCase().includes('one') || tag.toLowerCase().includes('pan')) {
                                    tagClass = "bg-amber-50 text-amber-700";
                                  }
                                  
                                  return (
                                    <span key={tagIndex} className={`${tagClass} px-2 py-1 rounded-full text-xs font-medium`}>
                                      {tag}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          ))
                        ) : (
                          // Fallback example meals if no data available
                          <>
                            {/* Breakfast */}
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <div className="flex justify-between items-center">
                                <h4 className="text-gray-500 font-medium">BREAKFAST</h4>
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  5 min
                                </span>
                              </div>
                              <h3 className="text-xl font-bold mt-1">Greek Yogurt Parfait</h3>
                              <p className="text-gray-600 mt-1">Greek yogurt with honey, berries, and granola</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">Kid-friendly</span>
                                <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Veg</span>
                              </div>
                            </div>
                            
                            {/* Lunch */}
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <div className="flex justify-between items-center">
                                <h4 className="text-gray-500 font-medium">LUNCH</h4>
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  15 min
                                </span>
                              </div>
                              <h3 className="text-xl font-bold mt-1">Mediterranean Chickpea Bowl</h3>
                              <p className="text-gray-600 mt-1">Chickpeas, cucumber, tomato, feta, and olive oil</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">Make ahead</span>
                                <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Veg</span>
                              </div>
                            </div>
                            
                            {/* Dinner */}
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <div className="flex justify-between items-center">
                                <h4 className="text-gray-500 font-medium">DINNER</h4>
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  20 min
                                </span>
                              </div>
                              <h3 className="text-xl font-bold mt-1">Sheet Pan Chicken & Veggies</h3>
                              <p className="text-gray-600 mt-1">Chicken breast, bell peppers, broccoli, and olive oil</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">Kid-friendly</span>
                                <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-xs font-medium">One pan</span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping List</h2>
              
              {shoppingList ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <div className="bg-indigo-50 px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Items to Buy
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Based on your weekly meal plan
                    </p>
                  </div>
                  <div className="border-t border-gray-200">
                    {shoppingList.error ? (
                      <p className="px-4 py-5 sm:px-6 text-red-600">
                        {shoppingList.error}
                      </p>
                    ) : shoppingList.categories && shoppingList.categories.length > 0 ? (
                      <div className="divide-y divide-gray-200">
                        {shoppingList.categories.map((category, index) => (
                          <div key={index} className="px-4 py-5 sm:px-6">
                            <h4 className="text-md font-medium text-gray-900 mb-3">{category.name}</h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {category.items.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-3 text-gray-700">
                                    {item.name} <span className="text-gray-500">({item.quantity})</span>
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="px-4 py-5 sm:px-6 text-gray-700">
                        Your shopping list would be displayed here, generated by the Gemini API.
                        This is a placeholder since we're currently running the application locally.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-white shadow sm:rounded-lg">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No shopping list yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Generate a meal plan first to see your shopping list
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab('plan')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Create Meal Plan
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default MealPlanner
