import React, { createContext, useContext } from 'react';
import { UserContext } from '../context/UserContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const userContext = useContext(UserContext);
  
  // Map user data to subscription tiers
  const getSubscriptionPlan = () => {
    if (!userContext.user) return 'free';
    
    const { planType, subscriptionStatus } = userContext.user;
    
    if (subscriptionStatus !== 'active') return 'free';
    
    switch (planType) {
      case 'premium':
        return 'premium';
      case 'annual':
        return 'premiumPlus';
      case 'basic':
        return 'basic';
      default:
        return 'free';
    }
  };
  
  const currentUser = userContext.user ? {
    ...userContext.user,
    subscription: {
      plan: getSubscriptionPlan(),
      tier: userContext.user.planType,
      status: userContext.user.subscriptionStatus
    }
  } : null;
  
  return (
    <AuthContext.Provider value={{
      currentUser,
      loading: userContext.loading,
      isAuthenticated: !!userContext.user,
      logout: userContext.logoutDummy,
      ...userContext
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;