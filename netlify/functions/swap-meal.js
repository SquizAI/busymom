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
    const { currentMeal, preferences, userTier = 'basic' } = JSON.parse(event.body);

    // Free tier cannot swap meals
    if (userTier === 'free') {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Meal swapping requires Basic tier or higher' 
        })
      };
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    // Always use Flash for quick swaps
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `Suggest an alternative meal to replace:
    ${JSON.stringify(currentMeal)}
    
    Requirements:
    - Similar nutrition profile
    - Same meal type (${currentMeal.type})
    - Prep time under ${currentMeal.prepTime + 5} minutes
    - Match these preferences: ${JSON.stringify(preferences)}
    
    Format as JSON with same structure as original meal.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        const meal = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, meal })
        };
      } catch (e) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ success: false, error: 'Failed to parse meal swap' })
        };
      }
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'No valid meal generated' })
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