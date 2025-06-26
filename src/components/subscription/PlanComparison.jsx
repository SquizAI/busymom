import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SkeletonLoader from '../common/SkeletonLoader';

/**
 * PlanComparison component that displays feature differences between subscription tiers
 * @param {string} currentPlan - The user's current subscription plan
 * @param {string} selectedPlan - The plan currently selected in the UI
 */
const PlanComparison = ({ currentPlan = 'basic', selectedPlan = null }) => {
  const [loading, setLoading] = useState(true);
  
  // Simulate loading state for demonstration purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  // Plan details with pricing and features
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 'Free',
      description: 'Essential features for busy women',
      features: [
        { name: 'Basic meal planning', included: true },
        { name: 'Simple shopping lists', included: true },
        { name: 'Recipe search', included: true },
        { name: 'Standard dashboard', included: true },
        { name: 'AI-powered meal suggestions', included: true },
        { name: 'Enhanced AI meal planning', included: false },
        { name: 'Smart shopping lists', included: false },
        { name: 'Nutrition insights', included: false },
        { name: 'Recipe customization', included: false },
        { name: 'Meal prep planning', included: false },
        { name: 'Advanced analytics', included: false }
      ],
      cta: 'Current Plan',
      ctaLink: '#',
      highlight: false,
      gradientColors: 'from-gray-50 to-gray-50',
      buttonGradient: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$9.99',
      period: 'month',
      description: 'Advanced AI features for optimized meal planning',
      gradientColors: 'from-fuchsia-50 to-violet-50',
      buttonGradient: 'bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white hover:from-fuchsia-700 hover:to-violet-700',
      features: [
        { name: 'Basic meal planning', included: true },
        { name: 'Simple shopping lists', included: true },
        { name: 'Recipe search', included: true },
        { name: 'Standard dashboard', included: true },
        { name: 'AI-powered meal suggestions', included: true },
        { name: 'Enhanced AI meal planning', included: true, new: true },
        { name: 'Smart shopping lists', included: true, new: true },
        { name: 'Nutrition insights', included: true, new: true },
        { name: 'Recipe customization', included: true, new: true },
        { name: 'Meal prep planning', included: false },
        { name: 'Advanced analytics', included: false }
      ],
      cta: currentPlan === 'premium' ? 'Current Plan' : 'Upgrade to Premium',
      ctaLink: currentPlan === 'premium' ? '#' : '/subscribe/premium',
      highlight: true,
      gradientBorder: 'border-fuchsia-200'
    },
    {
      id: 'annual',
      name: 'Annual Plan',
      price: '$99.99',
      period: 'year',
      description: 'Best value with exclusive features',
      gradientColors: 'from-amber-50 to-pink-50',
      buttonGradient: 'bg-gradient-to-r from-amber-500 to-pink-500 text-white hover:from-amber-600 hover:to-pink-600',
      gradientBorder: 'border-amber-200',
      features: [
        { name: 'Basic meal planning', included: true },
        { name: 'Simple shopping lists', included: true },
        { name: 'Recipe search', included: true },
        { name: 'Standard dashboard', included: true },
        { name: 'AI-powered meal suggestions', included: true },
        { name: 'Enhanced AI meal planning', included: true },
        { name: 'Smart shopping lists', included: true },
        { name: 'Nutrition insights', included: true },
        { name: 'Recipe customization', included: true },
        { name: 'Meal prep planning', included: true, new: true },
        { name: 'Advanced analytics', included: true, new: true }
      ],
      cta: currentPlan === 'annual' ? 'Current Plan' : 'Upgrade to Annual',
      ctaLink: currentPlan === 'annual' ? '#' : '/subscribe/annual',
      highlight: false,
      savings: 'Save 16%'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  if (loading) {
    return (
      <div className="py-12 bg-gradient-to-b from-white via-pink-50/30 to-violet-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonLoader type="plan" />
            <SkeletonLoader type="plan" />
            <SkeletonLoader type="plan" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gradient-to-b from-white via-pink-50/30 to-violet-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose the plan that's right for you
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            All plans include core features to help busy women manage their meal planning
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-12 space-y-12 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 relative"
        >
          {/* Decorative background elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-fuchsia-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 -right-10 w-40 h-40 bg-violet-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-10 left-1/3 w-40 h-40 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={itemVariants}
              className={`rounded-lg shadow-md divide-y divide-gray-200 bg-gradient-to-br ${plan.gradientColors} ${selectedPlan === plan.id ? `ring-2 ring-${plan.id === 'premium' ? 'fuchsia' : plan.id === 'annual' ? 'amber' : 'gray'}-400` : ''} ${plan.highlight ? 'ring-2 ring-fuchsia-400' : ''} border ${plan.gradientBorder || 'border-gray-100'}`}
              whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 15 } }}
            >
              <div className="p-6">
                {plan.highlight && (
                  <span className="bg-indigo-500 text-white text-xs font-semibold py-1 px-3 rounded-full uppercase absolute -mt-10 ml-6">
                    Most Popular
                  </span>
                )}
                {plan.savings && (
                  <span className="absolute top-0 right-0 -mt-2 -mr-2 px-3 py-1 bg-gradient-to-r from-amber-100 to-pink-100 text-amber-800 text-xs font-medium rounded-full shadow-sm">
                    {plan.savings}
                  </span>
                )}
                <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-base font-medium text-gray-500">/{plan.period}</span>
                  )}
                </p>
                <p className="mt-4 text-sm text-gray-600">{plan.description}</p>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">
                  What's included
                </h4>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex space-x-3">
                      {feature.included ? (
                        <svg
                          className={`flex-shrink-0 h-5 w-5 ${
                            feature.new ? plan.id === 'premium' ? 'text-fuchsia-600' : plan.id === 'annual' ? 'text-amber-500' : 'text-green-500' : 'text-green-500'
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="flex-shrink-0 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span className={`text-sm ${feature.new ? `font-semibold ${plan.id === 'premium' ? 'text-fuchsia-600' : plan.id === 'annual' ? 'text-amber-500' : 'text-gray-700'}` : 'text-gray-500'}`}>
                        {feature.name}
                        {feature.new && (
                          <span className={`ml-2 text-xs font-medium py-0.5 px-1.5 rounded ${plan.id === 'premium' ? 'text-fuchsia-600 bg-fuchsia-100' : plan.id === 'annual' ? 'text-amber-600 bg-amber-100' : 'text-gray-600 bg-gray-100'}`}>
                            New
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    to={plan.ctaLink}
                    className={`block w-full rounded-md py-2 text-sm font-semibold text-center ${
                      currentPlan === plan.id
                        ? 'bg-gray-200 text-gray-700 cursor-default'
                        : plan.buttonGradient
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanComparison;
