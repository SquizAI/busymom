import React, { useState } from 'react';
import { Clock, ChefHat, Package, CheckCircle, AlertCircle, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const MealPrepMode = ({ mealPlan, preferences }) => {
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [prepMode, setPrepMode] = useState('batch'); // batch, parallel, sequential
  const [showPrepPlan, setShowPrepPlan] = useState(false);
  const [prepProgress, setPrepProgress] = useState({});

  // Consolidate ingredients and create prep plan
  const generatePrepPlan = () => {
    if (selectedMeals.length === 0) {
      toast.error('Please select meals to prep');
      return;
    }

    // Consolidate ingredients
    const ingredientMap = {};
    const prepSteps = [];
    let totalPrepTime = 0;

    selectedMeals.forEach(meal => {
      meal.ingredients?.forEach(ing => {
        const ingredient = typeof ing === 'string' ? ing : ing.name;
        if (!ingredientMap[ingredient]) {
          ingredientMap[ingredient] = { quantity: 0, units: [] };
        }
        ingredientMap[ingredient].quantity += 1;
      });
      
      totalPrepTime += meal.prepTime || 30;
    });

    // Generate prep steps based on mode
    if (prepMode === 'batch') {
      // Group similar tasks
      prepSteps.push({
        title: 'Prep All Vegetables',
        tasks: ['Wash all vegetables', 'Chop onions for all recipes', 'Dice tomatoes', 'Slice peppers'],
        time: 20,
        type: 'prep'
      });
      prepSteps.push({
        title: 'Prepare Proteins',
        tasks: ['Season chicken', 'Marinate beef', 'Prepare tofu'],
        time: 15,
        type: 'prep'
      });
      prepSteps.push({
        title: 'Cook Base Components',
        tasks: ['Cook rice for the week', 'Prepare quinoa', 'Boil pasta'],
        time: 30,
        type: 'cook'
      });
    } else if (prepMode === 'parallel') {
      // Tasks that can be done simultaneously
      prepSteps.push({
        title: 'Start Long-Cooking Items',
        tasks: ['Put rice in rice cooker', 'Start slow cooker meals', 'Preheat oven'],
        time: 5,
        type: 'start'
      });
      prepSteps.push({
        title: 'Simultaneous Prep',
        tasks: ['Chop vegetables while grains cook', 'Prepare sauces while proteins marinate'],
        time: 25,
        type: 'prep'
      });
    }

    setShowPrepPlan(true);
  };

  const toggleMealSelection = (meal) => {
    if (selectedMeals.find(m => m.id === meal.id)) {
      setSelectedMeals(selectedMeals.filter(m => m.id !== meal.id));
    } else {
      setSelectedMeals([...selectedMeals, { ...meal, id: `${meal.day}-${meal.type}` }]);
    }
  };

  const PrepTimeline = ({ steps }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [timers, setTimers] = useState({});

    const startTimer = (stepIndex, duration) => {
      const timerId = setInterval(() => {
        setTimers(prev => ({
          ...prev,
          [stepIndex]: (prev[stepIndex] || duration) - 1
        }));
      }, 1000);

      setTimeout(() => {
        clearInterval(timerId);
        setPrepProgress(prev => ({ ...prev, [stepIndex]: true }));
        toast.success(`Completed: ${steps[stepIndex].title}`);
        if (stepIndex < steps.length - 1) {
          setActiveStep(stepIndex + 1);
        }
      }, duration * 1000);
    };

    return (
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border-2 transition-all ${
              activeStep === index
                ? 'border-purple-600 bg-purple-50'
                : prepProgress[index]
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    prepProgress[index]
                      ? 'bg-green-500 text-white'
                      : activeStep === index
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {prepProgress[index] ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <h4 className="font-semibold">{step.title}</h4>
                  <span className="text-sm text-gray-500">({step.time} min)</span>
                </div>
                
                <ul className="ml-11 space-y-1">
                  {step.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>

              {activeStep === index && !prepProgress[index] && (
                <button
                  onClick={() => startTimer(index, step.time * 60)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <Timer className="w-4 h-4" />
                  Start Timer
                </button>
              )}

              {timers[index] && timers[index] > 0 && (
                <div className="text-2xl font-bold text-purple-600">
                  {Math.floor(timers[index] / 60)}:{(timers[index] % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Prep Mode</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setPrepMode('batch')}
            className={`p-4 rounded-lg border-2 transition-all ${
              prepMode === 'batch'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Package className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <h4 className="font-medium">Batch Cooking</h4>
            <p className="text-sm text-gray-600 mt-1">
              Group similar tasks together
            </p>
          </button>
          
          <button
            onClick={() => setPrepMode('parallel')}
            className={`p-4 rounded-lg border-2 transition-all ${
              prepMode === 'parallel'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Clock className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <h4 className="font-medium">Parallel Prep</h4>
            <p className="text-sm text-gray-600 mt-1">
              Multitask for efficiency
            </p>
          </button>
          
          <button
            onClick={() => setPrepMode('sequential')}
            className={`p-4 rounded-lg border-2 transition-all ${
              prepMode === 'sequential'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <ChefHat className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <h4 className="font-medium">Step by Step</h4>
            <p className="text-sm text-gray-600 mt-1">
              One recipe at a time
            </p>
          </button>
        </div>
      </div>

      {/* Meal Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Select Meals to Prep</h3>
        
        {mealPlan ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mealPlan.days.map(day => 
              day.meals?.map(meal => (
                <button
                  key={`${day.day}-${meal.type}`}
                  onClick={() => toggleMealSelection({ ...meal, day: day.day })}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedMeals.find(m => m.id === `${day.day}-${meal.type}`)
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs text-gray-500">{day.day}</span>
                      <h4 className="font-medium">{meal.name}</h4>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!selectedMeals.find(m => m.id === `${day.day}-${meal.type}`)}
                      onChange={() => {}}
                      className="mt-1"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {meal.prepTime} min
                  </div>
                </button>
              ))
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">No meal plan available</p>
        )}
        
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {selectedMeals.length} meals selected
          </p>
          <button
            onClick={generatePrepPlan}
            disabled={selectedMeals.length === 0}
            className={`px-6 py-2 rounded-lg transition-colors ${
              selectedMeals.length > 0
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Generate Prep Plan
          </button>
        </div>
      </div>

      {/* Prep Plan */}
      <AnimatePresence>
        {showPrepPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Your Prep Plan</h3>
            
            <div className="mb-6 bg-purple-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Consolidated Shopping List</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {Object.entries(
                  selectedMeals.reduce((acc, meal) => {
                    meal.ingredients?.forEach(ing => {
                      const ingredient = typeof ing === 'string' ? ing : ing.name;
                      acc[ingredient] = (acc[ingredient] || 0) + 1;
                    });
                    return acc;
                  }, {})
                ).map(([ingredient, count]) => (
                  <div key={ingredient} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>{ingredient} {count > 1 && `(x${count})`}</span>
                  </div>
                ))}
              </div>
            </div>

            <PrepTimeline 
              steps={[
                {
                  title: 'Prep All Vegetables',
                  tasks: ['Wash all vegetables', 'Chop onions for all recipes', 'Dice tomatoes'],
                  time: 20,
                  type: 'prep'
                },
                {
                  title: 'Prepare Proteins',
                  tasks: ['Season chicken', 'Marinate beef', 'Prepare tofu'],
                  time: 15,
                  type: 'prep'
                },
                {
                  title: 'Cook Base Components',
                  tasks: ['Cook rice for the week', 'Prepare quinoa', 'Boil pasta'],
                  time: 30,
                  type: 'cook'
                },
                {
                  title: 'Assemble & Store',
                  tasks: ['Portion meals into containers', 'Label with dates', 'Store in fridge/freezer'],
                  time: 15,
                  type: 'store'
                }
              ]}
            />

            <div className="mt-6 bg-amber-50 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900">Storage Tips</h4>
                  <ul className="mt-2 space-y-1 text-sm text-amber-800">
                    <li>• Store prepped vegetables in airtight containers with paper towels</li>
                    <li>• Keep proteins and grains separate until ready to eat</li>
                    <li>• Label containers with meal name and date</li>
                    <li>• Most prepped meals last 3-5 days in the fridge</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MealPrepMode;