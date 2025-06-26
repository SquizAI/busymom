import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getFeatureUpgradeInfo } from '../../lib/featureGate';

/**
 * FeatureUpgrade component that prompts users to upgrade when they encounter premium features
 * @param {string} featureKey - The feature key from featureGate.js
 * @param {string} title - Custom title for the upgrade prompt
 * @param {string} description - Custom description for the upgrade prompt
 */
const FeatureUpgrade = ({ featureKey, title, description }) => {
  // Get upgrade information for this feature
  const upgradeInfo = getFeatureUpgradeInfo(featureKey);
  
  if (!upgradeInfo) {
    return null; // No upgrade needed for this feature
  }
  
  // Use custom title/description or fallback to defaults
  const displayTitle = title || `Unlock ${featureKey.toLowerCase().replace(/_/g, ' ')}`;
  const displayDescription = description || upgradeInfo.benefits;
  
  return (
    <motion.div 
      className="bg-gradient-to-r from-fuchsia-50 to-violet-50 rounded-lg shadow-md p-6 border border-fuchsia-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 15 } }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{displayTitle}</h3>
          <p className="mt-2 text-sm text-gray-600">{displayDescription}</p>
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gradient-to-r from-fuchsia-100 to-violet-100 text-fuchsia-800 shadow-sm">
              {upgradeInfo.price}
            </span>
          </div>
        </div>
        <div className="hidden sm:block ml-4">
          <svg 
            className="h-16 w-16 text-fuchsia-400" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
        </div>
      </div>
      <div className="mt-5 sm:mt-6">
        <Link
          to={`/subscribe/${upgradeInfo.requiredTier}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500"
        >
          {upgradeInfo.cta}
          <svg 
            className="ml-2 -mr-1 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

/**
 * Feature Locked component - a simpler version that shows when a feature is locked
 * @param {string} featureKey - The feature key from featureGate.js
 */
export const FeatureLocked = ({ featureKey }) => {
  const upgradeInfo = getFeatureUpgradeInfo(featureKey);
  
  if (!upgradeInfo) {
    return null;
  }
  
  return (
    <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-fuchsia-50 to-violet-50 text-fuchsia-800 border border-fuchsia-100 shadow-sm">
      <svg 
        className="mr-1 h-3 w-3 text-fuchsia-500" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
          clipRule="evenodd" 
        />
      </svg>
      Premium
    </div>
  );
};

export default FeatureUpgrade;
