# BusyWomen Meal Planner - Setup Guide

## Overview
This guide will help you set up the BusyWomen Meal Planner app with all its enhanced features including AI-powered meal image generation, Supabase authentication, and advanced meal planning capabilities.

## Prerequisites
- Node.js 18+ and npm
- Supabase account
- OpenAI API key (for image generation)
- Google Gemini API key (for meal generation)
- Stripe account (optional, for payments)

## 1. Environment Setup

### Create `.env` file
Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

### Required Environment Variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini API (for meal generation)
GEMINI_API_KEY=your_gemini_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key

# OpenAI API (for image generation)
OPENAI_API_KEY=your_openai_api_key
VITE_OPENAI_API_KEY=your_openai_api_key

# Stripe (optional, for payments)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## 2. Supabase Setup

### Create Database Tables
Run the SQL schema in your Supabase SQL editor:

```sql
-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  subscription JSONB DEFAULT '{"plan": "free", "status": "active"}'::jsonb,
  preferences JSONB DEFAULT '{}'::jsonb,
  family_profiles JSONB DEFAULT '[]'::jsonb,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meal History table
CREATE TABLE IF NOT EXISTS public.meal_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  meal_data JSONB NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  day TEXT,
  last_used TIMESTAMPTZ DEFAULT NOW(),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_meal UNIQUE(user_id, name)
);

-- Meal Plans table
CREATE TABLE IF NOT EXISTS public.meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_data JSONB NOT NULL,
  week_of DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shopping Lists table
CREATE TABLE IF NOT EXISTS public.shopping_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  meal_plan_id UUID REFERENCES public.meal_plans(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_meal_history_user_id ON public.meal_history(user_id);
CREATE INDEX idx_meal_history_last_used ON public.meal_history(last_used DESC);
CREATE INDEX idx_meal_history_favorite ON public.meal_history(user_id, is_favorite);
CREATE INDEX idx_meal_plans_user_week ON public.meal_plans(user_id, week_of);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own meal history" ON public.meal_history
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own meal plans" ON public.meal_plans
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own shopping lists" ON public.shopping_lists
  FOR ALL USING (auth.uid() = user_id);

-- Create user on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## 3. Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 4. Features Overview

### AI-Powered Features
1. **Meal Generation**: Uses Google Gemini to generate personalized meal plans
2. **Image Generation**: Uses OpenAI DALL-E 3 to create beautiful meal images
3. **Smart Meal Swapping**: AI suggests alternative meals based on preferences

### UX Enhancements Implemented
1. ✅ Progressive Onboarding Flow
2. ✅ Quick Actions Bar (floating buttons)
3. ✅ Meal Swap Feature with AI alternatives
4. ✅ Visual Meal Cards with AI-generated images
5. ✅ Drag-and-Drop Meal Planning
6. ✅ Recipe Scaling (adjust servings)
7. ✅ Nutritional Dashboard with charts
8. ✅ Meal History & Favorites
9. ✅ Family Member Profiles
10. ✅ Offline Mode with caching
11. ✅ Smart Notifications
12. ✅ Budget Tracker
13. ✅ Meal Prep Mode

### Subscription Tiers
- **Free**: 3 meals/week, basic features
- **Basic**: Full week planning, meal history, quick swaps
- **Premium**: Nutrition analysis, family profiles, budget tracking
- **Premium+**: All features including AI chef, health goals, advanced analytics

## 5. Deployment

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy with these settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

### Environment Variables in Netlify
Add all variables from your `.env` file to Netlify's environment variables section.

## 6. Testing

### Test Users
- Free tier: `free@example.com`
- Basic tier: `basic@example.com`
- Premium tier: `premium@example.com`

### Key Features to Test
1. **Onboarding**: First-time user flow
2. **Meal Generation**: Generate weekly meal plans
3. **Image Generation**: Create AI images for meals
4. **Drag & Drop**: Reorder meals between days
5. **Offline Mode**: Works without internet
6. **Family Profiles**: Multiple user preferences
7. **Budget Tracking**: Track meal costs

## 7. Troubleshooting

### Common Issues

1. **Images not generating**
   - Check OpenAI API key is valid
   - Ensure user has Basic+ subscription
   - Check browser console for errors

2. **Meal generation fails**
   - Verify Gemini API key
   - Check Netlify function logs
   - Ensure CORS is properly configured

3. **Supabase authentication issues**
   - Verify Supabase URL and anon key
   - Check RLS policies are enabled
   - Ensure user table trigger is created

## 8. API Keys Management

### OpenAI API
- Get key from: https://platform.openai.com/api-keys
- Required for image generation
- Costs: ~$0.04 per image (DALL-E 3)

### Google Gemini API
- Get key from: https://makersuite.google.com/app/apikey
- Required for meal generation
- Free tier available

### Supabase
- Create project at: https://supabase.com
- Free tier includes authentication and database

## Support

For issues or questions:
- GitHub Issues: [Report bugs](https://github.com/anthropics/claude-code/issues)
- Documentation: Check `/docs` folder
- API Documentation: See individual service files