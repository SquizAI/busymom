import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './styles/browser-fixes.css'
import { UserProvider } from './context/UserContext'
import { StripeProvider } from './context/StripeContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <StripeProvider>
        <App />
      </StripeProvider>
    </UserProvider>
  </React.StrictMode>,
)
