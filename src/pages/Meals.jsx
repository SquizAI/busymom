import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const mealSamples = [
  {
    id: 1,
    name: 'One-Pot Chicken & Veggie Pasta',
    description: 'A quick and nutritious meal that cooks in a single pot. Perfect for busy weeknights!',
    prepTime: '15 min',
    tags: ['kid-friendly', 'one-pot', 'protein-rich'],
    image: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1008&q=80',
    nutrition: {
      calories: 420,
      protein: '28g',
      carbs: '48g',
      fat: '12g'
    }
  },
  {
    id: 2,
    name: 'Sheet Pan Salmon & Broccoli',
    description: 'Omega-3 rich salmon with crispy broccoli, all on one sheet pan for minimal cleanup.',
    prepTime: '15 min',
    tags: ['high-protein', 'low-carb', 'omega-3'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    nutrition: {
      calories: 380,
      protein: '32g',
      carbs: '15g',
      fat: '22g'
    }
  },
  {
    id: 3,
    name: 'Quick Veggie Quesadillas',
    description: 'Crispy tortillas filled with cheese and vegetables. Add rotisserie chicken for extra protein!',
    prepTime: '12 min',
    tags: ['vegetarian', 'kid-friendly', 'customizable'],
    image: 'https://images.unsplash.com/photo-1628824851008-ec5b993319b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    nutrition: {
      calories: 350,
      protein: '14g',
      carbs: '38g',
      fat: '16g'
    }
  },
  {
    id: 4,
    name: 'Healthy Teriyaki Bowls',
    description: 'Quick teriyaki chicken or tofu with steamed rice and vegetables. Meal-prep friendly!',
    prepTime: '15 min',
    tags: ['meal-prep', 'customizable', 'gluten-free option'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1160&q=80',
    nutrition: {
      calories: 410,
      protein: '26g',
      carbs: '52g',
      fat: '10g'
    }
  },
  {
    id: 5,
    name: 'Mediterranean Chickpea Salad',
    description: 'No-cook protein-packed salad that stays fresh in the fridge. Great for lunch or dinner!',
    prepTime: '10 min',
    tags: ['no-cook', 'vegetarian', 'make-ahead'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    nutrition: {
      calories: 320,
      protein: '15g',
      carbs: '42g',
      fat: '13g'
    }
  },
  {
    id: 6,
    name: 'Speedy Breakfast Tacos',
    description: 'Breakfast for dinner is always a win! These protein-packed tacos come together in minutes.',
    prepTime: '15 min',
    tags: ['breakfast-for-dinner', 'kid-friendly', 'high-protein'],
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80',
    nutrition: {
      calories: 380,
      protein: '22g',
      carbs: '32g',
      fat: '18g'
    }
  }
]

const Meals = () => {
  const [activeTag, setActiveTag] = useState('all')
  
  // Get all unique tags
  const allTags = ['all', ...new Set(mealSamples.flatMap(meal => meal.tags))]
  
  // Filter meals by tag
  const filteredMeals = activeTag === 'all' 
    ? mealSamples 
    : mealSamples.filter(meal => meal.tags.includes(activeTag))
  
  return (
    <div className="py-16 bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sample 15-Minute Meals for Busy Moms
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            All of these meals take just 15 minutes to prepare. These are real examples of what you'll get with your personalized meal plan.
          </p>
          
          {/* CTA Banner */}
          <div className="mt-8 bg-indigo-100 p-4 rounded-lg inline-block mx-auto shadow-sm border border-indigo-200">
            <p className="text-indigo-800 font-medium mb-2">
              Want personalized meal plans based on your family's preferences?
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-indigo-600 text-white py-2 px-6 rounded-lg font-medium shadow-md hover:bg-indigo-700 transition-colors"
              >
                Start Your Free 14-Day Trial
              </motion.button>
            </Link>
          </div>
        </div>
        
        {/* Tag filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
                activeTag === tag 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTag(tag)}
            >
              {tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>
        
        {/* Meal cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMeals.map(meal => (
            <motion.div
              key={meal.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={meal.image} 
                  alt={meal.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                {/* Prep time badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg className="mr-1 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {meal.prepTime} prep
                  </span>
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 mb-1">{meal.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{meal.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {meal.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="inline-block px-2 py-1 text-xs font-medium rounded bg-indigo-50 text-indigo-700"
                    >
                      {tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  ))}
                </div>
                
                {/* Nutrition info */}
                <div className="pt-3 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Nutrition Per Serving</h4>
                  <div className="flex justify-between text-sm">
                    <span><span className="font-medium">{meal.nutrition.calories}</span> cal</span>
                    <span><span className="font-medium">{meal.nutrition.protein}</span> protein</span>
                    <span><span className="font-medium">{meal.nutrition.carbs}</span> carbs</span>
                    <span><span className="font-medium">{meal.nutrition.fat}</span> fat</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready for meals tailored to your family?</h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Get personalized weekly meal plans based on your family's preferences, dietary needs, and schedule. All meals take 15 minutes or less to prepare!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-white text-indigo-700 rounded-lg font-bold shadow-md hover:bg-gray-50 transition-colors w-full sm:w-auto"
                >
                  Start Free 14-Day Trial
                </motion.button>
              </Link>
              <Link to="/pricing">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-indigo-700/30 backdrop-blur-sm border border-white/30 text-white rounded-lg font-medium w-full sm:w-auto hover:bg-indigo-700/50 transition-colors"
                >
                  View Pricing
                </motion.button>
              </Link>
            </div>
            <p className="text-white/70 text-sm mt-4">No credit card required. Cancel anytime.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Meals
