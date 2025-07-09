import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Download, RefreshCw, Image as ImageIcon, X, Check } from 'lucide-react';
import { generateBatchMealImages, generateMealImage, cacheMealImage } from '../../services/mealImageGenerator';
import toast from 'react-hot-toast';

const MealImageGenerator = ({ mealPlan, userTier, onClose }) => {
  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState(new Map());
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [progress, setProgress] = useState(0);
  const [selectedQuality, setSelectedQuality] = useState('standard');

  // Flatten all meals from the plan
  const allMeals = mealPlan?.days.flatMap(day => 
    day.meals.map(meal => ({ ...meal, day: day.day, id: `${day.day}-${meal.type}` }))
  ) || [];

  const toggleMealSelection = (mealId) => {
    if (selectedMeals.includes(mealId)) {
      setSelectedMeals(selectedMeals.filter(id => id !== mealId));
    } else {
      setSelectedMeals([...selectedMeals, mealId]);
    }
  };

  const selectAll = () => {
    setSelectedMeals(allMeals.map(meal => meal.id));
  };

  const deselectAll = () => {
    setSelectedMeals([]);
  };

  const generateImages = async () => {
    if (selectedMeals.length === 0) {
      toast.error('Please select at least one meal');
      return;
    }

    setGenerating(true);
    setProgress(0);
    const newImages = new Map();

    try {
      const mealsToGenerate = allMeals.filter(meal => selectedMeals.includes(meal.id));
      const totalMeals = mealsToGenerate.length;

      for (let i = 0; i < mealsToGenerate.length; i++) {
        const meal = mealsToGenerate[i];
        
        try {
          const image = await generateMealImage(meal, {
            quality: selectedQuality,
            size: '1024x1024'
          });
          
          newImages.set(meal.id, image);
          await cacheMealImage(meal.id, image);
          
          setProgress(((i + 1) / totalMeals) * 100);
          setGeneratedImages(new Map(newImages));
        } catch (error) {
          console.error(`Failed to generate image for ${meal.name}:`, error);
          // Continue with next meal
        }
        
        // Small delay to avoid rate limits
        if (i < mealsToGenerate.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      toast.success(`Generated ${newImages.size} meal images!`);
    } catch (error) {
      console.error('Error generating images:', error);
      toast.error('Failed to generate some images');
    } finally {
      setGenerating(false);
    }
  };

  const downloadImage = async (mealId, mealName) => {
    const imageData = generatedImages.get(mealId);
    if (!imageData) return;

    try {
      const link = document.createElement('a');
      link.download = `${mealName.replace(/\s+/g, '-').toLowerCase()}.png`;
      
      if (imageData.startsWith('data:')) {
        link.href = imageData;
      } else {
        // Fetch and convert URL to blob
        const response = await fetch(imageData);
        const blob = await response.blob();
        link.href = URL.createObjectURL(blob);
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Downloaded ${mealName} image`);
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };

  const downloadAllImages = async () => {
    for (const meal of allMeals) {
      if (generatedImages.has(meal.id)) {
        await downloadImage(meal.id, meal.name);
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
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
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                AI Meal Image Generator
              </h2>
              <p className="text-purple-100 mt-1">
                Generate beautiful images for your meal plan
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Quality Selection */}
          {userTier !== 'free' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Quality
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedQuality('standard')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedQuality === 'standard'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Standard
                </button>
                {(userTier === 'premium' || userTier === 'premiumPlus') && (
                  <button
                    onClick={() => setSelectedQuality('hd')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedQuality === 'hd'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    HD Quality
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Meal Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">Select Meals</h3>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Select All
                </button>
                <span className="text-gray-400">|</span>
                <button
                  onClick={deselectAll}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
              {allMeals.map(meal => (
                <button
                  key={meal.id}
                  onClick={() => toggleMealSelection(meal.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedMeals.includes(meal.id)
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded border-2 mt-0.5 flex items-center justify-center ${
                      selectedMeals.includes(meal.id)
                        ? 'bg-purple-600 border-purple-600'
                        : 'border-gray-300'
                    }`}>
                      {selectedMeals.includes(meal.id) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{meal.name}</div>
                      <div className="text-xs text-gray-500">{meal.day} - {meal.type}</div>
                      {generatedImages.has(meal.id) && (
                        <div className="mt-1 text-xs text-green-600 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Image generated
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          {generating && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Generating images...</span>
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-purple-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Generated Images Preview */}
          {generatedImages.size > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-3">Generated Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from(generatedImages.entries()).map(([mealId, imageUrl]) => {
                  const meal = allMeals.find(m => m.id === mealId);
                  if (!meal) return null;
                  
                  return (
                    <div key={mealId} className="relative group">
                      <img
                        src={imageUrl}
                        alt={meal.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button
                          onClick={() => downloadImage(mealId, meal.name)}
                          className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                          title="Download image"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 truncate">{meal.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {selectedMeals.length} meal{selectedMeals.length !== 1 ? 's' : ''} selected
            {generatedImages.size > 0 && ` • ${generatedImages.size} images generated`}
          </div>
          
          <div className="flex gap-3">
            {generatedImages.size > 0 && (
              <button
                onClick={downloadAllImages}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download All
              </button>
            )}
            
            <button
              onClick={generateImages}
              disabled={generating || selectedMeals.length === 0}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                generating || selectedMeals.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Images
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MealImageGenerator;