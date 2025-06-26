import { useState, useContext, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserContext } from '../context/UserContext'
import { getStripe, createCheckoutSession } from '../api/stripe-checkout'

const Pricing = () => {
  const { user } = useContext(UserContext)
  const [annual, setAnnual] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  // Check for Stripe checkout results
  useEffect(() => {
    const checkoutStatus = searchParams.get('checkout')
    if (checkoutStatus === 'success') {
      // Show success message or redirect
      alert('Subscription successful! Welcome to BusyWomen meal planning.')
    } else if (checkoutStatus === 'cancel') {
      // Show cancellation message
      alert('You canceled the subscription process. Feel free to explore our plans.')
    }
  }, [searchParams])

  const handleSubscription = async (priceId) => {
    try {
      setLoading(true)
      
      if (!user) {
        // Redirect to register page if not logged in
        navigate('/register?redirect=pricing')
        return
      }

      // Create checkout session and redirect to Stripe
      await createCheckoutSession(priceId, user.email)
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const plans = [
    {
      name: 'Basic',
      description: 'Perfect for individuals just getting started with meal planning',
      monthlyPrice: 9.97,
      annualPrice: 97.97,
      priceId: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID,
      features: [
        '5 meal plans per week',
        'Basic AI recommendations',
        'Shopping list generation',
        'Unlimited recipes access',
        'Email support'
      ],
      cta: 'Start Basic Plan',
      color: 'indigo',
      popular: false
    },
    {
      name: 'Premium',
      description: 'Our most popular plan for busy professionals',
      monthlyPrice: 19.97,
      annualPrice: 197.97,
      priceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID,
      features: [
        '21 meal plans per week',
        'Advanced AI personalization',
        'Shopping list with budget optimization',
        'Nutrition tracking',
        'Meal prep guides',
        'Priority support'
      ],
      cta: 'Start Premium Plan',
      color: 'indigo',
      popular: true
    },
    {
      name: 'Annual',
      description: 'Maximum savings with our annual subscription',
      monthlyPrice: 16.97,
      annualPrice: 197.97,
      priceId: import.meta.env.VITE_STRIPE_ANNUAL_PRICE_ID,
      features: [
        'All Premium features',
        'Advanced AI personalization',
        'Meal prep guides',
        'Exclusive recipes',
        'One-on-one nutrition consultation',
        '24/7 priority support'
      ],
      cta: 'Start Annual Plan',
      color: 'indigo',
      popular: false,
      bestValue: true
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Choose the plan that works best for your lifestyle and budget
          </motion.p>
          
          <motion.div 
            className="mt-6 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative flex items-center">
              <span className={`mr-3 text-sm ${!annual ? 'font-medium text-gray-900' : 'text-gray-500'}`}>Monthly</span>
              <button 
                onClick={() => setAnnual(!annual)} 
                className={`${annual ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                role="switch"
                aria-checked={annual}
              >
                <span 
                  className={`${annual ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
              <span className={`ml-3 text-sm ${annual ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                Annual <span className="text-green-500 font-medium">(Save 17%)</span>
              </span>
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div 
              key={plan.name}
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${plan.popular ? 'border-2 border-indigo-500 relative' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-indigo-500 text-white text-xs font-bold rounded-bl-lg py-1 px-3 shadow-md">
                  Most Popular
                </div>
              )}
              {plan.bestValue && annual && (
                <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-green-500 text-white text-xs font-bold rounded-bl-lg py-1 px-3 shadow-md">
                  Best Value
                </div>
              )}
              <div className="px-6 py-8">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-gray-600">{plan.description}</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${annual ? plan.annualPrice.toFixed(2) : plan.monthlyPrice.toFixed(2)}
                  </span>
                  <span className="ml-1 text-xl font-medium text-gray-500">
                    {annual ? '/year' : '/month'}
                  </span>
                </div>
                
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <button
                    onClick={() => handleSubscription(plan.priceId)}
                    disabled={loading}
                    className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                  >
                    {loading ? "Processing..." : user ? "Subscribe Now" : plan.cta}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Can I change my plan later?</h3>
                <p className="mt-2 text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">Is there a free trial?</h3>
                <p className="mt-2 text-gray-600">We offer a 14-day free trial on all plans. No credit card required to start.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">What payment methods do you accept?</h3>
                <p className="mt-2 text-gray-600">We accept all major credit cards, PayPal, and Apple Pay.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">Can I cancel my subscription?</h3>
                <p className="mt-2 text-gray-600">You can cancel your subscription at any time. We also offer a 30-day money-back guarantee.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-600">
            Still have questions? <a href="#contact" className="text-indigo-600 font-medium hover:text-indigo-500">Contact our support team</a>
          </p>
          
          <p className="mt-6 text-gray-500 text-sm">
            By subscribing, you agree to our <a href="#terms" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a> and <a href="#privacy" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Pricing
