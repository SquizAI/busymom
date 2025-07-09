import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { StripeProvider } from './context/StripeContext'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

// Import pages
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Pricing from './pages/Pricing'
import Subscribe from './pages/Subscribe'
import MealPlanner from './components/mealplanning/MealPlanner'
import MealPlans from './pages/MealPlans'
import Meals from './pages/Meals'
import PremiumMealPlanner from './pages/PremiumMealPlanner'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Refund from './pages/Refund'
import NotFound from './pages/NotFound'

// Import components
import Layout from './components/layout/Layout'

// App wrapper component for providers
const AppWrapper = ({ children }) => (
  <UserProvider>
    <AuthProvider>
      <StripeProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
        {children}
      </StripeProvider>
    </AuthProvider>
  </UserProvider>
);

// Create router with future flags
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppWrapper><Layout><Home /></Layout></AppWrapper>,
  },
  {
    path: "/register",
    element: <AppWrapper><Layout><Register /></Layout></AppWrapper>,
  },
  {
    path: "/login",
    element: <AppWrapper><Layout><Login /></Layout></AppWrapper>,
  },
  {
    path: "/dashboard",
    element: <AppWrapper><Layout><Dashboard /></Layout></AppWrapper>,
  },
  {
    path: "/pricing",
    element: <AppWrapper><Layout><Pricing /></Layout></AppWrapper>,
  },
  {
    path: "/subscribe",
    element: <AppWrapper><Layout><Subscribe /></Layout></AppWrapper>,
  },
  {
    path: "/subscribe/:planId",
    element: <AppWrapper><Layout><Subscribe /></Layout></AppWrapper>,
  },
  {
    path: "/meal-planner",
    element: <AppWrapper><Layout><MealPlanner /></Layout></AppWrapper>,
  },
  {
    path: "/meal-plans",
    element: <AppWrapper><Layout><MealPlans /></Layout></AppWrapper>,
  },
  {
    path: "/meals",
    element: <AppWrapper><Layout><Meals /></Layout></AppWrapper>,
  },
  {
    path: "/premium-meal-planner",
    element: <AppWrapper><Layout><PremiumMealPlanner /></Layout></AppWrapper>,
  },
  {
    path: "/terms",
    element: <AppWrapper><Layout><Terms /></Layout></AppWrapper>,
  },
  {
    path: "/privacy",
    element: <AppWrapper><Layout><Privacy /></Layout></AppWrapper>,
  },
  {
    path: "/refund",
    element: <AppWrapper><Layout><Refund /></Layout></AppWrapper>,
  },
  {
    path: "*",
    element: <AppWrapper><Layout><NotFound /></Layout></AppWrapper>,
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
})

function App() {
  return <RouterProvider router={router} />
}

export default App
