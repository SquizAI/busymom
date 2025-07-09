import { createContext, useState, useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { loadStripe } from '@stripe/stripe-js';
import * as mockStripeApi from '../lib/mockStripeApi';

export const StripeContext = createContext();

export const StripeProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      
      // Skip if Supabase is not configured
      if (!isSupabaseConfigured) {
        setSubscription(null);
        return;
      }
      
      // Get subscription from Supabase
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create a checkout session for the selected plan
  const createCheckoutSession = async (priceId, successUrl, cancelUrl) => {
    try {
      // Use mock API for development
      const session = await mockStripeApi.createCheckoutSession({
        priceId,
        userId: user?.id,
        successUrl: successUrl || window.location.origin + '/dashboard?checkout=success',
        cancelUrl: cancelUrl || window.location.origin + '/pricing?checkout=cancel',
      });
      
      // For demo purposes, simulate successful checkout instead of redirecting
      console.log('Checkout session created:', session);
      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  };

  // Handle subscription changes (upgrade, downgrade, cancel)
  const updateSubscription = async (newPriceId) => {
    try {
      // Use mock API for development
      const result = await mockStripeApi.updateSubscription({
        subscriptionId: subscription?.stripe_subscription_id,
        newPriceId,
      });
      
      // Refresh subscription data
      await fetchSubscription();
      return result;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    try {
      // Use mock API for development
      const result = await mockStripeApi.cancelSubscription({
        subscriptionId: subscription?.stripe_subscription_id,
      });
      
      // Refresh subscription data
      await fetchSubscription();
      return result;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  };

  // Customer portal for subscription management
  const redirectToCustomerPortal = async () => {
    try {
      // Use mock API for development
      const session = await mockStripeApi.createPortalSession({
        customerId: subscription?.stripe_customer_id,
        returnUrl: window.location.origin + '/dashboard',
      });
      
      // For demo purposes, log instead of redirecting
      console.log('Customer portal session created:', session);
      return session;
    } catch (error) {
      console.error('Error redirecting to customer portal:', error);
      throw error;
    }
  };

  // Helper function for direct redirect to Stripe Checkout
  const redirectToCheckout = async (priceId) => {
    try {
      // Create a new Checkout Session
      const session = await createCheckoutSession(priceId);
      
      // For demo purposes, simulate successful checkout
      console.log('Redirecting to checkout:', session);
      return session;
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      throw error;
    }
  };

  return (
    <StripeContext.Provider
      value={{
        subscription,
        loading,
        createCheckoutSession,
        updateSubscription,
        cancelSubscription,
        redirectToCustomerPortal,
        redirectToCheckout,
        refreshSubscription: fetchSubscription,
      }}
    >
      {children}
    </StripeContext.Provider>
  );
};

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (context === undefined) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};
