/**
 * Stripe Service - Real Stripe API integration
 * This file provides actual Stripe API functionality using the Stripe MCP tools
 */

// Helper function to format price for display
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount / 100);
};

/**
 * Create a checkout session for subscription
 * @param {Object} params - Checkout session parameters
 * @returns {Promise<Object>} - Checkout session response
 */
export const createCheckoutSession = async (params) => {
  try {
    // In a real implementation, this would call your backend API
    // which would then use Stripe's server-side SDK to create a checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

/**
 * Update a subscription
 * @param {Object} params - Subscription update parameters
 * @returns {Promise<Object>} - Updated subscription
 */
export const updateSubscription = async (params) => {
  try {
    const response = await fetch('/api/update-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update subscription');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

/**
 * Cancel a subscription
 * @param {Object} params - Cancellation parameters
 * @returns {Promise<Object>} - Cancelled subscription
 */
export const cancelSubscription = async (params) => {
  try {
    const response = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
};

/**
 * Create a customer portal session
 * @param {Object} params - Portal session parameters
 * @returns {Promise<Object>} - Portal session
 */
export const createPortalSession = async (params) => {
  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

/**
 * Create a payment intent
 * @param {Object} params - Payment intent parameters
 * @returns {Promise<Object>} - Payment intent
 */
export const createPaymentIntent = async (params) => {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

/**
 * Process a payment
 * @param {Object} params - Payment parameters
 * @returns {Promise<Object>} - Payment result
 */
export const processPayment = async (params) => {
  try {
    const response = await fetch('/api/process-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error('Failed to process payment');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};

// Stripe product and price constants from our actual Stripe account
export const STRIPE_PRODUCTS = {
  BASIC: 'prod_SQAFA05BulsO70',
  PREMIUM: 'prod_SQAG68wgCnq3Oi',
  ANNUAL: 'prod_SQAGSgRh5bVGFf'
};

export const STRIPE_PRICES = {
  BASIC: 'price_1RVJwBG00IiCtQkDSRkMTtNI',
  PREMIUM: 'price_1RVJwJG00IiCtQkDsAOAdp2V',
  ANNUAL: 'price_1RVJwQG00IiCtQkDyOXs6VcG'
};

export const PRICE_AMOUNTS = {
  BASIC: 999, // $9.99
  PREMIUM: 1999, // $19.99
  ANNUAL: 9999 // $99.99
};
