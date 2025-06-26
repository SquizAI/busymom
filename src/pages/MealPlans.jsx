import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MealPlans = () => {
  const [selectedDiet, setSelectedDiet] = useState('all');
  const [selectedMealType, setSelectedMealType] = useState('all');

  const sampleMealPlans = [
    {
      id: 1,
      name: "Quick Weeknight Dinners",
      description: "Perfect for busy weeknights when time is limited but nutrition is essential.",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      dietType: "omnivore",
      mealTypes: ["dinner"],
      prepTime: "15 min",
      meals: [
        { day: "Monday", meal: "Sheet Pan Chicken with Roasted Vegetables" },
        { day: "Tuesday", meal: "15-Minute Garlic Shrimp Stir Fry" },
        { day: "Wednesday", meal: "One Pot Pasta Primavera" },
        { day: "Thursday", meal: "Quick Beef & Broccoli Bowl" },
        { day: "Friday", meal: "Easy Fish Tacos with Slaw" }
      ]
    },
    {
      id: 2,
      name: "Vegetarian Protein Pack",
      description: "Plant-based meals packed with protein to keep you energized all day.",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      dietType: "vegetarian",
      mealTypes: ["lunch", "dinner"],
      prepTime: "20 min",
      meals: [
        { day: "Monday", meal: "Quinoa Buddha Bowl with Tahini Dressing" },
        { day: "Tuesday", meal: "Lentil & Vegetable Curry" },
        { day: "Wednesday", meal: "Black Bean & Sweet Potato Enchiladas" },
        { day: "Thursday", meal: "Chickpea Mediterranean Salad" },
        { day: "Friday", meal: "Tofu & Vegetable Stir Fry with Brown Rice" }
      ]
    },
    {
      id: 3,
      name: "Keto-Friendly Week",
      description: "Low-carb, high-fat meals to support your keto lifestyle.",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      dietType: "keto",
      mealTypes: ["breakfast", "lunch", "dinner"],
      prepTime: "25 min",
      meals: [
        { day: "Monday", meal: "Avocado & Bacon Breakfast Bowl" },
        { day: "Tuesday", meal: "Salmon with Asparagus & Hollandaise" },
        { day: "Wednesday", meal: "Cauliflower Crust Pizza with Fresh Mozzarella" },
        { day: "Thursday", meal: "Zucchini Noodles with Meatballs" },
        { day: "Friday", meal: "Steak with Garlic Butter & Broccoli" }
      ]
    },
    {
      id: 4,
      name: "Family-Friendly Favorites",
      description: "Meals that the whole family will enjoy!",
      kidApproved: true,
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      dietType: "omnivore",
      mealTypes: ["dinner"],
      prepTime: "30 min",
      meals: [
        { day: "Monday", meal: "Homemade Chicken Tenders with Sweet Potato Fries" },
        { day: "Tuesday", meal: "Build-Your-Own Taco Bar" },
        { day: "Wednesday", meal: "Spaghetti & Turkey Meatballs" },
        { day: "Thursday", meal: "Baked Mac & Cheese with Hidden Veggies" },
        { day: "Friday", meal: "Homemade Pizza Night" }
      ]
    },
    {
      id: 5,
      name: "Quick Healthy Breakfasts",
      description: "Start your day right with these quick, nutritious breakfast options.",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      dietType: "vegetarian",
      mealTypes: ["breakfast"],
      prepTime: "10 min",
      meals: [
        { day: "Monday", meal: "Greek Yogurt Parfait with Berries & Granola" },
        { day: "Tuesday", meal: "Spinach & Feta Egg Muffins" },
        { day: "Wednesday", meal: "Overnight Oats with Chia Seeds & Almond Butter" },
        { day: "Thursday", meal: "Avocado Toast with Poached Egg" },
        { day: "Friday", meal: "Protein Smoothie Bowl with Fresh Fruit" }
      ]
    },
    {
      id: 6,
      name: "Gluten-Free Made Easy",
      description: "Delicious meals without gluten that don't sacrifice flavor.",
      image: "https://images.unsplash.com/photo-1494390248081-4e521a5940db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      dietType: "gluten-free",
      mealTypes: ["lunch", "dinner"],
      prepTime: "25 min",
      meals: [
        { day: "Monday", meal: "Stuffed Bell Peppers with Ground Turkey & Rice" },
        { day: "Tuesday", meal: "Corn Tortilla Chicken Fajitas" },
        { day: "Wednesday", meal: "Quinoa Salad with Roasted Vegetables" },
        { day: "Thursday", meal: "Gluten-Free Pasta with Pesto & Shrimp" },
        { day: "Friday", meal: "Rice Paper Wrapped Spring Rolls" }
      ]
    }
  ];

  const filteredMealPlans = sampleMealPlans.filter(plan => {
    const dietMatch = selectedDiet === 'all' || plan.dietType === selectedDiet;
    const mealTypeMatch = selectedMealType === 'all' || plan.mealTypes.includes(selectedMealType);
    return dietMatch && mealTypeMatch;
  });

  return (
    <>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Sample Meal Plans
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Browse our collection of meal plans designed for busy women. Each plan includes 5 days of easy-to-prepare meals.
            </motion.p>
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link to="/register" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-flex items-center">
                Try Free for 14 Days
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </motion.div>
          </div>
          
          {/* Filter Controls */}
          <div className="mt-8 mb-12 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <div className="flex flex-col">
                <label htmlFor="diet-select" className="text-sm font-medium text-gray-700 mb-1">Dietary Preference</label>
                <select
                  id="diet-select"
                  value={selectedDiet}
                  onChange={(e) => setSelectedDiet(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Diets</option>
                  <option value="omnivore">Omnivore</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="keto">Keto</option>
                  <option value="gluten-free">Gluten-Free</option>
                </select>
              </div>
              
              <div className="flex flex-col">
                <label htmlFor="meal-select" className="text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                <select
                  id="meal-select"
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Meal Types</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Meal Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMealPlans.length > 0 ? (
              filteredMealPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={plan.image}
                      alt={plan.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/800x400?text=Meal+Plan+Image';
                      }}
                    />
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs uppercase font-bold px-3 py-1 rounded-bl-lg">
                      {plan.dietType}
                    </div>
                    {plan.kidApproved && (
                      <div className="absolute top-10 right-0 bg-green-500 text-white text-xs uppercase font-bold px-3 py-1 rounded-bl-lg animate-pulse">
                        KID APPROVED!!
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 bg-white text-indigo-600 text-xs font-bold px-3 py-1 rounded-tr-lg flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {plan.prepTime} prep
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">This Week's Menu:</h4>
                      <ul className="space-y-2">
                        {plan.meals.map((meal, i) => (
                          <li key={i} className="flex items-start">
                            <span className="font-medium min-w-[80px] text-indigo-600">
                              <span className="md:inline hidden">{meal.day}:</span>
                              <span className="md:hidden inline">{meal.day.substring(0, 3)}:</span>
                            </span>
                            <span className="text-gray-700">{meal.meal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10">
                <p className="text-gray-500 text-lg">No meal plans found matching your filters. Please try different options.</p>
              </div>
            )}
          </div>
          
          <div className="mt-16 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Want Personalized Meal Plans?</h2>
            <p className="text-gray-600 mb-6">
              These are just sample meal plans. When you subscribe, our AI will create custom meal plans based on your preferences, dietary needs, and schedule.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/pricing" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                See Subscription Plans
              </a>
              <a href="/register" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50">
                Start Free Trial
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MealPlans;
