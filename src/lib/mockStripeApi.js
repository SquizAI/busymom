/**
 * Mock Stripe API implementation for development
 * This file provides mock implementations of Stripe API endpoints
 * to allow development without actual backend API calls
 */

// Simulate API response delay
const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 800));

/**
 * Create a checkout session
 * @param {Object} params - Checkout session parameters
 * @returns {Promise<Object>} - Checkout session response
 */
export const createCheckoutSession = async (params) => {
  await simulateApiDelay();
  
  // Generate a mock session ID
  const sessionId = `cs_test_${Math.random().toString(36).substring(2, 15)}`;
  
  console.log('Mock API: Creating checkout session', { params, sessionId });
  
  // Return a mock checkout session
  return {
    id: sessionId,
    url: `#mock-checkout-${params.priceId}`,
    // In a real implementation, this would be a Stripe Checkout URL
  };
};

/**
 * Update a subscription
 * @param {Object} params - Subscription update parameters
 * @returns {Promise<Object>} - Updated subscription
 */
export const updateSubscription = async (params) => {
  await simulateApiDelay();
  
  console.log('Mock API: Updating subscription', params);
  
  // Return a mock updated subscription
  return {
    id: params.subscriptionId || `sub_${Math.random().toString(36).substring(2, 15)}`,
    status: 'active',
    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    items: {
      data: [
        {
          id: `si_${Math.random().toString(36).substring(2, 15)}`,
          price: {
            id: params.newPriceId,
          },
        },
      ],
    },
  };
};

/**
 * Cancel a subscription
 * @param {Object} params - Cancellation parameters
 * @returns {Promise<Object>} - Cancelled subscription
 */
export const cancelSubscription = async (params) => {
  await simulateApiDelay();
  
  console.log('Mock API: Cancelling subscription', params);
  
  // Return a mock cancelled subscription
  return {
    id: params.subscriptionId,
    status: 'canceled',
    cancel_at_period_end: true,
    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
};

/**
 * Create a customer portal session
 * @param {Object} params - Portal session parameters
 * @returns {Promise<Object>} - Portal session
 */
export const createPortalSession = async (params) => {
  await simulateApiDelay();
  
  console.log('Mock API: Creating customer portal session', params);
  
  // Return a mock portal session
  return {
    url: params.returnUrl || '#mock-customer-portal',
    // In a real implementation, this would be a Stripe Customer Portal URL
  };
};

/**
 * Create a payment intent
 * @param {Object} params - Payment intent parameters
 * @returns {Promise<Object>} - Payment intent
 */
export const createPaymentIntent = async (params) => {
  await simulateApiDelay();
  
  const paymentIntentId = `pi_${Math.random().toString(36).substring(2, 15)}`;
  
  console.log('Mock API: Creating payment intent', { params, paymentIntentId });
  
  // Return a mock payment intent
  return {
    id: paymentIntentId,
    client_secret: `${paymentIntentId}_secret_${Math.random().toString(36).substring(2, 15)}`,
    amount: params.amount || 999,
    currency: params.currency || 'usd',
    status: 'requires_payment_method',
  };
};

/**
 * Process a payment
 * @param {Object} params - Payment parameters
 * @returns {Promise<Object>} - Payment result
 */
export const processPayment = async (params) => {
  await simulateApiDelay();
  
  console.log('Mock API: Processing payment', params);
  
  // Simulate payment success (95% of the time)
  const isSuccess = Math.random() < 0.95;
  
  if (isSuccess) {
    return {
      success: true,
      paymentIntent: {
        id: `pi_${Math.random().toString(36).substring(2, 15)}`,
        status: 'succeeded',
      },
    };
  } else {
    // Simulate payment failure
    throw new Error('Your card was declined. Please try a different payment method.');
  }
};
