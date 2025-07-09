# Netlify Deployment Guide for BusyWomen

## Environment Variables Setup

### Required Environment Variables in Netlify Dashboard

Navigate to Site Settings > Environment Variables and add:

```
# Gemini API (for serverless functions)
GEMINI_API_KEY=your_actual_gemini_api_key

# Frontend Environment Variables
VITE_GEMINI_API_KEY=your_actual_gemini_api_key
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_STRIPE_BASIC_PRICE_ID=price_1234567890
VITE_STRIPE_PREMIUM_PRICE_ID=price_0987654321
VITE_STRIPE_ANNUAL_PRICE_ID=price_1122334455

# OpenAI (if using chat features)
OPENAI_API_KEY=your_openai_api_key
```

## Deployment Steps

1. **Connect GitHub Repository**
   - In Netlify dashboard, click "Import an existing project"
   - Select your GitHub repository
   - Netlify will auto-detect the build settings from `netlify.toml`

2. **Configure Build Settings** (auto-configured by netlify.toml)
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

3. **Set Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add all variables listed above
   - Make sure to use your actual API keys

4. **Deploy**
   - Click "Deploy site"
   - First deployment may take 2-3 minutes

## Netlify Functions

The following serverless functions are available:

### `/api/generate-meal-plan`
- **Method**: POST
- **Body**: `{ preferences, userTier }`
- **Description**: Generates meal plans using Gemini API

### `/api/generate-shopping-list`
- **Method**: POST  
- **Body**: `{ mealPlan, userTier, pantryItems }`
- **Description**: Creates organized shopping lists

### `/api/swap-meal`
- **Method**: POST
- **Body**: `{ currentMeal, preferences, userTier }`
- **Description**: Suggests meal alternatives (Basic+ tiers)

### `/api/nutrition-insights`
- **Method**: POST
- **Body**: `{ mealPlan, familyProfiles, userTier }`
- **Description**: Provides nutrition analysis (Premium+ tiers)

## API Model Selection

- **Free/Basic Tiers**: Uses Gemini 2.0 Flash (faster, cost-effective)
- **Premium/Premium+ Tiers**: Uses Gemini 1.5 Pro (advanced features)

## Cost Optimization

1. **Function Timeout**: Set to 10 seconds (free tier limit)
2. **Model Selection**: Flash model for basic operations reduces API costs
3. **Caching**: Consider implementing Redis/Upstash for frequent requests

## Security Considerations

1. **API Keys**: Never commit API keys to repository
2. **CORS**: Configured to allow frontend access
3. **Rate Limiting**: Consider implementing rate limiting for production
4. **Input Validation**: Functions validate user tier and inputs

## Testing Locally

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run development server with functions
netlify dev

# Test functions at http://localhost:8888/.netlify/functions/[function-name]
```

## Monitoring

1. **Netlify Functions Tab**: Monitor invocations and errors
2. **Function Logs**: Available in Netlify dashboard
3. **Analytics**: Track API usage and costs

## Troubleshooting

### Common Issues:

1. **"Server configuration error"**
   - Check GEMINI_API_KEY is set in Netlify environment variables

2. **CORS errors**
   - Ensure frontend uses correct function URLs
   - Check netlify.toml headers configuration

3. **Timeout errors**
   - Optimize prompts for faster responses
   - Consider upgrading Netlify plan for longer timeouts

4. **Build failures**
   - Check Node version matches (18.x)
   - Ensure all dependencies are in package.json

## Performance Tips

1. Use environment-specific API endpoints
2. Implement request debouncing on frontend
3. Cache meal plans in localStorage
4. Use loading states for better UX

## Next Steps

1. Set up custom domain
2. Enable Netlify Analytics
3. Configure deploy previews
4. Set up monitoring alerts
5. Implement A/B testing for meal suggestions