import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Plus, Edit2, Trash2, Save, X, 
  AlertTriangle, Heart, Activity, Calendar 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserData, updateUserFamilyProfiles } from '../../lib/supabaseDatabase';
import toast from 'react-hot-toast';

const FamilyProfiles = ({ onProfilesUpdate }) => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, [user]);

  const loadProfiles = async () => {
    if (!user) return;
    
    try {
      const userData = await getUserData(user.uid);
      setProfiles(userData?.family_profiles || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast.error('Failed to load family profiles');
    } finally {
      setLoading(false);
    }
  };

  const saveProfiles = async (newProfiles) => {
    try {
      await updateUserFamilyProfiles(user.uid, newProfiles);
      
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

  const handleAddProfile = (profile) => {
    const newProfile = {
      ...profile,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    const newProfiles = [...profiles, newProfile];
    saveProfiles(newProfiles);
    setShowAddModal(false);
  };

  const handleUpdateProfile = (updatedProfile) => {
    const newProfiles = profiles.map(p => 
      p.id === updatedProfile.id ? updatedProfile : p
    );
    saveProfiles(newProfiles);
    setEditingProfile(null);
  };

  const handleDeleteProfile = (profileId) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      const newProfiles = profiles.filter(p => p.id !== profileId);
      saveProfiles(newProfiles);
    }
  };

  const ProfileCard = ({ profile }) => {
    const age = profile.birthDate ? 
      Math.floor((new Date() - new Date(profile.birthDate)) / (365.25 * 24 * 60 * 60 * 1000)) : 
      null;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
              profile.color || 'bg-purple-600'
            }`}>
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{profile.name}</h3>
              <p className="text-sm text-gray-600">
                {profile.role} {age && `• ${age} years old`}
              </p>
            </div>
          </div>
          
          <div className="flex gap-1">
            <button
              onClick={() => setEditingProfile(profile)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteProfile(profile.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dietary Info */}
        {(profile.dietaryRestrictions?.length > 0 || profile.allergies?.length > 0) && (
          <div className="space-y-2 mb-3">
            {profile.dietaryRestrictions?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {profile.dietaryRestrictions.map((diet, idx) => (
                  <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {diet}
                  </span>
                ))}
              </div>
            )}
            
            {profile.allergies?.length > 0 && (
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                <div className="flex flex-wrap gap-1">
                  {profile.allergies.map((allergy, idx) => (
                    <span key={idx} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Health Goals */}
        {profile.healthGoals?.length > 0 && (
          <div className="flex items-start gap-2 mb-3">
            <Heart className="w-4 h-4 text-purple-500 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {profile.healthGoals.map((goal, idx) => (
                <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {goal}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Preferences */}
        {profile.preferences && (
          <div className="text-xs text-gray-600 space-y-1">
            {profile.preferences.favoriteIngredients && (
              <p>Loves: {profile.preferences.favoriteIngredients.join(', ')}</p>
            )}
            {profile.preferences.dislikedIngredients && (
              <p>Dislikes: {profile.preferences.dislikedIngredients.join(', ')}</p>
            )}
          </div>
        )}
      </motion.div>
    );
  };

  const ProfileForm = ({ profile, onSave, onCancel }) => {
    const [formData, setFormData] = useState(profile || {
      name: '',
      role: 'Family Member',
      birthDate: '',
      dietaryRestrictions: [],
      allergies: [],
      healthGoals: [],
      preferences: {
        favoriteIngredients: [],
        dislikedIngredients: []
      },
      color: 'bg-purple-600'
    });

    const dietaryOptions = [
      'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
      'Keto', 'Paleo', 'Low-Carb', 'Mediterranean'
    ];

    const allergyOptions = [
      'Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 
      'Wheat', 'Soy', 'Fish', 'Shellfish', 'Sesame'
    ];

    const healthGoalOptions = [
      'Weight Loss', 'Muscle Building', 'Heart Health', 
      'Diabetes Management', 'Energy Boost', 'Better Digestion'
    ];

    const colorOptions = [
      'bg-purple-600', 'bg-blue-600', 'bg-green-600', 
      'bg-yellow-600', 'bg-red-600', 'bg-pink-600'
    ];

    const toggleArrayItem = (array, item) => {
      return array.includes(item) 
        ? array.filter(i => i !== item)
        : [...array, item];
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name) {
        toast.error('Please enter a name');
        return;
      }
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option>Parent</option>
              <option>Child</option>
              <option>Teen</option>
              <option>Family Member</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Date
            </label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Color
            </label>
            <div className="flex gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full ${color} ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-purple-600' : ''
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Dietary Restrictions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dietary Restrictions
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {dietaryOptions.map((diet) => (
              <label key={diet} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.dietaryRestrictions?.includes(diet) || false}
                  onChange={() => setFormData({
                    ...formData,
                    dietaryRestrictions: toggleArrayItem(formData.dietaryRestrictions || [], diet)
                  })}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm">{diet}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Allergies
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {allergyOptions.map((allergy) => (
              <label key={allergy} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.allergies?.includes(allergy) || false}
                  onChange={() => setFormData({
                    ...formData,
                    allergies: toggleArrayItem(formData.allergies || [], allergy)
                  })}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm">{allergy}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Health Goals */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Health Goals
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {healthGoalOptions.map((goal) => (
              <label key={goal} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.healthGoals?.includes(goal) || false}
                  onChange={() => setFormData({
                    ...formData,
                    healthGoals: toggleArrayItem(formData.healthGoals || [], goal)
                  })}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm">{goal}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Favorite Ingredients
            </label>
            <input
              type="text"
              placeholder="e.g., chicken, broccoli, pasta"
              value={formData.preferences?.favoriteIngredients?.join(', ') || ''}
              onChange={(e) => setFormData({
                ...formData,
                preferences: {
                  ...formData.preferences,
                  favoriteIngredients: e.target.value.split(',').map(i => i.trim()).filter(Boolean)
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Disliked Ingredients
            </label>
            <input
              type="text"
              placeholder="e.g., mushrooms, olives"
              value={formData.preferences?.dislikedIngredients?.join(', ') || ''}
              onChange={(e) => setFormData({
                ...formData,
                preferences: {
                  ...formData.preferences,
                  dislikedIngredients: e.target.value.split(',').map(i => i.trim()).filter(Boolean)
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Profile
          </button>
        </div>
      </form>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Family Profiles</h2>
          <p className="text-gray-600 mt-1">
            Create profiles for each family member to personalize meal plans
          </p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Profile
        </button>
      </div>

      {/* Profile Grid */}
      {profiles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No family profiles yet</h3>
          <p className="text-gray-600 mb-4">Create profiles to get personalized meal recommendations</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create First Profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddModal || editingProfile) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">
                  {editingProfile ? 'Edit Profile' : 'Add Family Member'}
                </h3>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <ProfileForm
                  profile={editingProfile}
                  onSave={editingProfile ? handleUpdateProfile : handleAddProfile}
                  onCancel={() => {
                    setShowAddModal(false);
                    setEditingProfile(null);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FamilyProfiles;