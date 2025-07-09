const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    // Parse request body
    const { preferences, userTier = 'free' } = JSON.parse(event.body);

    // Validate API key
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      console.error('Missing GEMINI_API_KEY');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Select model based on tier
    const modelName = (userTier === 'free' || userTier === 'basic') 
      ? 'gemini-2.0-flash-exp' 
      : 'gemini-1.5-pro';
    
    const model = genAI.getGenerativeModel({ model: modelName });

    // Build prompt based on tier
    const prompt = buildMealPlanPrompt(preferences, userTier);

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        let mealPlan = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        
        // Apply tier restrictions
        if (userTier === 'free') {
          // Only return 3 meals (1 day)
          mealPlan.days = mealPlan.days.slice(0, 1);
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            mealPlan,
            model: modelName 
          })
        };
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ 
            success: false, 
            error: 'Failed to parse meal plan' 
          })
        };
      }
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: 'No valid meal plan generated' 
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      })
    };
  }
};

function buildMealPlanPrompt(preferences, userTier) {
  const safePreferences = {
    dietaryRestrictions: preferences?.dietaryRestrictions || [],
    allergies: preferences?.allergies || [],
    calorieTarget: preferences?.calorieTarget || null,
    cookingTimeLimit: preferences?.cookingTimeLimit || 30,
    cuisineTypes: preferences?.cuisineTypes || [],
    familySize: preferences?.familySize || 2,
    kidFriendly: preferences?.kidFriendly || false,
    budget: preferences?.budget || null
  };

  // Tier-based dietary restriction limits
  const dietaryLimits = {
    free: 1,
    basic: 3,
    premium: 5,
    premiumPlus: 999
  };

  const maxDietary = dietaryLimits[userTier] || 1;
  const limitedDietary = safePreferences.dietaryRestrictions.slice(0, maxDietary);

  let basePrompt = `Generate a meal plan for a busy woman with the following requirements:
  - Dietary restrictions: ${limitedDietary.join(', ') || 'None'}
  - Allergies: ${safePreferences.allergies.join(', ') || 'None'}
  - Cooking time limit: ${safePreferences.cookingTimeLimit} minutes
  - Family size: ${safePreferences.familySize} people`;

  // Add tier-specific requirements
  if (userTier === 'free') {
    basePrompt += `
    
    Create exactly 3 meals (breakfast, lunch, dinner) for ONE day only.
    Focus on simple, quick recipes that require minimal ingredients.`;
  } else if (userTier === 'basic') {
    basePrompt += `
    - Preferred cuisines: ${safePreferences.cuisineTypes.join(', ') || 'Any'}
    
    Create a complete 7-day meal plan with breakfast, lunch, and dinner.
    Include variety to avoid repetition and consider meal prep opportunities.`;
  } else if (userTier === 'premium' || userTier === 'premiumPlus') {
    basePrompt += `
    - Preferred cuisines: ${safePreferences.cuisineTypes.join(', ') || 'Any'}
    - Kid-friendly required: ${safePreferences.kidFriendly ? 'Yes' : 'No'}
    - Budget per week: ${safePreferences.budget ? `$${safePreferences.budget}` : 'Not specified'}
    - Calorie target: ${safePreferences.calorieTarget || 'Not specified'}
    
    Create a complete 7-day meal plan with nutritional information.
    ${safePreferences.kidFriendly ? 'Include kid-friendly options with hidden vegetables.' : ''}
    Suggest meal prep strategies and leftover usage.
    Include seasonal ingredients when possible.`;
  }

  basePrompt += `
    
    Format the response as JSON with this structure:
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
              "cookTime": 10,
              "servings": ${safePreferences.familySize},
              "tags": ["tag1", "tag2"],
              "ingredients": [
                { "name": "ingredient1", "amount": "1 cup", "category": "produce" }
              ]${userTier !== 'free' ? ',\n              "nutrition": { "calories": 350, "protein": 20, "carbs": 45, "fat": 12 }' : ''}${userTier === 'premium' || userTier === 'premiumPlus' ? ',\n              "kidFriendlyTips": "How to make it appealing to kids",\n              "mealPrepTips": "Can be prepped ahead",\n              "leftoverIdeas": "Use leftovers for tomorrow\'s lunch"' : ''}
            }
          ]
        }
      ]${userTier === 'premium' || userTier === 'premiumPlus' ? ',\n      "weeklyNutrition": { "avgCalories": 1800, "avgProtein": 75, "avgCarbs": 200, "avgFat": 65 },\n      "mealPrepPlan": "Sunday prep suggestions",\n      "estimatedCost": 150' : ''}
    }`;

  return basePrompt;
}