/**
 * Direct Stripe Integration using MCP tools
 */

// Helper function to format price for display
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount / 100);
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
