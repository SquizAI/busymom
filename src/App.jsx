import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <UserProvider>
      <AuthProvider>
        <StripeProvider>
          <Router>
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
            <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/register" element={<Layout><Register /></Layout>} />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
            <Route path="/subscribe" element={<Layout><Subscribe /></Layout>} />
            <Route path="/subscribe/:planId" element={<Layout><Subscribe /></Layout>} />
            <Route path="/meal-planner" element={<Layout><MealPlanner /></Layout>} />
            <Route path="/meal-plans" element={<Layout><MealPlans /></Layout>} />
            <Route path="/meals" element={<Layout><Meals /></Layout>} />
            <Route path="/premium-meal-planner" element={<Layout><PremiumMealPlanner /></Layout>} />
            <Route path="/terms" element={<Layout><Terms /></Layout>} />
            <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
            <Route path="/refund" element={<Layout><Refund /></Layout>} />
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </Router>
      </StripeProvider>
      </AuthProvider>
    </UserProvider>
  )
}

export default App
