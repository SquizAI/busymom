# BusyWomen Netlify Deployment Upgrade Plan

## Executive Summary

This document outlines the complete upgrade plan for deploying the BusyWomen meal planning application to Netlify. The application currently has several client-side API calls and mock implementations that need to be converted to proper Netlify Functions for production deployment.

## Current Application Architecture

### Frontend Stack
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Animations**: Framer Motion
- **Build Tool**: Vite

### Current API Integrations
- **AI Services**: Google Gemini API, OpenAI Agents SDK
- **Payment Processing**: Stripe (currently mock implementation)
- **Database**: Supabase (client-side only)
- **Authentication**: Custom demo authentication

## Critical Issues Requiring Netlify Functions

### 1. Payment Processing (High Priority)
**Current State**: Mock Stripe API implementation
**Files Affected**:
- `src/lib/stripeService.js` - Mock payment processing
- `src/lib/stripeIntegration.js` - MCP Stripe integration
- `src/lib/mockStripeApi.js` - Development mock API
- `src/components/subscription/CheckoutForm.jsx` - Client-side payment handling
- `src/api/stripe-checkout.js` - Client-side Stripe redirect
- `src/api/create-checkout-session.js` - Incomplete server function

**Required Netlify Functions**:
1. `/.netlify/functions/create-checkout-session.js`
2. `/.netlify/functions/create-payment-intent.js`
3. `/.netlify/functions/create-subscription.js`
4. `/.netlify/functions/webhook-stripe.js`
5. `/.netlify/functions/create-portal-session.js`

### 2. AI Service Integration (Medium Priority)
**Current State**: Direct client-side API calls to Gemini and OpenAI
**Files Affected**:
- `src/lib/geminiClient.js` - Direct Gemini API calls
- `src/lib/enhancedGeminiClient.js` - Enhanced Gemini integration
- `src/services/geminiService.js` - Gemini service layer
- `src/services/agentService.js` - OpenAI Agents integration

**Required Netlify Functions**:
1. `/.netlify/functions/gemini-meal-recommendations.js`
2. `/.netlify/functions/openai-agent-chat.js`
3. `/.netlify/functions/gemini-analyze-preferences.js`
4. `/.netlify/functions/generate-shopping-list.js`

### 3. Database Operations (Medium Priority)
**Current State**: Direct Supabase client calls
**Files Affected**:
- `src/lib/supabaseClient.js` - Client configuration
- `src/context/UserContext.jsx` - User authentication
- `src/context/StripeContext.jsx` - Subscription management

**Required Netlify Functions**:
1. `/.netlify/functions/auth-login.js`
2. `/.netlify/functions/auth-register.js`
3. `/.netlify/functions/user-profile.js`
4. `/.netlify/functions/subscription-status.js`

## Environment Variables Migration

### Current Environment Variables
```env
# Client-side (VITE_ prefix)
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_STRIPE_BASIC_PRICE_ID=price_basic
VITE_STRIPE_PREMIUM_PRICE_ID=price_premium
VITE_STRIPE_ANNUAL_PRICE_ID=price_annual
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Server-side (for Gemini models)
AI_GEMINI_MODEL_PRO=gemini-2.5-pro-preview-05-06
AI_GEMINI_MODEL_FLASH=gemini-2.5-flash-preview-04-17
```

### Required Netlify Environment Variables
```env
# Server-side API keys (secure)
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Client-side (keep VITE_ prefix)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Configuration
AI_GEMINI_MODEL_PRO=gemini-2.5-pro-preview-05-06
AI_GEMINI_MODEL_FLASH=gemini-2.5-flash-preview-04-17
STRIPE_BASIC_PRICE_ID=price_1RVJwBG00IiCtQkDSRkMTtNI
STRIPE_PREMIUM_PRICE_ID=price_1RVJwJG00IiCtQkDsAOAdp2V
STRIPE_ANNUAL_PRICE_ID=price_1RVJwQG00IiCtQkDyOXs6VcG
```

## Netlify Functions Implementation Plan

### Phase 1: Payment Processing Functions (Week 1)

#### 1.1 Create Checkout Session Function
```javascript
// /.netlify/functions/create-checkout-session.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Implementation for creating Stripe checkout sessions
  // Handle CORS, validation, error handling
  // Return session ID and URL
};
```

#### 1.2 Payment Intent Function
```javascript
// /.netlify/functions/create-payment-intent.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Implementation for creating payment intents
  // Handle amount calculation, customer creation
  // Return client secret for frontend confirmation
};
```

#### 1.3 Stripe Webhook Handler
```javascript
// /.netlify/functions/webhook-stripe.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Handle Stripe webhook events
  // Update subscription status in Supabase
  // Send confirmation emails
};
```

### Phase 2: AI Service Functions (Week 2)

#### 2.1 Gemini Meal Recommendations
```javascript
// /.netlify/functions/gemini-meal-recommendations.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event, context) => {
  // Secure Gemini API integration
  // Process user preferences
  // Return structured meal recommendations
};
```

#### 2.2 OpenAI Agent Chat
```javascript
// /.netlify/functions/openai-agent-chat.js
const { OpenAI } = require('openai');

exports.handler = async (event, context) => {
  // Handle OpenAI Agent SDK integration
  // Manage conversation threads
  // Return chat responses
};
```

### Phase 3: Database Functions (Week 3)

#### 3.1 Authentication Functions
```javascript
// /.netlify/functions/auth-login.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // Handle user authentication
  // JWT token management
  // Return user session data
};
```

#### 3.2 User Profile Management
```javascript
// /.netlify/functions/user-profile.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // CRUD operations for user profiles
  // Preference management
  // Subscription status updates
};
```

## Frontend Modifications Required

### 1. API Client Updates
**Files to Modify**:
- `src/lib/stripeService.js` - Update to call Netlify functions
- `src/lib/geminiClient.js` - Update to call Netlify functions
- `src/services/geminiService.js` - Update API endpoints
- `src/services/agentService.js` - Update to use Netlify functions

### 2. Context Updates
**Files to Modify**:
- `src/context/UserContext.jsx` - Update authentication flow
- `src/context/StripeContext.jsx` - Update payment processing

### 3. Component Updates
**Files to Modify**:
- `src/components/subscription/CheckoutForm.jsx` - Update payment flow
- `src/components/premium/MealPlanChat.jsx` - Update AI integration
- `src/pages/Subscribe.jsx` - Update subscription handling

## Security Considerations

### 1. API Key Security
- Move all API keys to server-side Netlify functions
- Use environment variables for sensitive data
- Implement proper CORS headers

### 2. Authentication
- Implement proper JWT token validation
- Add rate limiting to prevent abuse
- Secure webhook endpoints with signature verification

### 3. Data Validation
- Validate all incoming requests
- Sanitize user inputs
- Implement proper error handling

## Build Configuration

### 1. Netlify Configuration File
```toml
# netlify.toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET, POST, PUT, DELETE, OPTIONS"
    Access-Control-Allow-Headers = "Content-Type, Authorization"
```

### 2. Package.json Updates
```json
{
  "scripts": {
    "build": "vite build",
    "build:functions": "netlify-lambda build netlify/functions",
    "dev:functions": "netlify-lambda serve netlify/functions",
    "dev": "concurrently \"npm run dev:functions\" \"vite\""
  },
  "devDependencies": {
    "netlify-lambda": "^2.0.16",
    "concurrently": "^8.2.2"
  }
}
```

## Testing Strategy

### 1. Local Development
- Use Netlify CLI for local function testing
- Mock external API responses for development
- Test payment flows with Stripe test mode

### 2. Staging Environment
- Deploy to Netlify staging environment
- Test all payment flows end-to-end
- Verify AI integrations work correctly

### 3. Production Deployment
- Gradual rollout with feature flags
- Monitor error rates and performance
- Implement logging and monitoring

## Migration Timeline

### Week 1: Infrastructure Setup
- Set up Netlify project
- Configure environment variables
- Implement payment processing functions
- Update frontend payment integration

### Week 2: AI Integration
- Implement Gemini API functions
- Update OpenAI Agent integration
- Test AI-powered features
- Update frontend AI client code

### Week 3: Database & Authentication
- Implement Supabase server functions
- Update authentication flow
- Test user registration/login
- Implement subscription management

### Week 4: Testing & Deployment
- Comprehensive testing
- Performance optimization
- Security audit
- Production deployment

## Post-Deployment Monitoring

### 1. Performance Metrics
- Function execution times
- API response times
- Error rates
- User conversion rates

### 2. Security Monitoring
- Failed authentication attempts
- Suspicious API usage patterns
- Payment processing errors
- Data breach detection

### 3. Business Metrics
- Subscription conversion rates
- Feature usage analytics
- User engagement metrics
- Revenue tracking

## Rollback Strategy

### 1. Immediate Rollback
- Keep current GitHub Pages deployment active
- DNS switch capability
- Database rollback procedures

### 2. Gradual Migration
- Feature flag implementation
- A/B testing capabilities
- Progressive rollout strategy

## Cost Considerations

### 1. Netlify Costs
- Function execution time
- Bandwidth usage
- Build minutes
- Form submissions

### 2. Third-Party API Costs
- Gemini API usage
- OpenAI API calls
- Stripe transaction fees
- Supabase database usage

## Success Criteria

### 1. Technical Metrics
- 99.9% uptime
- < 2 second page load times
- < 500ms API response times
- Zero security vulnerabilities

### 2. Business Metrics
- Maintain current conversion rates
- Reduce payment processing errors
- Improve user experience scores
- Increase subscription retention

## Conclusion

This comprehensive upgrade plan addresses all critical aspects of migrating the BusyWomen application to Netlify. The phased approach ensures minimal disruption while implementing proper security and scalability measures. The focus on Netlify Functions for server-side processing will provide a robust, scalable foundation for the application's continued growth.

The plan prioritizes payment processing security, AI service reliability, and user experience while maintaining the application's current functionality and performance standards. 