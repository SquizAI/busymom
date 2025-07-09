import { supabase, isSupabaseConfigured } from './supabaseClient';

// Helper function to get the current user
const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('User not authenticated');
  }
  return user;
};

// User Profile/Preferences Functions
export const getUserData = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

export const updateUserPreferences = async (userId, preferences) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        preferences,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
};

export const updateUserData = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};

// Family Profiles Functions
export const getFamilyProfiles = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('family_profiles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting family profiles:', error);
    throw error;
  }
};

export const updateFamilyProfiles = async (userId, profiles) => {
  try {
    // First, delete existing profiles for this user
    const { error: deleteError } = await supabase
      .from('family_profiles')
      .delete()
      .eq('user_id', userId);

    if (deleteError) throw deleteError;

    // Then insert the new profiles
    if (profiles.length > 0) {
      const profilesWithUserId = profiles.map(profile => ({
        ...profile,
        user_id: userId,
        created_at: profile.created_at || new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('family_profiles')
        .insert(profilesWithUserId)
        .select();

      if (error) throw error;
      return data;
    }

    return [];
  } catch (error) {
    console.error('Error updating family profiles:', error);
    throw error;
  }
};

// Alternative: Store family profiles as JSONB in users table
export const updateUserFamilyProfiles = async (userId, familyProfiles) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        family_profiles: familyProfiles,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating family profiles:', error);
    throw error;
  }
};

// Meal History Functions
export const getMealHistory = async (userId, filters = {}) => {
  try {
    let query = supabase
      .from('meal_history')
      .select('*')
      .eq('user_id', userId)
      .order('last_used', { ascending: false });

    // Apply filters
    if (filters.isFavorite) {
      query = query.eq('is_favorite', true);
    }

    if (filters.fromDate) {
      query = query.gte('last_used', filters.fromDate.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting meal history:', error);
    throw error;
  }
};

export const addMealToHistory = async (userId, meal) => {
  try {
    const mealData = {
      user_id: userId,
      name: meal.name,
      description: meal.description,
      ingredients: meal.ingredients,
      prep_time: meal.prepTime,
      calories: meal.calories,
      is_favorite: meal.isFavorite || false,
      rating: meal.rating || 0,
      last_used: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('meal_history')
      .insert(mealData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding meal to history:', error);
    throw error;
  }
};

export const updateMealHistory = async (mealId, updates) => {
  try {
    const { data, error } = await supabase
      .from('meal_history')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', mealId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating meal history:', error);
    throw error;
  }
};

export const toggleMealFavorite = async (mealId, currentStatus) => {
  return updateMealHistory(mealId, { is_favorite: !currentStatus });
};

export const rateMeal = async (mealId, rating) => {
  return updateMealHistory(mealId, { rating });
};

// Meal Plans Functions
export const saveMealPlan = async (userId, mealPlan) => {
  try {
    const planData = {
      user_id: userId,
      name: mealPlan.name,
      meals: mealPlan.meals,
      week_start: mealPlan.weekStart,
      week_end: mealPlan.weekEnd,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('meal_plans')
      .insert(planData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving meal plan:', error);
    throw error;
  }
};

export const getMealPlans = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting meal plans:', error);
    throw error;
  }
};

// Shopping Lists Functions
export const saveShoppingList = async (userId, shoppingList) => {
  try {
    const listData = {
      user_id: userId,
      items: shoppingList.items,
      meal_plan_id: shoppingList.mealPlanId,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('shopping_lists')
      .insert(listData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving shopping list:', error);
    throw error;
  }
};

export const getShoppingLists = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('shopping_lists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting shopping lists:', error);
    throw error;
  }
};

// Initialize user data (for new users)
export const initializeUserData = async (userId, email, initialData = {}) => {
  try {
    const userData = {
      id: userId,
      email,
      preferences: initialData.preferences || {},
      onboarding_completed: initialData.onboardingCompleted || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) {
      // If user already exists, update instead
      if (error.code === '23505') { // Unique violation
        return updateUserData(userId, initialData);
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error initializing user data:', error);
    throw error;
  }
};

// Batch operations for better performance
export const batchUpdateMealHistory = async (meals) => {
  try {
    const { data, error } = await supabase
      .from('meal_history')
      .upsert(meals, { onConflict: 'id' })
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error batch updating meal history:', error);
    throw error;
  }
};

// Real-time subscriptions
export const subscribeToUserUpdates = (userId, callback) => {
  const subscription = supabase
    .channel(`user-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${userId}`
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return subscription;
};

export const subscribeToCamilyProfiles = (userId, callback) => {
  const subscription = supabase
    .channel(`family-profiles-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'family_profiles',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return subscription;
};

// Cleanup subscriptions
export const unsubscribe = (subscription) => {
  if (subscription) {
    supabase.removeChannel(subscription);
  }
};