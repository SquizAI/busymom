/**
 * Feature Gate utility for BusyWomen app
 * Manages access to premium features based on user subscription status
 */

// Feature definitions with their access levels
const FEATURES = {
  // Basic features available to all users
  BASIC_MEAL_PLAN: { minTier: 'basic' },
  SIMPLE_SHOPPING_LIST: { minTier: 'basic' },
  BASIC_DASHBOARD: { minTier: 'basic' },
  RECIPE_SEARCH: { minTier: 'basic' },
  
  // Premium features requiring paid subscription
  ENHANCED_MEAL_PLAN: { minTier: 'premium' },
  SMART_SHOPPING_LIST: { minTier: 'premium' },
  NUTRITION_INSIGHTS: { minTier: 'premium' },
  MEAL_CUSTOMIZATION: { minTier: 'premium' },
  RECIPE_SUBSTITUTION: { minTier: 'premium' },
  PANTRY_MANAGEMENT: { minTier: 'premium' },
  
  // Annual plan exclusive features
  MEAL_PREP_PLANNING: { minTier: 'annual' },
  ADVANCED_ANALYTICS: { minTier: 'annual' },
  HEALTH_GOAL_TRACKING: { minTier: 'annual' },
};

// Subscription tier hierarchy
const TIER_HIERARCHY = {
  'basic': 0,
  'premium': 1,
  'annual': 2
};

/**
 * Check if a user has access to a specific feature
 * @param {string} featureKey - The feature key to check access for
 * @param {Object} user - The user object containing subscription information
 * @returns {boolean} - Whether the user has access to the feature
 */
export const hasAccess = (featureKey, user) => {
  // If feature doesn't exist, deny access
  if (!FEATURES[featureKey]) {
    console.warn(`Feature ${featureKey} is not defined in the feature gate`);
    return false;
  }
  
  // Default to basic tier if user or subscription info is missing
  const userTier = user?.subscription?.tier || 'basic';
  
  // Get minimum tier required for the feature
  const requiredTier = FEATURES[featureKey].minTier;
  
  // Compare tier levels
  return TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[requiredTier];
};

/**
 * Get all features available to a user based on their subscription tier
 * @param {Object} user - The user object containing subscription information
 * @returns {Object} - Object with feature keys and access boolean values
 */
export const getAvailableFeatures = (user) => {
  const userTier = user?.subscription?.tier || 'basic';
  
  return Object.keys(FEATURES).reduce((acc, featureKey) => {
    acc[featureKey] = TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[FEATURES[featureKey].minTier];
    return acc;
  }, {});
};

/**
 * Check if user has premium access (any paid tier)
 * @param {Object} user - The user object containing subscription information
 * @returns {boolean} - Whether the user has premium access
 */
export const isPremiumUser = (user) => {
  const userTier = user?.subscription?.tier || 'basic';
  return userTier === 'premium' || userTier === 'annual';
};

/**
 * Check if user has annual plan access
 * @param {Object} user - The user object containing subscription information
 * @returns {boolean} - Whether the user has annual plan access
 */
export const isAnnualUser = (user) => {
  const userTier = user?.subscription?.tier || 'basic';
  return userTier === 'annual';
};

/**
 * Get feature upgrade information
 * @param {string} featureKey - The feature key to get upgrade info for
 * @returns {Object} - Upgrade information including tier required and benefits
 */
export const getFeatureUpgradeInfo = (featureKey) => {
  if (!FEATURES[featureKey]) {
    return null;
  }
  
  const requiredTier = FEATURES[featureKey].minTier;
  
  // Feature-specific upgrade messaging
  const upgradeInfo = {
    'premium': {
      cta: 'Upgrade to Premium',
      price: '$9.99/month',
      benefits: 'Access to advanced AI meal planning, nutrition insights, and smart shopping lists'
    },
    'annual': {
      cta: 'Upgrade to Annual Plan',
      price: '$99.99/year',
      benefits: 'All Premium features plus meal prep planning, advanced analytics, and health goal tracking'
    }
  };
  
  return requiredTier !== 'basic' ? {
    requiredTier,
    ...upgradeInfo[requiredTier]
  } : null;
};

export default {
  hasAccess,
  getAvailableFeatures,
  isPremiumUser,
  isAnnualUser,
  getFeatureUpgradeInfo,
  FEATURES
};
