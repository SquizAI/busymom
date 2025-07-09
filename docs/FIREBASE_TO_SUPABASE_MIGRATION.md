# Firebase to Supabase Migration Guide

## Overview
This guide helps you migrate from Firebase Firestore to Supabase database for the BusyWomen app.

## Database Schema Setup

1. **Run the SQL schema** in your Supabase dashboard:
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `/supabase/schema.sql`
   - Run the query to create all tables and policies

## Code Migration Examples

### 1. FamilyProfiles.jsx Migration

Replace Firebase imports:
```javascript
// OLD - Firebase
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// NEW - Supabase
import { getUserData, updateUserFamilyProfiles } from '../../lib/supabaseDatabase';
```

Update the `loadProfiles` function:
```javascript
// OLD - Firebase
const loadProfiles = async () => {
  if (!user) return;
  
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const data = userDoc.data();
    setProfiles(data?.familyProfiles || []);
  } catch (error) {
    console.error('Error loading profiles:', error);
    toast.error('Failed to load family profiles');
  } finally {
    setLoading(false);
  }
};

// NEW - Supabase
const loadProfiles = async () => {
  if (!user) return;
  
  try {
    const userData = await getUserData(user.id);
    setProfiles(userData?.family_profiles || []);
  } catch (error) {
    console.error('Error loading profiles:', error);
    toast.error('Failed to load family profiles');
  } finally {
    setLoading(false);
  }
};
```

Update the `saveProfiles` function:
```javascript
// OLD - Firebase
const saveProfiles = async (newProfiles) => {
  try {
    await updateDoc(doc(db, 'users', user.uid), {
      familyProfiles: newProfiles,
      updatedAt: new Date()
    });
    
    setProfiles(newProfiles);
    if (onProfilesUpdate) {
      onProfilesUpdate(newProfiles);
    }
    
    toast.success('Family profiles updated successfully!');
  } catch (error) {
    console.error('Error saving profiles:', error);
    toast.error('Failed to save profiles');
  }
};

// NEW - Supabase
const saveProfiles = async (newProfiles) => {
  try {
    await updateUserFamilyProfiles(user.id, newProfiles);
    
    setProfiles(newProfiles);
    if (onProfilesUpdate) {
      onProfilesUpdate(newProfiles);
    }
    
    toast.success('Family profiles updated successfully!');
  } catch (error) {
    console.error('Error saving profiles:', error);
    toast.error('Failed to save profiles');
  }
};
```

### 2. MealHistory.jsx Migration

Replace Firebase imports:
```javascript
// OLD - Firebase
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// NEW - Supabase
import { 
  getMealHistory, 
  toggleMealFavorite, 
  rateMeal as updateMealRating 
} from '../../lib/supabaseDatabase';
```

Update the `loadMealHistory` function:
```javascript
// OLD - Firebase
const loadMealHistory = async () => {
  try {
    const mealsRef = collection(db, 'mealHistory');
    const q = query(
      mealsRef,
      where('userId', '==', user.uid),
      orderBy('lastUsed', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const mealData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    setMeals(mealData);
  } catch (error) {
    console.error('Error loading meal history:', error);
    toast.error('Failed to load meal history');
  } finally {
    setLoading(false);
  }
};

// NEW - Supabase
const loadMealHistory = async () => {
  try {
    const mealData = await getMealHistory(user.id);
    
    // Transform data to match expected format
    const transformedMeals = mealData.map(meal => ({
      id: meal.id,
      name: meal.name,
      description: meal.description,
      ingredients: meal.ingredients,
      prepTime: meal.prep_time,
      calories: meal.calories,
      isFavorite: meal.is_favorite,
      rating: meal.rating,
      lastUsed: { toDate: () => new Date(meal.last_used) }
    }));
    
    setMeals(transformedMeals);
  } catch (error) {
    console.error('Error loading meal history:', error);
    toast.error('Failed to load meal history');
  } finally {
    setLoading(false);
  }
};
```

Update the `toggleFavorite` function:
```javascript
// OLD - Firebase
const toggleFavorite = async (mealId, currentStatus) => {
  try {
    const mealRef = doc(db, 'mealHistory', mealId);
    await updateDoc(mealRef, {
      isFavorite: !currentStatus
    });

    setMeals(meals.map(meal =>
      meal.id === mealId ? { ...meal, isFavorite: !currentStatus } : meal
    ));

    toast.success(currentStatus ? 'Removed from favorites' : 'Added to favorites');
  } catch (error) {
    console.error('Error updating favorite:', error);
    toast.error('Failed to update favorite');
  }
};

// NEW - Supabase
const toggleFavorite = async (mealId, currentStatus) => {
  try {
    await toggleMealFavorite(mealId, currentStatus);

    setMeals(meals.map(meal =>
      meal.id === mealId ? { ...meal, isFavorite: !currentStatus } : meal
    ));

    toast.success(currentStatus ? 'Removed from favorites' : 'Added to favorites');
  } catch (error) {
    console.error('Error updating favorite:', error);
    toast.error('Failed to update favorite');
  }
};
```

Update the `rateMeal` function:
```javascript
// OLD - Firebase
const rateMeal = async (mealId, rating) => {
  try {
    const mealRef = doc(db, 'mealHistory', mealId);
    await updateDoc(mealRef, {
      rating: rating
    });

    setMeals(meals.map(meal =>
      meal.id === mealId ? { ...meal, rating } : meal
    ));
  } catch (error) {
    console.error('Error rating meal:', error);
    toast.error('Failed to rate meal');
  }
};

// NEW - Supabase
const rateMeal = async (mealId, rating) => {
  try {
    await updateMealRating(mealId, rating);

    setMeals(meals.map(meal =>
      meal.id === mealId ? { ...meal, rating } : meal
    ));
  } catch (error) {
    console.error('Error rating meal:', error);
    toast.error('Failed to rate meal');
  }
};
```

### 3. OnboardingWizard.jsx Migration

Replace Firebase imports:
```javascript
// OLD - Firebase
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// NEW - Supabase
import { updateUserData } from '../../lib/supabaseDatabase';
```

Update the `handleComplete` function:
```javascript
// OLD - Firebase
const handleComplete = async () => {
  try {
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      preferences: formData,
      onboardingCompleted: true,
      updatedAt: new Date()
    });
    
    toast.success('Preferences saved successfully!');
    onComplete(formData);
  } catch (error) {
    console.error('Error saving preferences:', error);
    toast.error('Failed to save preferences');
  }
};

// NEW - Supabase
const handleComplete = async () => {
  try {
    await updateUserData(user.id, {
      preferences: formData,
      onboarding_completed: true
    });
    
    toast.success('Preferences saved successfully!');
    onComplete(formData);
  } catch (error) {
    console.error('Error saving preferences:', error);
    toast.error('Failed to save preferences');
  }
};
```

## Important Notes

1. **User ID Changes**: 
   - Firebase uses `user.uid`
   - Supabase uses `user.id`

2. **Date Handling**:
   - Firebase Timestamps need `.toDate()` method
   - Supabase returns ISO strings that need `new Date()` conversion

3. **Field Name Conventions**:
   - Firebase uses camelCase (e.g., `familyProfiles`)
   - Supabase uses snake_case (e.g., `family_profiles`)

4. **Real-time Updates**:
   - Use the subscription functions provided in `supabaseDatabase.js` for real-time updates
   - Remember to unsubscribe when components unmount

5. **Error Handling**:
   - Supabase errors are structured differently than Firebase
   - Check `error.message` for user-friendly error messages

## Testing the Migration

1. Create test accounts in Supabase Auth
2. Run the schema SQL to create tables
3. Update one component at a time
4. Test all CRUD operations thoroughly
5. Verify data persistence and retrieval