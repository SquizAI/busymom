import { GoogleGenerativeAI } from '@google/generative-ai';

// Access the API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_PRO = import.meta.env.AI_GEMINI_MODEL_PRO || 'gemini-2.5-pro';
const MODEL_FLASH = import.meta.env.AI_GEMINI_MODEL_FLASH || 'gemini-2.5-flash';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(API_KEY);

// Get the model
export const getGeminiProModel = () => {
  return genAI.getGenerativeModel({ model: MODEL_PRO });
};

export const getGeminiFlashModel = () => {
  return genAI.getGenerativeModel({ model: MODEL_FLASH });
};

// Generate meal recommendations based on user preferences
export const generateMealRecommendations = async (preferences) => {
  // Validate preferences to prevent undefined errors
  const safePreferences = {
    dietaryRestrictions: preferences?.dietaryRestrictions || 'None',
    allergies: preferences?.allergies || 'None',
    calorieTarget: preferences?.calorieTarget || 'Not specified',
    cookingTimeLimit: preferences?.cookingTimeLimit || '15 minutes',
    cuisineTypes: preferences?.cuisineTypes?.join(', ') || 'Any'
  };

  try {
    // Check if API key is available
    if (!API_KEY) {
      console.warn("Missing Gemini API key. Using fallback meal plan data.");
      return getFallbackMealPlan();
    }

    const model = getGeminiProModel();
    
    const prompt = `Generate a personalized weekly meal plan for a busy woman with the following preferences:
    - Dietary restrictions: ${safePreferences.dietaryRestrictions}
    - Allergies: ${safePreferences.allergies}
    - Calorie target: ${safePreferences.calorieTarget}
    - Cooking time limit: ${safePreferences.cookingTimeLimit}
    - Preferred cuisine types: ${safePreferences.cuisineTypes}
    
    Create a complete 7-day meal plan with breakfast, lunch, and dinner for each day of the week (Monday through Sunday).
    
    For each meal, provide:
    1. Name of the dish
    2. Brief description
    3. Preparation time in minutes
    4. Tags (e.g., kid-friendly, vegetarian, make-ahead, one-pot, etc.)
    5. Ingredients needed
    
    Format the response as structured JSON that can be parsed by JavaScript, with this exact structure:
    {
      "days": [
        {
          "day": "Monday",
          "meals": [
            {
              "type": "breakfast",
              "name": "Meal name",
              "description": "Brief description",
              "prepTime": 15,
              "tags": ["tag1", "tag2"],
              "ingredients": ["ingredient1", "ingredient2"]
            },
            // lunch and dinner objects with same structure
          ]
        },
        // objects for other days of the week
      ]
    }
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        const mealPlan = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        
        // Validate the structure of the response
        if (!mealPlan.days || !Array.isArray(mealPlan.days)) {
          console.error("Invalid meal plan structure:", mealPlan);
          return getFallbackMealPlan();
        }
        
        return mealPlan;
      } catch (e) {
        console.error("Error parsing JSON from Gemini response:", e);
        return getFallbackMealPlan();
      }
    }
    
    console.error("No valid JSON found in response");
    return getFallbackMealPlan();
    
  } catch (error) {
    console.error("Error generating meal recommendations:", error);
    return getFallbackMealPlan();
  }
};

// Fallback meal plan data for when the API fails
const getFallbackMealPlan = () => {
  return {
    days: [
      {
        day: "Monday",
        meals: [
          {
            type: "breakfast",
            name: "Greek Yogurt Parfait",
            description: "Greek yogurt with honey, berries, and granola",
            prepTime: 5,
            tags: ["vegetarian", "kid-friendly"],
            ingredients: ["Greek yogurt", "honey", "mixed berries", "granola"]
          },
          {
            type: "lunch",
            name: "Mediterranean Chickpea Bowl",
            description: "Chickpeas, cucumber, tomato, feta, and olive oil",
            prepTime: 15,
            tags: ["vegetarian", "make-ahead"],
            ingredients: ["chickpeas", "cucumber", "tomato", "feta cheese", "olive oil"]
          },
          {
            type: "dinner",
            name: "Sheet Pan Chicken & Veggies",
            description: "Chicken breast, bell peppers, broccoli, and olive oil",
            prepTime: 20,
            tags: ["kid-friendly", "one-pan"],
            ingredients: ["chicken breast", "bell peppers", "broccoli", "olive oil", "garlic"]
          }
        ]
      },
      {
        day: "Tuesday",
        meals: [
          {
            type: "breakfast",
            name: "Avocado Toast",
            description: "Whole grain toast with mashed avocado and egg",
            prepTime: 10,
            tags: ["vegetarian", "high-protein"],
            ingredients: ["whole grain bread", "avocado", "eggs", "salt", "pepper"]
          },
          {
            type: "lunch",
            name: "Quinoa Salad",
            description: "Quinoa with roasted vegetables and lemon dressing",
            prepTime: 15,
            tags: ["vegetarian", "make-ahead"],
            ingredients: ["quinoa", "bell peppers", "zucchini", "lemon juice", "olive oil"]
          },
          {
            type: "dinner",
            name: "Baked Salmon",
            description: "Salmon fillet with lemon and herbs",
            prepTime: 25,
            tags: ["high-protein", "omega-3"],
            ingredients: ["salmon fillet", "lemon", "dill", "olive oil", "garlic"]
          }
        ]
      }
    ]
  };
};

// Get meals for a specific day
export const getMealsForDay = (mealPlan, day) => {
  if (!mealPlan) return null;
  
  // Handle both new and old meal plan structures
  if (mealPlan.days && Array.isArray(mealPlan.days)) {
    const dayData = mealPlan.days.find(d => d.day && d.day.toLowerCase() === day.toLowerCase());
    return dayData?.meals || null;
  } else if (Array.isArray(mealPlan)) {
    // Legacy format - return all meals since they're not organized by day
    return mealPlan;
  }
  
  return null;
};

// Analyze user's food preferences from past selections
export const analyzeFoodPreferences = async (mealHistory) => {
  try {
    const model = getGeminiProModel();
    
    const prompt = `Analyze the following meal selection history for a user and identify patterns, preferences, and possible recommendations:
    ${JSON.stringify(mealHistory)}
    
    Please provide:
    1. Top 3 cuisine types they seem to prefer
    2. Common ingredients they enjoy
    3. Any patterns in meal choices (e.g., preference for high-protein breakfasts)
    4. 5 personalized meal recommendations based on these preferences
    
    Format the response as structured JSON that can be parsed by JavaScript.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } catch (e) {
        console.error("Error parsing JSON from Gemini response:", e);
        return { error: "Failed to parse food preferences analysis", rawResponse: text };
      }
    }
    
    return { error: "No valid JSON found in response", rawResponse: text };
    
  } catch (error) {
    console.error("Error analyzing food preferences:", error);
    return { error: error.message || "Failed to analyze food preferences" };
  }
};

// Generate shopping list based on meal plan
export const generateShoppingList = async (mealPlan) => {
  try {
    const model = getGeminiProModel();
    
    // Extract all ingredients from the meal plan
    let allIngredients = [];
    if (mealPlan && mealPlan.days) {
      mealPlan.days.forEach(day => {
        if (day.meals) {
          day.meals.forEach(meal => {
            if (meal.ingredients && Array.isArray(meal.ingredients)) {
              allIngredients = [...allIngredients, ...meal.ingredients];
            }
          });
        }
      });
    }
    
    const prompt = `Generate a consolidated shopping list for the following ingredients:
    ${JSON.stringify(allIngredients)}
    
    Please organize the shopping list by:
    1. Produce
    2. Meat and Seafood
    3. Dairy and Eggs
    4. Pantry Items
    5. Spices and Herbs
    6. Other
    
    For each item, specify the quantity needed. Combine similar items and adjust quantities accordingly.
    Format the response as structured JSON that can be parsed by JavaScript, with this structure:
    {
      "categories": [
        {
          "name": "Produce",
          "items": [
            { "name": "Apples", "quantity": "3" },
            { "name": "Spinach", "quantity": "1 bag" }
          ]
        },
        // other categories
      ]
    }
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } catch (e) {
        console.error("Error parsing JSON from Gemini response:", e);
        return { error: "Failed to parse shopping list", rawResponse: text };
      }
    }
    
    return { error: "No valid JSON found in response", rawResponse: text };
    
  } catch (error) {
    console.error("Error generating shopping list:", error);
    return { error: error.message || "Failed to generate shopping list" };
  }
};

export default {
  getGeminiProModel,
  getGeminiFlashModel,
  generateMealRecommendations,
  analyzeFoodPreferences,
  generateShoppingList
};
