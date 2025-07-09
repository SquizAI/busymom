// Test script for Netlify functions
// Run with: node test-functions.js

const testFunctions = async () => {
  const BASE_URL = 'http://localhost:8888/.netlify/functions';
  
  console.log('🧪 Testing Netlify Functions...\n');
  
  // Test 1: Generate Meal Plan (Free Tier)
  console.log('1️⃣ Testing meal plan generation (Free tier)...');
  try {
    const mealPlanResponse = await fetch(`${BASE_URL}/generate-meal-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        preferences: {
          dietaryRestrictions: ['vegetarian'],
          cookingTimeLimit: 30,
          familySize: 2
        },
        userTier: 'free'
      })
    });
    
    const mealPlanData = await mealPlanResponse.json();
    console.log('✅ Meal plan generated:', mealPlanData.success ? 'Success' : 'Failed');
    if (mealPlanData.mealPlan) {
      console.log(`   - Days: ${mealPlanData.mealPlan.days.length}`);
      console.log(`   - Meals per day: ${mealPlanData.mealPlan.days[0]?.meals.length || 0}`);
      console.log(`   - Model used: ${mealPlanData.model}\n`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message, '\n');
  }
  
  // Test 2: Generate Meal Plan (Premium Tier)
  console.log('2️⃣ Testing meal plan generation (Premium tier)...');
  try {
    const premiumResponse = await fetch(`${BASE_URL}/generate-meal-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        preferences: {
          dietaryRestrictions: ['gluten-free', 'dairy-free'],
          cookingTimeLimit: 45,
          familySize: 4,
          kidFriendly: true,
          budget: 200
        },
        userTier: 'premium'
      })
    });
    
    const premiumData = await premiumResponse.json();
    console.log('✅ Premium meal plan generated:', premiumData.success ? 'Success' : 'Failed');
    if (premiumData.mealPlan) {
      console.log(`   - Includes nutrition: ${premiumData.mealPlan.days[0]?.meals[0]?.nutrition ? 'Yes' : 'No'}`);
      console.log(`   - Model used: ${premiumData.model}\n`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message, '\n');
  }
  
  // Test 3: Generate Shopping List
  console.log('3️⃣ Testing shopping list generation...');
  try {
    const shoppingResponse = await fetch(`${BASE_URL}/generate-shopping-list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mealPlan: {
          days: [{
            day: 'Monday',
            meals: [{
              ingredients: [
                { name: 'chicken breast', amount: '1 lb' },
                { name: 'broccoli', amount: '2 cups' }
              ]
            }]
          }]
        },
        userTier: 'basic',
        pantryItems: ['olive oil', 'salt']
      })
    });
    
    const shoppingData = await shoppingResponse.json();
    console.log('✅ Shopping list generated:', shoppingData.success ? 'Success' : 'Failed');
    if (shoppingData.shoppingList) {
      console.log(`   - Categories: ${shoppingData.shoppingList.categories?.length || 0}\n`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message, '\n');
  }
  
  // Test 4: Meal Swap (should fail for free tier)
  console.log('4️⃣ Testing meal swap (Free tier - should fail)...');
  try {
    const swapResponse = await fetch(`${BASE_URL}/swap-meal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentMeal: {
          type: 'breakfast',
          name: 'Oatmeal',
          prepTime: 10
        },
        preferences: {},
        userTier: 'free'
      })
    });
    
    const swapData = await swapResponse.json();
    console.log('✅ Swap response:', swapResponse.status === 403 ? 'Correctly blocked' : 'Unexpected result');
    console.log(`   - Error: ${swapData.error}\n`);
  } catch (error) {
    console.error('❌ Error:', error.message, '\n');
  }
  
  console.log('🎉 Function tests complete!');
};

// Check if running directly
testFunctions();