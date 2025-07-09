import { generateLocalMealPlan } from './localMealPlanGenerator';

// Use Netlify Functions in production, direct API in development
const API_BASE = process.env.NODE_ENV === 'production' 
  ? '/.netlify/functions'
  : 'http://localhost:8888/.netlify/functions';

// Check if we're in local development without Netlify CLI
const USE_LOCAL_GENERATOR = process.env.NODE_ENV === 'development' || !window.location.hostname.includes('netlify');

// Tier limits and features
export const TIER_LIMITS = {
  free: {
    mealsPerWeek: 3,
    dietaryPreferences: 1,
    refreshRate: 'weekly',
    groceryList: 'basic',
    features: []
  },
  basic: {
    mealsPerWeek: 21,
    dietaryPreferences: 3,
    refreshRate: 'daily',
    groceryList: 'organized',
    features: ['mealHistory', 'quickSwaps', 'pantryTracker', 'familySize']
  },
  premium: {
    mealsPerWeek: 21,
    dietaryPreferences: 5,
    refreshRate: 'unlimited',
    groceryList: 'smart',
    features: ['mealHistory', 'quickSwaps', 'pantryTracker', 'familySize', 'nutritionAnalysis', 'kidFriendly', 'mealPrep', 'budgetTracker', 'substitutions', 'leftoverIdeas', 'seasonalMenus', 'familyProfiles']
  },
  premiumPlus: {
    mealsPerWeek: 'unlimited',
    dietaryPreferences: 'unlimited',
    refreshRate: 'unlimited',
    groceryList: 'smart',
    features: ['mealHistory', 'quickSwaps', 'pantryTracker', 'familySize', 'nutritionAnalysis', 'kidFriendly', 'mealPrep', 'budgetTracker', 'substitutions', 'leftoverIdeas', 'seasonalMenus', 'familyProfiles', 'aiChef', 'healthGoals', 'allergyAlert', 'restaurantReplication', 'macroTracking', 'cookingProgression', 'integratedShopping', 'monthlyReports', 'recipeVideos']
  }
};

// Generate meals based on user tier
export const generateMealPlan = async (preferences, userTier = 'free') => {
  try {
    // Use local generator in development if Netlify CLI is not running
    if (USE_LOCAL_GENERATOR) {
      console.log('Using local meal plan generator...');
      return await generateLocalMealPlan(preferences, userTier);
    }

    // Otherwise use Netlify function
    const response = await fetch(`${API_BASE}/generate-meal-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ preferences, userTier })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate meal plan');
    }
    
    return data;
    
  } catch (error) {
    console.error("Error generating meal plan:", error);
    return { success: false, error: error.message };
  }
};


// Generate smart shopping list
export const generateSmartShoppingList = async (mealPlan, userTier = 'free', pantryItems = []) => {
  try {
    const response = await fetch(`${API_BASE}/generate-shopping-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mealPlan, userTier, pantryItems })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate shopping list');
    }
    
    return data;
    
  } catch (error) {
    console.error("Error generating shopping list:", error);
    console.log("Using local shopping list generator...");
    
    // Fallback to local generation
    return generateLocalShoppingList(mealPlan, pantryItems);
  }
};

// Local shopping list generator
const generateLocalShoppingList = (mealPlan, pantryItems = []) => {
  try {
    const shoppingList = [];
    const itemMap = new Map();
    
    // Aggregate ingredients from all meals
    if (mealPlan && mealPlan.days) {
      mealPlan.days.forEach(day => {
        day.meals.forEach(meal => {
          if (meal.ingredients) {
            meal.ingredients.forEach(ingredient => {
              const key = ingredient.name.toLowerCase();
              if (itemMap.has(key)) {
                const existing = itemMap.get(key);
                existing.meals.push(`${day.day} - ${meal.type}`);
              } else {
                itemMap.set(key, {
                  name: ingredient.name,
                  amount: ingredient.amount,
                  category: ingredient.category || 'other',
                  meals: [`${day.day} - ${meal.type}`]
                });
              }
            });
          }
        });
      });
    }
    
    // Convert map to array and organize by category
    const categories = {};
    itemMap.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });
    
    // Create shopping list structure
    Object.entries(categories).forEach(([category, items]) => {
      shoppingList.push({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        items: items.map(item => ({
          name: item.name,
          amount: item.amount,
          meals: item.meals,
          checked: false
        }))
      });
    });
    
    return {
      success: true,
      shoppingList,
      totalItems: itemMap.size,
      model: 'local'
    };
  } catch (error) {
    console.error("Error in local shopping list generation:", error);
    return { success: false, error: error.message };
  }
};

// Quick meal swap
export const swapMeal = async (currentMeal, preferences, userTier = 'basic') => {
  try {
    const response = await fetch(`${API_BASE}/swap-meal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentMeal, preferences, userTier })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to swap meal');
    }
    
    return data;
    
  } catch (error) {
    console.error("Error swapping meal:", error);
    return { success: false, error: error.message };
  }
};

// Get nutrition insights (Premium feature)
export const getNutritionInsights = async (mealPlan, familyProfiles = [], userTier = 'premium') => {
  try {
    const response = await fetch(`${API_BASE}/nutrition-insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mealPlan, familyProfiles, userTier })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get nutrition insights');
    }
    
    return data;
    
  } catch (error) {
    console.error("Error getting nutrition insights:", error);
    return { success: false, error: error.message };
  }
};

// Transform leftovers (Premium feature)
export const transformLeftovers = async (leftovers, preferences, userTier = 'premium') => {
  try {
    // For now, we'll handle this client-side as it's not a critical feature
    // In production, you might want to create another Netlify function for this
    
    const suggestions = [
      {
        name: "Leftover Fried Rice",
        description: "Transform any leftover proteins and veggies into delicious fried rice",
        additionalIngredients: ["Rice", "Soy sauce", "Eggs", "Green onions"],
        prepTime: 15
      },
      {
        name: "Creative Wrap or Sandwich",
        description: "Use leftovers as filling for wraps or sandwiches",
        additionalIngredients: ["Tortillas or bread", "Lettuce", "Condiments"],
        prepTime: 10
      },
      {
        name: "Hearty Soup or Stew",
        description: "Combine leftovers with broth for a comforting soup",
        additionalIngredients: ["Broth", "Pasta or rice", "Fresh herbs"],
        prepTime: 20
      }
    ];
    
    return { success: true, suggestions };
    
  } catch (error) {
    console.error("Error transforming leftovers:", error);
    return { success: false, error: error.message };
  }
};

// Generate meal alternatives for swapping
export const generateMealAlternatives = async (meal, preferences) => {
  try {
    const response = await fetch(`${API_BASE}/meal-alternatives`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ meal, preferences })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate alternatives');
    }
    
    return data.alternatives || [];
    
  } catch (error) {
    console.error("Error generating alternatives:", error);
    // Fallback to local alternatives
    return [
      {
        ...meal,
        name: `Alternative ${meal.name}`,
        description: `A delicious variation of ${meal.name}`,
        matchScore: 0.85
      },
      {
        ...meal,
        name: `Quick ${meal.name}`,
        description: `A faster version that takes half the time`,
        prepTime: Math.round(meal.prepTime / 2),
        matchScore: 0.75
      },
      {
        ...meal,
        name: `Healthy ${meal.name}`,
        description: `A lighter, healthier version`,
        calories: Math.round((meal.calories || 400) * 0.8),
        matchScore: 0.70
      }
    ];
  }
};

// Save meal to history
export const saveMealToHistory = async (meal, userId) => {
  try {
    // This would typically save to a database
    // For now, we'll use localStorage
    const history = JSON.parse(localStorage.getItem('mealHistory') || '[]');
    history.push({
      ...meal,
      id: Date.now().toString(),
      userId,
      lastUsed: new Date().toISOString(),
      rating: null,
      isFavorite: false
    });
    
    // Keep only last 100 meals
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    
    localStorage.setItem('mealHistory', JSON.stringify(history));
    return { success: true };
    
  } catch (error) {
    console.error("Error saving meal to history:", error);
    return { success: false, error: error.message };
  }
};

// Get meal history
export const getMealHistory = async (userId) => {
  try {
    const history = JSON.parse(localStorage.getItem('mealHistory') || '[]');
    return history.filter(meal => meal.userId === userId);
  } catch (error) {
    console.error("Error getting meal history:", error);
    return [];
  }
};