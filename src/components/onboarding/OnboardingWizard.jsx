import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserData } from '../../lib/supabaseDatabase';
import toast from 'react-hot-toast';

const OnboardingWizard = ({ onComplete }) => {
  const { currentUser, user } = useAuth();
  const authUser = currentUser || user;
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    familySize: 4,
    dietaryRestrictions: [],
    allergies: [],
    cuisinePreferences: [],
    cookingTime: 'medium',
    budget: 'medium',
    healthGoals: [],
    avoidIngredients: []
  });

  const steps = [
    {
      title: 'Welcome to BusyWomen Meal Planner!',
      subtitle: "Let's personalize your experience",
      content: <WelcomeStep />
    },
    {
      title: 'Family Size',
      subtitle: 'How many people are you cooking for?',
      content: <FamilySizeStep formData={formData} setFormData={setFormData} />
    },
    {
      title: 'Dietary Preferences',
      subtitle: 'Select any dietary restrictions',
      content: <DietaryStep formData={formData} setFormData={setFormData} />
    },
    {
      title: 'Allergies & Intolerances',
      subtitle: 'Help us keep your meals safe',
      content: <AllergyStep formData={formData} setFormData={setFormData} />
    },
    {
      title: 'Cuisine Preferences',
      subtitle: 'What types of food do you enjoy?',
      content: <CuisineStep formData={formData} setFormData={setFormData} />
    },
    {
      title: 'Cooking Time',
      subtitle: 'How much time do you have for cooking?',
      content: <TimeStep formData={formData} setFormData={setFormData} />
    },
    {
      title: 'Budget',
      subtitle: 'Set your meal budget preference',
      content: <BudgetStep formData={formData} setFormData={setFormData} />
    },
    {
      title: 'Health Goals',
      subtitle: 'Any specific health objectives?',
      content: <HealthStep formData={formData} setFormData={setFormData} />
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    console.log('Onboarding complete - user:', authUser);
    console.log('Form data:', formData);
    
    const userId = authUser?.uid || authUser?.id;
    
    if (!authUser || !userId) {
      console.error('No user found in auth context');
      toast.error('Please log in to save preferences');
      return;
    }
    
    try {
      await updateUserData(userId, {
        preferences: formData,
        onboarding_completed: true
      });
      
      toast.success('Preferences saved successfully!');
      localStorage.setItem('onboardingCompleted', 'true');
      onComplete(formData);
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences: ' + error.message);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingSkipped', 'true');
    onComplete(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="bg-gray-100 px-6 py-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</span>
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              Skip <X className="w-4 h-4" />
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
              <p className="text-gray-600 mb-6">{steps[currentStep].subtitle}</p>
              <div className="min-h-[300px]">
                {steps[currentStep].content}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentStep === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {currentStep === steps.length - 1 ? (
              <>Complete <Check className="w-4 h-4" /></>
            ) : (
              <>Next <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Step Components
const WelcomeStep = () => (
  <div className="text-center py-8">
    <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <span className="text-4xl">👋</span>
    </div>
    <h3 className="text-xl font-semibold mb-4">Welcome aboard!</h3>
    <p className="text-gray-600 max-w-md mx-auto">
      We'll ask you a few quick questions to personalize your meal planning experience. 
      This will help us suggest meals that perfectly fit your lifestyle and preferences.
    </p>
  </div>
);

const FamilySizeStep = ({ formData, setFormData }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, '8+'].map((size) => (
        <button
          key={size}
          onClick={() => setFormData({ ...formData, familySize: size === '8+' ? 8 : size })}
          className={`p-4 rounded-lg border-2 transition-colors ${
            formData.familySize === (size === '8+' ? 8 : size)
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-2xl font-bold">{size}</div>
          <div className="text-sm text-gray-600">{size === 1 ? 'person' : 'people'}</div>
        </button>
      ))}
    </div>
  </div>
);

const DietaryStep = ({ formData, setFormData }) => {
  const options = [
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
    { id: 'vegan', label: 'Vegan', icon: '🌱' },
    { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
    { id: 'dairy-free', label: 'Dairy-Free', icon: '🥛' },
    { id: 'keto', label: 'Keto', icon: '🥑' },
    { id: 'paleo', label: 'Paleo', icon: '🥩' },
    { id: 'mediterranean', label: 'Mediterranean', icon: '🫒' },
    { id: 'low-carb', label: 'Low Carb', icon: '🥦' }
  ];

  const toggleOption = (id) => {
    const current = formData.dietaryRestrictions || [];
    if (current.includes(id)) {
      setFormData({
        ...formData,
        dietaryRestrictions: current.filter(item => item !== id)
      });
    } else {
      setFormData({
        ...formData,
        dietaryRestrictions: [...current, id]
      });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => toggleOption(option.id)}
          className={`p-4 rounded-lg border-2 transition-colors text-left ${
            formData.dietaryRestrictions?.includes(option.id)
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{option.icon}</span>
            <span className="font-medium">{option.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

const AllergyStep = ({ formData, setFormData }) => {
  const commonAllergies = [
    'Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Wheat', 
    'Soy', 'Fish', 'Shellfish', 'Sesame'
  ];

  const toggleAllergy = (allergy) => {
    const current = formData.allergies || [];
    if (current.includes(allergy)) {
      setFormData({
        ...formData,
        allergies: current.filter(item => item !== allergy)
      });
    } else {
      setFormData({
        ...formData,
        allergies: [...current, allergy]
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {commonAllergies.map((allergy) => (
          <button
            key={allergy}
            onClick={() => toggleAllergy(allergy)}
            className={`p-3 rounded-lg border-2 transition-colors ${
              formData.allergies?.includes(allergy)
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {allergy}
          </button>
        ))}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Other allergies or ingredients to avoid:
        </label>
        <input
          type="text"
          placeholder="e.g., cilantro, mushrooms"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          onBlur={(e) => {
            if (e.target.value) {
              setFormData({
                ...formData,
                avoidIngredients: e.target.value.split(',').map(item => item.trim())
              });
            }
          }}
        />
      </div>
    </div>
  );
};

const CuisineStep = ({ formData, setFormData }) => {
  const cuisines = [
    'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 
    'Thai', 'Mediterranean', 'American', 'French', 'Korean'
  ];

  const toggleCuisine = (cuisine) => {
    const current = formData.cuisinePreferences || [];
    if (current.includes(cuisine)) {
      setFormData({
        ...formData,
        cuisinePreferences: current.filter(item => item !== cuisine)
      });
    } else {
      setFormData({
        ...formData,
        cuisinePreferences: [...current, cuisine]
      });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {cuisines.map((cuisine) => (
        <button
          key={cuisine}
          onClick={() => toggleCuisine(cuisine)}
          className={`p-3 rounded-lg border-2 transition-colors ${
            formData.cuisinePreferences?.includes(cuisine)
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {cuisine}
        </button>
      ))}
    </div>
  );
};

const TimeStep = ({ formData, setFormData }) => {
  const timeOptions = [
    { id: 'quick', label: 'Quick', desc: 'Under 20 minutes', icon: '⚡' },
    { id: 'medium', label: 'Moderate', desc: '20-40 minutes', icon: '⏱️' },
    { id: 'long', label: 'Leisurely', desc: '40+ minutes', icon: '🕰️' }
  ];

  return (
    <div className="space-y-4">
      {timeOptions.map((option) => (
        <button
          key={option.id}
          onClick={() => setFormData({ ...formData, cookingTime: option.id })}
          className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
            formData.cookingTime === option.id
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">{option.icon}</span>
            <div>
              <div className="font-semibold">{option.label}</div>
              <div className="text-sm text-gray-600">{option.desc}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

const BudgetStep = ({ formData, setFormData }) => {
  const budgetOptions = [
    { id: 'budget', label: 'Budget-Friendly', desc: 'Focus on affordable ingredients', icon: '💰' },
    { id: 'medium', label: 'Moderate', desc: 'Balance of cost and quality', icon: '💵' },
    { id: 'premium', label: 'Premium', desc: 'Quality ingredients, less concern about cost', icon: '💎' }
  ];

  return (
    <div className="space-y-4">
      {budgetOptions.map((option) => (
        <button
          key={option.id}
          onClick={() => setFormData({ ...formData, budget: option.id })}
          className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
            formData.budget === option.id
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">{option.icon}</span>
            <div>
              <div className="font-semibold">{option.label}</div>
              <div className="text-sm text-gray-600">{option.desc}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

const HealthStep = ({ formData, setFormData }) => {
  const healthGoals = [
    'Weight Loss', 'Muscle Building', 'Heart Health', 'Diabetes Management',
    'Energy Boost', 'Better Digestion', 'Anti-Inflammatory', 'General Wellness'
  ];

  const toggleGoal = (goal) => {
    const current = formData.healthGoals || [];
    if (current.includes(goal)) {
      setFormData({
        ...formData,
        healthGoals: current.filter(item => item !== goal)
      });
    } else {
      setFormData({
        ...formData,
        healthGoals: [...current, goal]
      });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {healthGoals.map((goal) => (
        <button
          key={goal}
          onClick={() => toggleGoal(goal)}
          className={`p-3 rounded-lg border-2 transition-colors ${
            formData.healthGoals?.includes(goal)
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {goal}
        </button>
      ))}
    </div>
  );
};

export default OnboardingWizard;