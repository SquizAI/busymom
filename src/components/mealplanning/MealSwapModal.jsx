import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Sparkles, Check } from 'lucide-react';
import { generateMealAlternatives } from '../../services/mealPlanningService';
import toast from 'react-hot-toast';

const MealSwapModal = ({ meal, day, onSwap, onClose, preferences }) => {
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    loadAlternatives();
  }, [meal]);

  const loadAlternatives = async () => {
    setLoading(true);
    try {
      const alts = await generateMealAlternatives(meal, preferences);
      setAlternatives(alts);
    } catch (error) {
      console.error('Error loading alternatives:', error);
      toast.error('Failed to load meal alternatives');
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    if (selectedMeal) {
      onSwap(day, meal.type, selectedMeal);
      toast.success('Meal swapped successfully!');
      onClose();
    }
  };

  const refreshAlternatives = () => {
    loadAlternatives();
    setSelectedMeal(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">Swap Meal</h2>
                <p className="text-purple-100">
                  Replace "{meal.name}" with a similar alternative
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
            {/* Current Meal */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Current Meal</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold">{meal.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{meal.description}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {meal.prepTime} min
                  </span>
                  {meal.calories && (
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      {meal.calories} cal
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Alternatives */}
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Alternative Meals</h3>
                <button
                  onClick={refreshAlternatives}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Options
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : (
                <div className="grid gap-3">
                  {alternatives.map((alt, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedMeal(alt)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedMeal === alt
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">{alt.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{alt.description}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                              {alt.prepTime} min
                            </span>
                            {alt.calories && (
                              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                {alt.calories} cal
                              </span>
                            )}
                            {alt.matchScore && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                {Math.round(alt.matchScore * 100)}% match
                              </span>
                            )}
                          </div>
                        </div>
                        {selectedMeal === alt && (
                          <div className="bg-purple-600 text-white rounded-full p-1">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSwap}
              disabled={!selectedMeal}
              className={`px-6 py-2 rounded-lg transition-colors ${
                selectedMeal
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Swap Meal
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MealSwapModal;