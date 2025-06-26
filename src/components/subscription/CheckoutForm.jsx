import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import LoadingSpinner from '../common/LoadingSpinner';

// Initialize Stripe with the publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Format price for display
const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount / 100);
};

// Price amounts in cents
const PRICE_AMOUNTS = {
  BASIC: 999, // $9.99
  PREMIUM: 1999, // $19.99
  ANNUAL: 9999 // $99.99
};

const CheckoutForm = ({ priceId, planName, onSuccess, onCancel, error, setError, user }) => {
  // Use environment variables for price IDs
  const getPriceId = () => {
    if (priceId) return priceId;
    
    if (planName === 'premium') {
      return import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID;
    } else if (planName === 'annual') {
      return import.meta.env.VITE_STRIPE_ANNUAL_PRICE_ID;
    } else {
      return import.meta.env.VITE_STRIPE_BASIC_PRICE_ID;
    }
  };
  
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormContent
        priceId={getPriceId()}
        planName={planName}
        onSuccess={onSuccess}
        onCancel={onCancel}
        error={error}
        setError={setError}
        user={user}
      />
    </Elements>
  );
};

const CheckoutFormContent = ({ priceId, planName, onSuccess, onCancel, error, setError, user }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const [billingDetails, setBillingDetails] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  // Create a payment intent when the component mounts
  useEffect(() => {
    const createIntent = async () => {
      try {
        setIsInitializing(true);
        
        // Get the amount based on the plan
        let amount;
        if (planName === 'premium') {
          amount = PRICE_AMOUNTS.PREMIUM;
        } else if (planName === 'annual') {
          amount = PRICE_AMOUNTS.ANNUAL;
        } else {
          amount = PRICE_AMOUNTS.BASIC;
        }
        
        // Call our backend API to create a payment intent
        // This keeps our Stripe secret key secure on the server
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            priceId, 
            customerId: user?.stripeCustomerId,
            email: user?.email,
            name: user?.name
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create payment intent');
        }
        
        const data = await response.json();
        
        // Set the client secret from the payment intent
        setClientSecret(data.clientSecret);
        setPaymentIntent({
          id: data.id,
          amount: data.amount,
          currency: data.currency
        });
      } catch (err) {
        console.error("Error creating payment intent:", err);
        setError?.("Failed to initialize payment system. Please try again.");
      } finally {
        setIsInitializing(false);
      }
    };

    if (stripe) {
      createIntent();
    }
  }, [priceId, setError, planName, user, stripe]);

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  const handleBillingDetailsChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    if (!cardComplete) {
      setError("Please complete your card details.");
      return;
    }

    if (!billingDetails.name || !billingDetails.email) {
      setError("Please provide your name and email.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Get the card element
      const cardElement = elements.getElement(CardElement);
      
      // Use the card element with the clientSecret to confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingDetails.name,
            email: billingDetails.email
          }
        }
      });
      
      if (result.error) {
        // Show error to your customer
        console.error("Payment confirmation error:", result.error);
        setError(result.error.message || "Payment failed. Please try again.");
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        // The payment succeeded!
        console.log("Payment succeeded!", result.paymentIntent);
        
        // Call our backend API to update the user's subscription status
        try {
          const subscriptionResponse = await fetch('/api/create-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentIntentId: result.paymentIntent.id,
              priceId,
              userId: user?.id
            })
          });
          
          if (!subscriptionResponse.ok) {
            const errorData = await subscriptionResponse.json();
            throw new Error(errorData.message || 'Failed to create subscription');
          }
          
          // Call the onSuccess callback
          onSuccess?.();
        } catch (subscriptionError) {
          console.error("Subscription error:", subscriptionError);
          setError("Payment succeeded but we couldn't activate your subscription. Our team has been notified.");
        }
      } else {
        // Unexpected result
        setError("An unexpected error occurred. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4">
        <LoadingSpinner />
        <p className="text-gray-600">Initializing payment system...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {planName === 'premium' ? 'Premium Monthly' : 'Annual'} Subscription
            </h3>
            <span className="px-3 py-1 bg-gradient-to-r from-fuchsia-100 to-violet-100 text-fuchsia-800 text-sm font-medium rounded-full">
              {planName === 'premium' 
                ? formatPrice(PRICE_AMOUNTS.PREMIUM) + '/month' 
                : formatPrice(PRICE_AMOUNTS.ANNUAL) + '/year'}
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            {planName === 'premium'
              ? `You'll be charged ${formatPrice(PRICE_AMOUNTS.PREMIUM)} (plus applicable taxes) each month until you cancel.`
              : `You'll be charged ${formatPrice(PRICE_AMOUNTS.ANNUAL)} (plus applicable taxes) each year until you cancel.`}
          </p>
        </div>
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Jane Doe"
            required
            value={billingDetails.name}
            onChange={(e) => setBillingDetails({ ...billingDetails, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="jane@example.com"
            required
            value={billingDetails.email}
            onChange={(e) => setBillingDetails({ ...billingDetails, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="card" className="block text-sm font-medium text-gray-700 mb-1">
            Card Information
          </label>
          <div className="p-3 border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-fuchsia-500 focus-within:border-fuchsia-500">
            <CardElement
              id="card"
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
              onChange={(e) => setCardComplete(e.complete)}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            For demo purposes, use card number: 4242 4242 4242 4242, any future date, any CVC, and any postal code.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || isProcessing || !cardComplete}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
              planName === 'premium'
                ? 'bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-700 hover:to-violet-700'
                : 'bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:opacity-50`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payment...
              </span>
            ) : (
              `Subscribe for ${planName === 'premium' ? '$9.99/month' : '$99.99/year'}`
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          <span className="ml-2 text-sm text-gray-600">Your payment is secure and encrypted</span>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          By subscribing, you agree to our Terms of Service and Privacy Policy. You can cancel your subscription at any time from your account settings.
        </p>
      </div>
    </div>
  );
};

export default CheckoutForm;
