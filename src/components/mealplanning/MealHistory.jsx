import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Calendar, Search, Filter, X, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getMealHistory, updateMealHistory } from '../../lib/supabaseDatabase';
import toast from 'react-hot-toast';

const MealHistory = ({ onAddMeal, onClose }) => {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, favorites, recent
  const [selectedMeals, setSelectedMeals] = useState([]);

  useEffect(() => {
    if (user) {
      loadMealHistory();
    }
  }, [user]);

  useEffect(() => {
    filterMeals();
  }, [meals, searchTerm, filterType]);

  const loadMealHistory = async () => {
    try {
      const mealData = await getMealHistory(user.uid);
      setMeals(mealData);
    } catch (error) {
      console.error('Error loading meal history:', error);
      toast.error('Failed to load meal history');
    } finally {
      setLoading(false);
    }
  };

  const filterMeals = () => {
    let filtered = [...meals];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(meal =>
        meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.ingredients?.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply type filter
    if (filterType === 'favorites') {
      filtered = filtered.filter(meal => meal.is_favorite);
    } else if (filterType === 'recent') {
      // Show meals from last 7 days
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      filtered = filtered.filter(meal => 
        new Date(meal.last_used) > lastWeek
      );
    }

    setFilteredMeals(filtered);
  };

  const toggleFavorite = async (mealId, currentStatus) => {
    try {
      await updateMealHistory(mealId, {
        is_favorite: !currentStatus
      });

      setMeals(meals.map(meal =>
        meal.id === mealId ? { ...meal, is_favorite: !currentStatus } : meal
      ));

      toast.success(currentStatus ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast.error('Failed to update favorite');
    }
  };

  const rateMeal = async (mealId, rating) => {
    try {
      await updateMealHistory(mealId, {
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

  const toggleMealSelection = (meal) => {
    if (selectedMeals.find(m => m.id === meal.id)) {
      setSelectedMeals(selectedMeals.filter(m => m.id !== meal.id));
    } else {
      setSelectedMeals([...selectedMeals, meal]);
    }
  };

  const addSelectedMeals = () => {
    if (selectedMeals.length === 0) {
      toast.error('Please select at least one meal');
      return;
    }

    selectedMeals.forEach(meal => {
      onAddMeal(meal);
    });

    toast.success(`Added ${selectedMeals.length} meal(s) to your plan`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Meal History & Favorites</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search meals by name or ingredient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterType === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('favorites')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  filterType === 'favorites'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Star className="w-4 h-4" /> Favorites
              </button>
              <button
                onClick={() => setFilterType('recent')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  filterType === 'recent'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Clock className="w-4 h-4" /> Recent
              </button>
            </div>
          </div>
        </div>

        {/* Meals List */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-280px)]">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredMeals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || filterType !== 'all'
                ? 'No meals found matching your criteria'
                : 'No meal history yet. Start planning to build your history!'}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredMeals.map((meal) => (
                <motion.div
                  key={meal.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white border-2 rounded-lg p-4 transition-all ${
                    selectedMeals.find(m => m.id === meal.id)
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleMealSelection(meal)}
                      className="mt-1"
                    >
                      <div className={`w-5 h-5 rounded border-2 transition-all ${
                        selectedMeals.find(m => m.id === meal.id)
                          ? 'bg-purple-600 border-purple-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedMeals.find(m => m.id === meal.id) && (
                          <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{meal.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{meal.description}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                              {meal.prep_time || meal.prepTime} min
                            </span>
                            {meal.calories && (
                              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                {meal.calories} cal
                              </span>
                            )}
                            <span className="text-xs bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(meal.last_used).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleFavorite(meal.id, meal.is_favorite)}
                          className={`p-2 rounded-lg transition-colors ${
                            meal.is_favorite
                              ? 'text-yellow-500'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          <Star className={`w-5 h-5 ${meal.is_favorite ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-sm text-gray-600">Rate:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => rateMeal(meal.id, star)}
                              className={`text-yellow-500 hover:scale-110 transition-transform ${
                                star <= (meal.rating || 0) ? 'fill-current' : ''
                              }`}
                            >
                              <Star className="w-4 h-4" />
                            </button>
                          ))}
                        </div>
                        {meal.rating && (
                          <span className="text-sm text-gray-500">({meal.rating}/5)</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
          <div className="text-sm text-gray-600">
            {selectedMeals.length > 0 && (
              <span>{selectedMeals.length} meal(s) selected</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addSelectedMeals}
              disabled={selectedMeals.length === 0}
              className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                selectedMeals.length > 0
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4" />
              Add to Plan
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MealHistory;