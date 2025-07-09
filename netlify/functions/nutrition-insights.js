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
    const { mealPlan, familyProfiles = [], userTier = 'premium' } = JSON.parse(event.body);

    // Only premium and premiumPlus can access nutrition insights
    if (userTier !== 'premium' && userTier !== 'premiumPlus') {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Nutrition insights require Premium tier or higher' 
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
    // Use Pro model for detailed nutrition analysis
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `Analyze the nutritional content of this weekly meal plan:
    ${JSON.stringify(mealPlan)}
    
    Family profiles: ${JSON.stringify(familyProfiles)}
    
    Provide:
    1. Overall nutrition assessment
    2. Macro distribution analysis
    3. Vitamin and mineral highlights
    4. Recommendations for improvement
    5. Family member specific insights
    
    Format as JSON:
    {
      "overallAssessment": {
        "score": 85,
        "summary": "Well-balanced with room for improvement",
        "strengths": ["High protein", "Good variety"],
        "weaknesses": ["Low iron", "Needs more fiber"]
      },
      "macroDistribution": {
        "protein": { "percentage": 25, "status": "optimal" },
        "carbs": { "percentage": 45, "status": "balanced" },
        "fat": { "percentage": 30, "status": "balanced" }
      },
      "micronutrients": {
        "highlights": ["Vitamin C: 150% RDA", "Calcium: 120% RDA"],
        "concerns": ["Iron: 60% RDA", "Vitamin D: 40% RDA"]
      },
      "recommendations": [
        "Add more leafy greens for iron",
        "Include fortified dairy for Vitamin D"
      ],
      "familyInsights": [
        {
          "member": "Child 1",
          "insights": ["Getting enough calcium", "May need more iron-rich foods"]
        }
      ]
    }`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        const insights = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, insights })
        };
      } catch (e) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ success: false, error: 'Failed to parse nutrition insights' })
        };
      }
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'No valid insights generated' })
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