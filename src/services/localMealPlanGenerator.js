import { GoogleGenerativeAI } from '@google/generative-ai';

// Local meal plan generator for development
// This bypasses Netlify functions and calls Gemini API directly

const buildMealPlanPrompt = (preferences, userTier) => {
  const { dietaryRestrictions = [], allergies = [], cuisineTypes = [], familySize = 4, cookingTimeLimit = 30, kidFriendly = false, budget = 150 } = preferences;
  
  const mealsPerDay = userTier === 'free' ? 1 : 3;
  const daysToGenerate = userTier === 'free' ? 1 : 7;
  
  return `Create a ${daysToGenerate}-day meal plan with ${mealsPerDay} meals per day (breakfast, lunch, dinner) for a family of ${familySize}.

REQUIREMENTS:
- Dietary restrictions: ${dietaryRestrictions.length > 0 ? dietaryRestrictions.join(', ') : 'None'}
- Allergies to avoid: ${allergies.length > 0 ? allergies.join(', ') : 'None'}
- Preferred cuisines: ${cuisineTypes.length > 0 ? cuisineTypes.join(', ') : 'Various'}
- Maximum cooking time: ${cookingTimeLimit} minutes per meal
- Kid-friendly meals: ${kidFriendly ? 'Yes' : 'No'}
- Weekly budget: $${budget}
- Family size: ${familySize} people

Return the meal plan as JSON with this exact structure:
{
  "days": [
    {
      "day": "Monday",
      "meals": [
        {
          "type": "breakfast",
          "name": "Meal Name",
          "description": "Brief appetizing description",
          "ingredients": [
            {"name": "ingredient1", "amount": "2 cups", "category": "produce"},
            {"name": "ingredient2", "amount": "1 lb", "category": "protein"}
          ],
          "instructions": [
            "Step 1: Detailed instruction",
            "Step 2: Next step with specific timing",
            "Step 3: Final step"
          ],
          "prepTime": 15,
          "cookTime": 10,
          "servings": ${familySize},
          "nutrition": {
            "calories": 350,
            "protein": 15,
            "carbs": 45,
            "fat": 12
          },
          "tags": ["quick", "easy"],
          "mealPrepTips": "Can be prepped ahead tip",
          "kidFriendlyTips": "How to make it kid-friendly",
          "leftoverIdeas": "What to do with leftovers"
        }
      ]
    }
  ]
}

Important:
- Each meal should be unique and practical
- Include nutritional information
- Consider the dietary restrictions and allergies strictly
- Keep within the cooking time limit
- Return ONLY valid JSON, no additional text`;
};

// Generate a fallback meal plan if API fails
const generateFallbackMealPlan = (preferences, userTier) => {
  const { familySize = 4 } = preferences;
  const days = userTier === 'free' ? ['Monday'] : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const sampleMeals = {
    breakfast: [
      {
        name: "Overnight Oats with Berries",
        description: "Creamy oats with fresh berries and honey",
        ingredients: [
          {name: "rolled oats", amount: "1/2 cup", category: "grains"},
          {name: "milk", amount: "1 cup", category: "dairy"},
          {name: "mixed berries", amount: "1/2 cup", category: "produce"},
          {name: "honey", amount: "1 tbsp", category: "pantry"},
          {name: "chia seeds", amount: "1 tsp", category: "pantry"}
        ],
        instructions: [
          "Mix oats, milk, and chia seeds in a jar or container",
          "Add honey and stir well",
          "Cover and refrigerate overnight",
          "Top with fresh berries before serving"
        ],
        prepTime: 5,
        cookTime: 0,
        nutrition: { calories: 350, protein: 12, carbs: 58, fat: 8 },
        mealPrepTips: "Make 5 jars on Sunday for the whole week",
        kidFriendlyTips: "Let kids choose their own berry toppings",
        leftoverIdeas: "Add to smoothies or yogurt parfaits"
      },
      {
        name: "Scrambled Eggs with Toast",
        description: "Fluffy scrambled eggs with whole grain toast",
        ingredients: [
          {name: "eggs", amount: "2 per person", category: "protein"},
          {name: "butter", amount: "1 tbsp", category: "dairy"},
          {name: "whole grain bread", amount: "2 slices per person", category: "grains"},
          {name: "salt", amount: "to taste", category: "pantry"},
          {name: "pepper", amount: "to taste", category: "pantry"}
        ],
        instructions: [
          "Crack eggs into a bowl and whisk until well combined",
          "Heat butter in a non-stick pan over medium-low heat",
          "Pour eggs into pan and gently stir with a spatula",
          "Cook until eggs are just set but still creamy",
          "Toast bread and serve alongside eggs"
        ],
        prepTime: 5,
        cookTime: 10,
        nutrition: { calories: 320, protein: 20, carbs: 28, fat: 14 },
        mealPrepTips: "Pre-whisk eggs the night before",
        kidFriendlyTips: "Add cheese for extra appeal",
        leftoverIdeas: "Make egg sandwiches for lunch"
      }
    ],
    lunch: [
      {
        name: "Chicken Caesar Salad",
        description: "Crisp romaine with grilled chicken and Caesar dressing",
        ingredients: [
          {name: "romaine lettuce", amount: "2 cups", category: "produce"},
          {name: "grilled chicken breast", amount: "4 oz per person", category: "protein"},
          {name: "parmesan cheese", amount: "1/4 cup", category: "dairy"},
          {name: "croutons", amount: "1/2 cup", category: "grains"},
          {name: "caesar dressing", amount: "3 tbsp", category: "condiments"}
        ],
        instructions: [
          "Wash and chop romaine lettuce into bite-sized pieces",
          "Grill chicken breasts with salt and pepper until cooked through",
          "Let chicken rest 5 minutes, then slice into strips",
          "Toss lettuce with dressing, top with chicken, cheese, and croutons"
        ],
        prepTime: 10,
        cookTime: 15,
        nutrition: { calories: 450, protein: 35, carbs: 20, fat: 25 },
        mealPrepTips: "Grill extra chicken for the week",
        kidFriendlyTips: "Serve dressing on the side",
        leftoverIdeas: "Wrap in a tortilla for lunch tomorrow"
      },
      {
        name: "Vegetable Stir Fry",
        description: "Colorful vegetables with soy-ginger sauce",
        ingredients: [
          {name: "mixed vegetables", amount: "3 cups", category: "produce"},
          {name: "soy sauce", amount: "3 tbsp", category: "condiments"},
          {name: "fresh ginger", amount: "1 tbsp minced", category: "produce"},
          {name: "garlic", amount: "2 cloves minced", category: "produce"},
          {name: "rice", amount: "1.5 cups uncooked", category: "grains"},
          {name: "vegetable oil", amount: "2 tbsp", category: "pantry"}
        ],
        instructions: [
          "Cook rice according to package directions",
          "Heat oil in a large wok or skillet over high heat",
          "Add garlic and ginger, stir-fry for 30 seconds",
          "Add vegetables and stir-fry for 5-7 minutes until crisp-tender",
          "Add soy sauce and toss to coat, serve over rice"
        ],
        prepTime: 10,
        cookTime: 15,
        nutrition: { calories: 380, protein: 12, carbs: 65, fat: 8 },
        mealPrepTips: "Pre-cut vegetables on Sunday",
        kidFriendlyTips: "Let kids pick their favorite vegetables",
        leftoverIdeas: "Add scrambled eggs for fried rice"
      }
    ],
    dinner: [
      {
        name: "Baked Salmon with Vegetables",
        description: "Herb-crusted salmon with roasted seasonal vegetables",
        ingredients: [
          {name: "salmon fillets", amount: "6 oz per person", category: "protein"},
          {name: "mixed vegetables", amount: "2 cups", category: "produce"},
          {name: "olive oil", amount: "3 tbsp", category: "pantry"},
          {name: "dried herbs", amount: "2 tsp", category: "pantry"},
          {name: "lemon", amount: "1 whole", category: "produce"},
          {name: "salt and pepper", amount: "to taste", category: "pantry"}
        ],
        instructions: [
          "Preheat oven to 400°F (200°C)",
          "Place salmon on a baking sheet, drizzle with 1 tbsp olive oil",
          "Season with herbs, salt, pepper, and lemon juice",
          "Toss vegetables with remaining oil and seasonings",
          "Bake salmon and vegetables for 20-25 minutes until salmon flakes easily"
        ],
        prepTime: 10,
        cookTime: 25,
        nutrition: { calories: 520, protein: 38, carbs: 25, fat: 28 },
        mealPrepTips: "Marinate salmon in the morning for extra flavor",
        kidFriendlyTips: "Serve with their favorite dipping sauce",
        leftoverIdeas: "Flake into salads or make salmon patties"
      },
      {
        name: "Spaghetti Bolognese",
        description: "Classic Italian pasta with meat sauce",
        ingredients: [
          {name: "spaghetti", amount: "1 lb", category: "grains"},
          {name: "ground beef", amount: "1 lb", category: "protein"},
          {name: "tomato sauce", amount: "24 oz", category: "pantry"},
          {name: "onion", amount: "1 medium diced", category: "produce"},
          {name: "garlic", amount: "3 cloves minced", category: "produce"},
          {name: "Italian seasoning", amount: "2 tsp", category: "pantry"}
        ],
        instructions: [
          "Cook spaghetti according to package directions",
          "Brown ground beef in a large skillet, breaking into small pieces",
          "Add onion and garlic, cook until softened",
          "Add tomato sauce and Italian seasoning, simmer 15 minutes",
          "Serve sauce over drained spaghetti"
        ],
        prepTime: 10,
        cookTime: 20,
        nutrition: { calories: 580, protein: 28, carbs: 72, fat: 18 },
        mealPrepTips: "Make double sauce and freeze half",
        kidFriendlyTips: "Hide veggies in the sauce",
        leftoverIdeas: "Use for spaghetti pie or stuffed peppers"
      }
    ]
  };

  return {
    days: days.map(day => ({
      day,
      meals: ['breakfast', 'lunch', 'dinner'].map(type => ({
        type,
        ...sampleMeals[type][Math.floor(Math.random() * sampleMeals[type].length)],
        servings: familySize,
        tags: ['quick', 'easy', 'family-friendly']
      }))
    }))
  };
};

export const generateLocalMealPlan = async (preferences, userTier = 'free') => {
  try {
    // Get API key from environment
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!API_KEY) {
      throw new Error('Missing VITE_GEMINI_API_KEY in environment variables');
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Select model based on tier
    const modelName = (userTier === 'free' || userTier === 'basic') 
      ? 'gemini-2.0-flash-exp' 
      : 'gemini-1.5-pro';
    
    const model = genAI.getGenerativeModel({ model: modelName });

    // Build prompt
    const prompt = buildMealPlanPrompt(preferences, userTier);

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from response
    let jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    let jsonText = jsonMatch ? jsonMatch[1] : text;
    
    // Try to extract JSON object if no code block found
    if (!jsonMatch) {
      const startIdx = jsonText.indexOf('{');
      const endIdx = jsonText.lastIndexOf('}');
      if (startIdx !== -1 && endIdx !== -1) {
        jsonText = jsonText.substring(startIdx, endIdx + 1);
      }
    }
    
    try {
      // Clean up common JSON issues
      jsonText = jsonText
        .replace(/,\s*}/g, '}') // Remove trailing commas in objects
        .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
        .replace(/'/g, '"') // Replace single quotes with double quotes
        .replace(/\n/g, ' ') // Remove newlines that might break JSON
        .replace(/\s+/g, ' '); // Normalize whitespace
      
      let mealPlan = JSON.parse(jsonText);
      
      // Apply tier restrictions
      if (userTier === 'free') {
        // Only return 3 meals (1 day)
        mealPlan.days = mealPlan.days.slice(0, 1);
      }
      
      return { 
        success: true, 
        mealPlan,
        model: modelName 
      };
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Attempted to parse:', jsonText.substring(0, 200) + '...');
      
      // Fallback: return a simple meal plan
      return {
        success: true,
        mealPlan: generateFallbackMealPlan(preferences, userTier),
        model: 'fallback'
      };
    }

    return { 
      success: false, 
      error: 'No valid meal plan generated' 
    };

  } catch (error) {
    console.error('Local meal generation error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to generate meal plan' 
    };
  }
};