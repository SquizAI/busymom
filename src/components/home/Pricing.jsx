import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const pricingPlans = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for individuals looking to get started with healthy meal planning',
    price: 9.97,
    frequency: 'month',
    features: [
      'Weekly meal plans (5 days)',
      'Shopping lists',
      'Basic nutrition information',
      'Access to 100+ recipes',
      'Email support'
    ],
    recommended: false,
    ctaText: 'Get Started'
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Our most popular plan with additional features and personalization',
    price: 19.97,
    frequency: 'month',
    features: [
      'Weekly meal plans (7 days)',
      'AI-powered personalized recommendations',
      'Detailed nutrition breakdowns',
      'Access to 500+ recipes',
      'Priority email support',
      'Meal prep videos',
      'Dietary preference customization'
    ],
    recommended: true,
    ctaText: 'Get Premium'
  },
  {
    id: 'annual',
    name: 'Annual Plan',
    description: 'Our best value with 2 months free and all premium features',
    price: 197.97,
    frequency: 'year',
    features: [
      'Everything in Premium',
      '2 months free ($158 savings)',
      'Exclusive seasonal recipes',
      'Priority customer support',
      '1-on-1 consultation with nutritionist',
      'Access to exclusive workshops',
      'Free meal planning e-book'
    ],
    recommended: false,
    ctaText: 'Save with Annual'
  }
]

const Pricing = () => {
  const [billingFrequency, setBillingFrequency] = useState('month')
  // Simplified - not using context for now
  const user = null

  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600">
            Choose the plan that fits your lifestyle and dietary needs
          </p>
          
          <div className="mt-8 flex justify-center">
            <div className="relative flex bg-gray-100 p-1 rounded-lg">
              <button
                className={`py-2 px-6 rounded-md transition-colors ${
                  billingFrequency === 'month'
                    ? 'bg-white shadow-md text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setBillingFrequency('month')}
              >
                Monthly
              </button>
              <button
                className={`py-2 px-6 rounded-md transition-colors ${
                  billingFrequency === 'year'
                    ? 'bg-white shadow-md text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setBillingFrequency('year')}
              >
                Yearly <span className="text-sm text-green-600 font-medium">Save 16%</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans
            .filter(plan => billingFrequency === 'month' ? plan.id !== 'annual' : true)
            .map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105 hover:shadow-xl ${
                  plan.recommended ? 'border-2 border-indigo-500 relative' : ''
                }`}
              >
                {plan.recommended && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      MOST POPULAR
                    </div>
                  </div>
                )}
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6 h-12">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/{plan.frequency}</span>
                  </div>
                  <div className="mb-8">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <svg
                            className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    to={user ? "/checkout" : "/register"}
                    className={`block w-full py-3 px-4 rounded-lg text-center font-bold transition-colors ${
                      plan.recommended
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                    }`}
                  >
                    {plan.ctaText}
                  </Link>
                </div>
              </motion.div>
            ))}
        </div>

        <div className="mt-16 text-center max-w-3xl mx-auto">
          <div className="bg-indigo-50 rounded-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">100% Satisfaction Guarantee</h3>
            <p className="text-gray-700 mb-0">
              Try risk-free for 14 days. If you're not completely satisfied, let us know and we'll refund your payment.
              No questions asked.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing
