import React, { useState } from 'react';
import { Settings, Clock, Users, DollarSign, Heart, Globe, Lock } from 'lucide-react';
import { TIER_LIMITS } from '../../services/mealPlanningService';
import { toast } from 'react-hot-toast';

const MealPlannerSettings = ({ preferences, setPreferences, userTier, onSave }) => {
  const [saving, setSaving] = useState(false);
  const tierConfig = TIER_LIMITS[userTier];

  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Keto',
    'Paleo',
    'Mediterranean',
    'Low-Carb',
    'Pescatarian',
    'Halal',
    'Kosher'
  ];

  const cuisineOptions = [
    'Italian',
    'Mexican',
    'Chinese',
    'Japanese',
    'Thai',
    'Indian',
    'Mediterranean',
    'American',
    'French',
    'Korean',
    'Vietnamese',
    'Greek'
  ];

  const allergyOptions = [
    'Peanuts',
    'Tree Nuts',
    'Milk',
    'Eggs',
    'Wheat',
    'Soy',
    'Fish',
    'Shellfish',
    'Sesame'
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleArrayItem = (array, item, limit) => {
    const currentArray = preferences[array] || [];
    if (currentArray.includes(item)) {
      setPreferences({
        ...preferences,
        [array]: currentArray.filter(i => i !== item)
      });
    } else if (currentArray.length < limit) {
      setPreferences({
        ...preferences,
        [array]: [...currentArray, item]
      });
    } else {
      toast.error(`You can only select up to ${limit} ${array}. Upgrade for more options.`);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center mb-6">
        <Settings className="w-6 h-6 mr-2 text-gray-700" />
        <h2 className="text-xl font-semibold">Meal Planning Preferences</h2>
      </div>

      <div className="space-y-8">
        {/* Basic Settings */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Basic Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Maximum Cooking Time
              </label>
              <select
                value={preferences.cookingTimeLimit}
                onChange={(e) => setPreferences({ ...preferences, cookingTimeLimit: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Family Size
              </label>
              <select
                value={preferences.familySize}
                onChange={(e) => setPreferences({ ...preferences, familySize: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={userTier === 'free'}
              >
                <option value={1}>1 person</option>
                <option value={2}>2 people</option>
                <option value={3}>3 people</option>
                <option value={4}>4 people</option>
                <option value={5}>5 people</option>
                <option value={6}>6+ people</option>
              </select>
              {userTier === 'free' && (
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <Lock className="w-3 h-3 mr-1" />
                  Upgrade to adjust family size
                </p>
              )}
            </div>
          </div>

          {/* Budget (Premium) */}
          {(userTier === 'premium' || userTier === 'premiumPlus') && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Weekly Budget (optional)
              </label>
              <input
                type="number"
                value={preferences.budget || ''}
                onChange={(e) => setPreferences({ ...preferences, budget: e.target.value ? parseInt(e.target.value) : null })}
                placeholder="e.g., 150"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Kid-Friendly Mode (Premium) */}
          {(userTier === 'premium' || userTier === 'premiumPlus') && (
            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.kidFriendly || false}
                  onChange={(e) => setPreferences({ ...preferences, kidFriendly: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  <Heart className="w-4 h-4 inline mr-1 text-pink-500" />
                  Kid-Friendly Mode
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Get meals with hidden veggies and kid-approved flavors
              </p>
            </div>
          )}
        </div>

        {/* Dietary Restrictions */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Dietary Restrictions</h3>
            <span className="text-sm text-gray-500">
              {preferences.dietaryRestrictions?.length || 0} / {tierConfig.dietaryPreferences} selected
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {dietaryOptions.map((option) => {
              const isSelected = preferences.dietaryRestrictions?.includes(option);
              const isDisabled = !isSelected && (preferences.dietaryRestrictions?.length || 0) >= tierConfig.dietaryPreferences;
              
              return (
                <label
                  key={option}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50 border-blue-300' : 
                    isDisabled ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed' : 
                    'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleArrayItem('dietaryRestrictions', option, tierConfig.dietaryPreferences)}
                    disabled={isDisabled}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm">{option}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Allergies */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Allergies</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {allergyOptions.map((option) => {
              const isSelected = preferences.allergies?.includes(option);
              
              return (
                <label
                  key={option}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {
                      const currentAllergies = preferences.allergies || [];
                      setPreferences({
                        ...preferences,
                        allergies: isSelected 
                          ? currentAllergies.filter(i => i !== option)
                          : [...currentAllergies, option]
                      });
                    }}
                    className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm">{option}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Cuisine Preferences */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              <Globe className="w-5 h-5 inline mr-1" />
              Cuisine Preferences
            </h3>
            {userTier === 'free' && (
              <span className="text-xs text-gray-500 flex items-center">
                <Lock className="w-3 h-3 mr-1" />
                Upgrade to set preferences
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {cuisineOptions.map((option) => {
              const isSelected = preferences.cuisineTypes?.includes(option);
              const isDisabled = userTier === 'free';
              
              return (
                <label
                  key={option}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected ? 'bg-green-50 border-green-300' : 
                    isDisabled ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed' : 
                    'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {
                      if (isDisabled) return;
                      const currentCuisines = preferences.cuisineTypes || [];
                      setPreferences({
                        ...preferences,
                        cuisineTypes: isSelected 
                          ? currentCuisines.filter(i => i !== option)
                          : [...currentCuisines, option]
                      });
                    }}
                    disabled={isDisabled}
                    className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm">{option}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Calorie Target (Premium Plus) */}
        {userTier === 'premiumPlus' && (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Nutrition Goals</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Calorie Target
                </label>
                <input
                  type="number"
                  value={preferences.calorieTarget || ''}
                  onChange={(e) => setPreferences({ ...preferences, calorieTarget: e.target.value ? parseInt(e.target.value) : null })}
                  placeholder="e.g., 2000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Macro Split
                </label>
                <select
                  value={preferences.macroSplit || 'balanced'}
                  onChange={(e) => setPreferences({ ...preferences, macroSplit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="balanced">Balanced</option>
                  <option value="highProtein">High Protein</option>
                  <option value="lowCarb">Low Carb</option>
                  <option value="lowFat">Low Fat</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealPlannerSettings;