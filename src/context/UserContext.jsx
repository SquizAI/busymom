import { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../lib/supabaseClient'

export const UserContext = createContext()

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

// Sample dummy user data
const dummyUsers = {
  regularUser: {
    id: 'user123',
    email: 'demo@busywomen.com',
    name: 'Sarah Johnson',
    role: 'user',
    planType: 'premium',
    subscriptionStatus: 'active',
    profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    preferences: {
      dietType: 'vegetarian',
      allergies: ['nuts', 'shellfish'],
      cookingTime: 'quick',
      householdSize: 3
    },
    memberSince: '2023-05-15',
    chatAccess: 'premium'
  },
  adminUser: {
    id: 'admin456',
    email: 'admin@busywomen.com',
    name: 'Jennifer Smith',
    role: 'admin',
    planType: null,
    subscriptionStatus: null,
    profileImage: 'https://randomuser.me/api/portraits/women/68.jpg',
    adminAccess: ['users', 'content', 'billing', 'analytics'],
    chatAccess: 'admin'
  }
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(localStorage.getItem('busywomen_demo_mode') === 'true')

  useEffect(() => {
    // Check for active session on component mount
    const getUser = async () => {
      setLoading(true)
      try {
        // Check if we have a stored demo user
        const storedDemoUser = localStorage.getItem('busywomen_user')
        if (storedDemoUser) {
          const parsedUser = JSON.parse(storedDemoUser)
          setUser(parsedUser)
          setDemoMode(true)
          setLoading(false)
          return
        }
        
        // Otherwise check for real auth session
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (error) {
        console.error('Error checking auth session:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
      }
    )

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loginAsDummy = (userType) => {
    const selectedUser = dummyUsers[userType];
    if (selectedUser) {
      setUser(selectedUser);
      setDemoMode(true);
      localStorage.setItem('busywomen_demo_mode', 'true');
      localStorage.setItem('busywomen_user', JSON.stringify(selectedUser));
    }
  };

  const logoutDummy = () => {
    setUser(null);
    setDemoMode(false);
    localStorage.removeItem('busywomen_demo_mode');
    localStorage.removeItem('busywomen_user');
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const isPremium = () => {
    return user && (user.planType === 'premium' || user.planType === 'annual') && user.subscriptionStatus === 'active';
  };

  const getChatAccessLevel = () => {
    if (!user) return 'basic';
    return user.chatAccess || 'basic';
  };

  return (
    <UserContext.Provider value={{
      user,
      loading,
      loginAsDummy,
      logoutDummy,
      isAdmin,
      isPremium,
      demoMode,
      getChatAccessLevel,
      dummyUsers
    }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
