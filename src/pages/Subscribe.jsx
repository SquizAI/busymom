import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PlanComparison from '../components/subscription/PlanComparison';
import { UserContext } from '../context/UserContext';
import CheckoutForm from '../components/subscription/CheckoutForm';
import ErrorBoundary from '../components/common/ErrorBoundary';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SkeletonLoader from '../components/common/SkeletonLoader';

const Subscribe = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { user, loading: isLoading } = useContext(UserContext);
  const [selectedPlan, setSelectedPlan] = useState(planId || 'premium');
  const [checkoutStep, setCheckoutStep] = useState('select'); // 'select', 'checkout', 'success'
  const [checkoutError, setCheckoutError] = useState(null);

  // Get price ID based on selected plan
  const getPriceId = (plan) => {
    switch (plan) {
      case 'premium':
        return import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID;
      case 'annual':
        return import.meta.env.VITE_STRIPE_ANNUAL_PRICE_ID;
      case 'basic':
        return import.meta.env.VITE_STRIPE_BASIC_PRICE_ID;
      default:
        return import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID;
    }
  };

  // Handle plan selection
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    navigate(`/subscribe/${plan}`);
  };

  // Handle checkout initiation
  const handleCheckout = () => {
    if (selectedPlan === 'basic') {
      // Basic plan is free, no need for checkout
      setCheckoutStep('success');
      return;
    }
    setCheckoutStep('checkout');
  };

  // Handle successful checkout
  const handleCheckoutSuccess = () => {
    setCheckoutStep('success');
    // In a real app, we would update the user's subscription status in the database
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  // Handle checkout cancellation
  const handleCheckoutCancel = () => {
    setCheckoutStep('select');
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login', { state: { from: `/subscribe/${selectedPlan}` } });
    }
  }, [user, isLoading, navigate, selectedPlan]);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading your subscription details..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-violet-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {checkoutStep === 'select' && 'Choose Your Plan'}
            {checkoutStep === 'checkout' && 'Complete Your Subscription'}
            {checkoutStep === 'success' && 'Subscription Activated!'}
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            {checkoutStep === 'select' && 'Select the plan that best fits your needs and unlock premium features.'}
            {checkoutStep === 'checkout' && 'Just one more step to unlock premium features.'}
            {checkoutStep === 'success' && 'Thank you! Your subscription has been activated. Redirecting to dashboard...'}
          </p>
        </motion.div>

        {checkoutStep === 'select' && (
          <>
            <div className="mb-12">
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handlePlanSelect('basic')}
                  className={`px-6 py-2 rounded-full text-sm font-medium ${
                    selectedPlan === 'basic'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Basic
                </button>
                <button
                  onClick={() => handlePlanSelect('premium')}
                  className={`px-6 py-2 rounded-full text-sm font-medium ${
                    selectedPlan === 'premium'
                      ? 'bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Premium
                </button>
                <button
                  onClick={() => handlePlanSelect('annual')}
                  className={`px-6 py-2 rounded-full text-sm font-medium ${
                    selectedPlan === 'annual'
                      ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Annual
                </button>
              </div>
            </div>

            <PlanComparison currentPlan={user?.planType || 'basic'} selectedPlan={selectedPlan} />

            <div className="mt-12 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCheckout}
                className={`px-8 py-3 rounded-md text-lg font-medium shadow-md ${
                  selectedPlan === 'premium'
                    ? 'bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white hover:from-fuchsia-700 hover:to-violet-700'
                    : selectedPlan === 'annual'
                    ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-white hover:from-amber-600 hover:to-pink-600'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {selectedPlan === 'basic' ? 'Activate Basic Plan' : `Subscribe to ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}`}
              </motion.button>
            </div>
          </>
        )}

        {checkoutStep === 'checkout' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <ErrorBoundary 
              fallbackMessage="There was a problem loading the payment form. Please try again later."
              showReset={true}
              showDetails={false}
            >
              <CheckoutForm
                priceId={getPriceId(selectedPlan)}
                planName={selectedPlan}
                onSuccess={handleCheckoutSuccess}
                onCancel={handleCheckoutCancel}
                error={checkoutError}
                setError={setCheckoutError}
                user={user}
              />
            </ErrorBoundary>
          </motion.div>
        )}

        {checkoutStep === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-block p-6 bg-green-100 rounded-full mb-8">
              <svg className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your subscription is now active!</h2>
            <p className="text-gray-600 mb-8">
              {selectedPlan === 'basic'
                ? 'You now have access to all basic features.'
                : `You now have access to all ${selectedPlan} features. Thank you for your support!`}
            </p>
            <div className="animate-pulse">
              <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Subscribe;
