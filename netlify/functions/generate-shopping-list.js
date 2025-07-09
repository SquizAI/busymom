const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const { mealPlan, userTier = 'free', pantryItems = [] } = JSON.parse(event.body);

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const modelName = userTier === 'free' ? 'gemini-2.0-flash-exp' : 'gemini-1.5-pro';
    const model = genAI.getGenerativeModel({ model: modelName });

    // Extract all ingredients from meal plan
    let allIngredients = [];
    if (mealPlan && mealPlan.days) {
      mealPlan.days.forEach(day => {
        day.meals.forEach(meal => {
          allIngredients = [...allIngredients, ...meal.ingredients];
        });
      });
    }

    let prompt = `Generate a shopping list from these ingredients:
    ${JSON.stringify(allIngredients)}
    
    ${pantryItems.length > 0 ? `Items already in pantry: ${pantryItems.join(', ')}` : ''}
    
    Organize by store sections and combine quantities.
    ${userTier === 'premium' || userTier === 'premiumPlus' ? 'Include estimated costs for each item.' : ''}
    
    Format as JSON:
    {
      "categories": [
        {
          "name": "Produce",
          "items": [
            { 
              "name": "Tomatoes", 
              "quantity": "2 lbs",
              "checked": false${userTier === 'premium' || userTier === 'premiumPlus' ? ',\n              "estimatedCost": 3.99' : ''}
            }
          ]
        }
      ]${userTier === 'premium' || userTier === 'premiumPlus' ? ',\n      "totalEstimatedCost": 75.50,\n      "savingsTips": ["Buy chicken in bulk", "Frozen vegetables are cheaper"]' : ''}
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        const shoppingList = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, shoppingList })
        };
      } catch (e) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ success: false, error: 'Failed to parse shopping list' })
        };
      }
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'No valid shopping list generated' })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message || 'Internal server error' })
    };
  }
};