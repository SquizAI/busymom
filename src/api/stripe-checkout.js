// Stripe API helpers for client-side redirects
import { loadStripe } from '@stripe/stripe-js';

let stripePromise = null;

// Load and initialize Stripe
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Create a Checkout Session for the specified price ID
export const createCheckoutSession = async (priceId, customerId = null) => {
  const stripe = await getStripe();

  // Redirect to Checkout
  const { error } = await stripe.redirectToCheckout({
    mode: 'subscription',
    lineItems: [{ price: priceId, quantity: 1 }],
    successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${window.location.origin}/pricing`,
    customerEmail: customerId, // Optional: pre-fill the email if we have it
  });

  if (error) {
    console.error('Stripe checkout error:', error);
    throw new Error(error.message);
  }
};

// Redirect to Stripe Customer Portal for subscription management
export const redirectToCustomerPortal = async (customerId) => {
  try {
    // Typically you'd have a server endpoint to create a portal session
    // For now, we'll simulate with a client-side redirect for demo purposes
    console.log(`Would redirect customer ${customerId} to portal`);
    
    // In a real implementation, you would:
    // 1. Call your backend API to create a portal session
    // 2. Redirect to the returned URL
    
    return { success: true, message: 'Portal simulation successful' };
  } catch (error) {
    console.error('Customer portal error:', error);
    throw new Error(error.message);
  }
};
