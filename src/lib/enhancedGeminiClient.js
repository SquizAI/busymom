import { GoogleGenerativeAI } from '@google/generative-ai';

// Access the API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_PRO = import.meta.env.AI_GEMINI_MODEL_PRO || 'gemini-2.5-pro';
const MODEL_FLASH = import.meta.env.AI_GEMINI_MODEL_FLASH || 'gemini-2.5-flash';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Get the appropriate Gemini model based on user subscription tier
 * @param {boolean} isPremium - Whether the user has a premium subscription
 * @returns {Object} - Gemini model instance
 */
export const getGeminiModel = (isPremium = false) => {
  return genAI.getGenerativeModel({ 
    model: isPremium ? MODEL_PRO : MODEL_FLASH 
  });
};

/**
 * Generate meal recommendations with structured output based on user tier
 * @param {Object} preferences - User meal preferences
 * @param {Object} userProfile - Additional user profile data
 * @param {boolean} isPremium - Whether user has premium subscription
 * @returns {Object} - Structured meal plan
 */
export const generateEnhancedMealRecommendations = async (preferences, userProfile = {}, isPremium = false) => {
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
      return getFallbackMealPlan(isPremium);
    }

    const model = getGeminiModel(isPremium);
    
    // Basic prompt for free tier
    let promptText = `Generate a personalized weekly meal plan for a busy woman with the following preferences:
    - Dietary restrictions: ${safePreferences.dietaryRestrictions}
    - Allergies: ${safePreferences.allergies}
    - Calorie target: ${safePreferences.calorieTarget}
    - Cooking time limit: ${safePreferences.cookingTimeLimit}
    - Preferred cuisine types: ${safePreferences.cuisineTypes}
    
    Create a complete 7-day meal plan with breakfast, lunch, and dinner for each day of the week (Monday through Sunday).`;
    
    // Enhanced prompt for premium tier
    if (isPremium) {
      promptText += `\n\nAs a premium user, please also include:
      - Detailed nutritional information (calories, protein, carbs, fat)
      - Step-by-step preparation instructions
      - Alternative ingredient suggestions for common allergies
      - Meal prep tips to save time
      - Pairing suggestions for complete nutrition
      
      Consider these additional factors from their profile:
      - Previous meal ratings: ${userProfile.mealRatings || 'Not available'}
      - Health goals: ${userProfile.healthGoals || 'Not specified'}
      - Activity level: ${userProfile.activityLevel || 'Moderate'}
      - Household size: ${userProfile.householdSize || '1'}`;
    }
    
    // Define the meal plan schema based on user tier
    const mealSchema = {
      type: "OBJECT",
      properties: {
        days: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              day: { type: "STRING" },
              meals: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    type: { type: "STRING" },
                    name: { type: "STRING" },
                    description: { type: "STRING" },
                    prepTime: { type: "NUMBER" },
                    tags: {
                      type: "ARRAY",
                      items: { type: "STRING" }
                    },
                    ingredients: {
                      type: "ARRAY",
                      items: { type: "STRING" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
    
    // Add premium properties to schema if user is premium
    if (isPremium) {
      mealSchema.properties.days.items.properties.meals.items.properties.calories = { type: "NUMBER" };
      mealSchema.properties.days.items.properties.meals.items.properties.macros = {
        type: "OBJECT",
        properties: {
          protein: { type: "NUMBER" },
          carbs: { type: "NUMBER" },
          fat: { type: "NUMBER" }
        }
      };
      mealSchema.properties.days.items.properties.meals.items.properties.instructions = {
        type: "ARRAY",
        items: { type: "STRING" }
      };
      mealSchema.properties.days.items.properties.meals.items.properties.alternatives = {
        type: "ARRAY",
        items: { type: "STRING" }
      };
    }
    
    // Generate content with structured output
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: promptText }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: isPremium ? 8192 : 4096,
      },
      systemInstruction: {
        text: "You are a professional nutritionist and meal planning expert specializing in creating practical, delicious meal plans for busy women."
      },
      tools: [{
        functionDeclarations: [{
          name: "createMealPlan",
          description: "Creates a structured meal plan based on user preferences",
          parameters: mealSchema
        }]
      }]
    });
    
    // Process the response
    const response = await result.response;
    const functionCalls = response.functionCalls();
    
    if (functionCalls && functionCalls.length > 0) {
      // Extract structured data from function call
      const mealPlanData = JSON.parse(functionCalls[0].args.days);
      return { days: mealPlanData };
    } else {
      // Fallback to text parsing if function call fails
      const text = response.text();
      
      // Parse the JSON response
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        try {
          const mealPlan = JSON.parse(jsonMatch[1] || jsonMatch[0]);
          
          // Validate the structure of the response
          if (!mealPlan.days || !Array.isArray(mealPlan.days)) {
            console.error("Invalid meal plan structure:", mealPlan);
            return getFallbackMealPlan(isPremium);
          }
          
          return mealPlan;
        } catch (e) {
          console.error("Error parsing JSON from Gemini response:", e);
          return getFallbackMealPlan(isPremium);
        }
      }
      
      console.error("No valid JSON found in response");
      return getFallbackMealPlan(isPremium);
    }
  } catch (error) {
    console.error("Error generating meal recommendations:", error);
    return getFallbackMealPlan(isPremium);
  }
};

/**
 * Generate a smart shopping list with structured output
 * @param {Object} mealPlan - The meal plan to generate shopping list from
 * @param {Object} pantryInventory - User's current pantry inventory
 * @param {boolean} isPremium - Whether user has premium subscription
 * @returns {Object} - Structured shopping list
 */
export const generateSmartShoppingList = async (mealPlan, pantryInventory = {}, isPremium = false) => {
  try {
    const model = getGeminiModel(isPremium);
    
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
    
    // Basic prompt for free tier
    let promptText = `Generate a consolidated shopping list for the following ingredients:
    ${JSON.stringify(allIngredients)}
    
    Please organize the shopping list by:
    1. Produce
    2. Meat and Seafood
    3. Dairy and Eggs
    4. Pantry Items
    5. Spices and Herbs
    6. Other
    
    For each item, specify the quantity needed. Combine similar items and adjust quantities accordingly.`;
    
    // Enhanced prompt for premium tier
    if (isPremium && Object.keys(pantryInventory).length > 0) {
      promptText += `\n\nAs a premium user, please also:
      - Consider these items already in their pantry: ${JSON.stringify(pantryInventory)}
      - Suggest budget-friendly alternatives where appropriate
      - Estimate approximate cost for each item
      - Group items by store section for efficient shopping
      - Suggest which store would have the best prices for each category`;
    }
    
    // Define shopping list schema
    const shoppingListSchema = {
      type: "OBJECT",
      properties: {
        categories: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              items: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    name: { type: "STRING" },
                    quantity: { type: "STRING" }
                  }
                }
              }
            }
          }
        }
      }
    };
    
    // Add premium properties to schema if user is premium
    if (isPremium) {
      shoppingListSchema.properties.categories.items.properties.items.items.properties.estimatedCost = { type: "STRING" };
      shoppingListSchema.properties.categories.items.properties.items.items.properties.alternatives = { 
        type: "ARRAY", 
        items: { type: "STRING" } 
      };
      shoppingListSchema.properties.categories.items.properties.recommendedStore = { type: "STRING" };
      shoppingListSchema.properties.totalEstimatedCost = { type: "STRING" };
    }
    
    // Generate content with structured output
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: promptText }]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: isPremium ? 4096 : 2048,
      },
      tools: [{
        functionDeclarations: [{
          name: "createShoppingList",
          description: "Creates a structured shopping list based on ingredients",
          parameters: shoppingListSchema
        }]
      }]
    });
    
    // Process the response
    const response = await result.response;
    const functionCalls = response.functionCalls();
    
    if (functionCalls && functionCalls.length > 0) {
      // Extract structured data from function call
      return JSON.parse(functionCalls[0].args);
    } else {
      // Fallback to text parsing if function call fails
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
    }
  } catch (error) {
    console.error("Error generating shopping list:", error);
    return { error: error.message || "Failed to generate shopping list" };
  }
};

/**
 * Generate personalized nutrition insights for premium users
 * @param {Object} mealHistory - User's meal history
 * @param {Object} healthGoals - User's health goals
 * @returns {Object} - Structured nutrition insights
 */
export const generateNutritionInsights = async (mealHistory, healthGoals) => {
  try {
    const model = getGeminiModel(true); // Always use premium model for this feature
    
    const promptText = `As a professional nutritionist, analyze this user's meal history and provide personalized nutrition insights:
    
    Meal History: ${JSON.stringify(mealHistory)}
    
    Health Goals: ${JSON.stringify(healthGoals)}
    
    Please provide:
    1. Nutritional analysis of their eating patterns
    2. Alignment with their health goals
    3. Specific recommendations for improvement
    4. Suggested nutrient focus areas
    5. Weekly nutrition targets`;
    
    // Define nutrition insights schema
    const insightsSchema = {
      type: "OBJECT",
      properties: {
        nutritionalAnalysis: {
          type: "OBJECT",
          properties: {
            calorieBalance: { type: "STRING" },
            macroDistribution: {
              type: "OBJECT",
              properties: {
                protein: { type: "STRING" },
                carbs: { type: "STRING" },
                fat: { type: "STRING" }
              }
            },
            micronutrients: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  nutrient: { type: "STRING" },
                  status: { type: "STRING" }
                }
              }
            }
          }
        },
        goalAlignment: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              goal: { type: "STRING" },
              status: { type: "STRING" },
              recommendations: { type: "STRING" }
            }
          }
        },
        improvementAreas: {
          type: "ARRAY",
          items: { type: "STRING" }
        },
        nutrientFocusAreas: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              nutrient: { type: "STRING" },
              reason: { type: "STRING" },
              foodSources: {
                type: "ARRAY",
                items: { type: "STRING" }
              }
            }
          }
        },
        weeklyTargets: {
          type: "OBJECT",
          properties: {
            calories: { type: "STRING" },
            protein: { type: "STRING" },
            carbs: { type: "STRING" },
            fat: { type: "STRING" },
            fiber: { type: "STRING" },
            water: { type: "STRING" }
          }
        }
      }
    };
    
    // Generate content with structured output
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: promptText }]
      }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 8192,
      },
      tools: [{
        functionDeclarations: [{
          name: "createNutritionInsights",
          description: "Creates structured nutrition insights based on meal history and health goals",
          parameters: insightsSchema
        }]
      }]
    });
    
    // Process the response
    const response = await result.response;
    const functionCalls = response.functionCalls();
    
    if (functionCalls && functionCalls.length > 0) {
      // Extract structured data from function call
      return JSON.parse(functionCalls[0].args);
    } else {
      // Fallback to text parsing if function call fails
      const text = response.text();
      
      // Parse the JSON response
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } catch (e) {
          console.error("Error parsing JSON from Gemini response:", e);
          return { error: "Failed to parse nutrition insights", rawResponse: text };
        }
      }
      
      return { error: "No valid JSON found in response", rawResponse: text };
    }
  } catch (error) {
    console.error("Error generating nutrition insights:", error);
    return { error: error.message || "Failed to generate nutrition insights" };
  }
};

/**
 * Fallback meal plan data for when the API fails
 * @param {boolean} isPremium - Whether to return premium or basic fallback data
 * @returns {Object} - Fallback meal plan
 */
const getFallbackMealPlan = (isPremium = false) => {
  const basicPlan = {
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
      }
    ]
  };
  
  // For premium users, add additional data
  if (isPremium) {
    basicPlan.days[0].meals.forEach(meal => {
      meal.calories = meal.type === "breakfast" ? 350 : meal.type === "lunch" ? 450 : 550;
      meal.macros = {
        protein: meal.type === "breakfast" ? 15 : meal.type === "lunch" ? 20 : 30,
        carbs: meal.type === "breakfast" ? 40 : meal.type === "lunch" ? 45 : 35,
        fat: meal.type === "breakfast" ? 12 : meal.type === "lunch" ? 15 : 18
      };
      meal.instructions = [
        "Gather all ingredients",
        "Prepare ingredients as needed",
        "Combine and serve"
      ];
      meal.alternatives = [
        "For dairy-free: Use coconut yogurt",
        "For gluten-free: Use gluten-free granola"
      ];
    });
  }
  
  return basicPlan;
};

export default {
  getGeminiModel,
  generateEnhancedMealRecommendations,
  generateSmartShoppingList,
  generateNutritionInsights
};
