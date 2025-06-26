import { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

const Register = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [dietaryPreferences, setDietaryPreferences] = useState(['no-restrictions'])
  const { loginAsDummy } = useContext(UserContext)
  
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Final step - register the user
      setLoading(true)
      
      try {
        // Simulate registration - in a real app, this would call your API
        // Use dummy login for demo purposes
        loginAsDummy('regularUser')
        
        // In a real app, we would save the dietary preferences to the user profile
        console.log('Selected dietary preferences:', dietaryPreferences)
        
        // Add a small delay to ensure the user context is updated before navigation
        setTimeout(() => {
          // Navigate to dashboard after "registration"
          navigate('/dashboard')
        }, 500)
      } catch (error) {
        console.error('Registration error:', error)
        setLoading(false)
      }
    }
  }
  
  // Handle toggling of dietary preferences
  const toggleDietaryPreference = (preference) => {
    // Special case for 'no-restrictions'
    if (preference === 'no-restrictions') {
      if (dietaryPreferences.includes('no-restrictions')) {
        // If removing 'no-restrictions', leave empty array
        setDietaryPreferences([]);
      } else {
        // If adding 'no-restrictions', clear all other preferences
        setDietaryPreferences(['no-restrictions']);
      }
      return;
    }
    
    // For other preferences
    const updatedPreferences = [...dietaryPreferences];
    
    // If 'no-restrictions' is selected, remove it when selecting another preference
    if (updatedPreferences.includes('no-restrictions')) {
      const noRestrictionsIndex = updatedPreferences.indexOf('no-restrictions');
      updatedPreferences.splice(noRestrictionsIndex, 1);
    }
    
    // Toggle the selected preference
    if (updatedPreferences.includes(preference)) {
      const index = updatedPreferences.indexOf(preference);
      updatedPreferences.splice(index, 1);
    } else {
      updatedPreferences.push(preference);
    }
    
    // If no preferences are selected, default to 'no-restrictions'
    if (updatedPreferences.length === 0) {
      updatedPreferences.push('no-restrictions');
    }
    
    setDietaryPreferences(updatedPreferences);
  };
  
  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Step 1: Tell us about yourself</h3>
              <p className="mt-1 text-sm text-gray-500">We'll create your personalized meal plans based on this.</p>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">I'm looking for:</label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input id="quick-meals" name="meal-type" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
                  <label htmlFor="quick-meals" className="ml-2 text-sm text-gray-700">Quick meals (15 min or less)</label>
                </div>
                <div className="flex items-center">
                  <input id="kid-friendly" name="meal-type" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
                  <label htmlFor="kid-friendly" className="ml-2 text-sm text-gray-700">Kid-friendly options</label>
                </div>
                <div className="flex items-center">
                  <input id="budget-friendly" name="meal-type" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                  <label htmlFor="budget-friendly" className="ml-2 text-sm text-gray-700">Budget-friendly meals</label>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Step 2: Any dietary preferences?</h3>
              <p className="mt-1 text-sm text-gray-500">We'll customize your meal plans based on these.</p>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button 
                type="button" 
                onClick={() => toggleDietaryPreference('vegetarian')}
                className={`flex flex-col items-center justify-center p-4 border-2 ${dietaryPreferences.includes('vegetarian') ? 'border-indigo-500 bg-indigo-50' : 'border-indigo-200'} rounded-lg hover:border-indigo-500 hover:bg-indigo-50`}
              >
                <span className="text-sm font-medium text-gray-900">Vegetarian</span>
              </button>
              <button 
                type="button" 
                onClick={() => toggleDietaryPreference('gluten-free')}
                className={`flex flex-col items-center justify-center p-4 border-2 ${dietaryPreferences.includes('gluten-free') ? 'border-indigo-500 bg-indigo-50' : 'border-indigo-200'} rounded-lg hover:border-indigo-500 hover:bg-indigo-50`}
              >
                <span className="text-sm font-medium text-gray-900">Gluten-Free</span>
              </button>
              <button 
                type="button" 
                onClick={() => toggleDietaryPreference('keto')}
                className={`flex flex-col items-center justify-center p-4 border-2 ${dietaryPreferences.includes('keto') ? 'border-indigo-500 bg-indigo-50' : 'border-indigo-200'} rounded-lg hover:border-indigo-500 hover:bg-indigo-50`}
              >
                <span className="text-sm font-medium text-gray-900">Keto</span>
              </button>
              <button 
                type="button" 
                onClick={() => toggleDietaryPreference('no-restrictions')}
                className={`flex flex-col items-center justify-center p-4 border-2 ${dietaryPreferences.includes('no-restrictions') ? 'border-indigo-500 bg-indigo-50' : 'border-indigo-200'} rounded-lg hover:border-indigo-500 hover:bg-indigo-50`}
              >
                <span className="text-sm font-medium text-gray-900">No Restrictions</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center">Don't worry, you can change these anytime!</p>
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Step 3: Create your account</h3>
              <p className="mt-1 text-sm text-gray-500">Your 14-day free trial starts now!</p>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Your plan includes:</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Personalized weekly meal plans</li>
                      <li>Automatic grocery lists</li>
                      <li>Kid-approved recipes</li>
                      <li>15-minute meals for busy days</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.h2 
          className="mt-6 text-center text-3xl font-extrabold text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {step === 3 ? 'Last step!' : 'Start your 14-day free trial'}
        </motion.h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          No credit card required • Cancel anytime
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Progress bar */}
        <div className="max-w-md mx-auto mb-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                <span className="text-white text-sm font-medium">1</span>
              </div>
              <div className={`h-1 w-10 ${step > 1 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            </div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                <span className="text-white text-sm font-medium">2</span>
              </div>
              <div className={`h-1 w-10 ${step > 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            </div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                <span className="text-white text-sm font-medium">3</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {renderStep()}
            
            <div className="flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Creating account...' : step === 3 ? 'Start your free trial' : 'Continue'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our <Link to="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">Terms</Link> and <Link to="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500">Privacy Policy</Link>
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
