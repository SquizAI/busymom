import React, { useState, useEffect } from 'react';
import { Clock, Users, RefreshCw, ChefHat, Flame, Carrot, Wheat, Droplet, Heart, Star, Share2, Sparkles } from 'lucide-react';
import { swapMeal } from '../../services/mealPlanningService';
import { toast } from 'react-hot-toast';
import RecipeScaler from './RecipeScaler';
import MealSwapModal from './MealSwapModal';
import { generateMealImage, getCachedMealImage, cacheMealImage } from '../../services/mealImageGenerator';

const MealCard = ({ meal, userTier, onSwap, onFavorite, preferences }) => {
  const [loading, setLoading] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showScaler, setShowScaler] = useState(false);
  const [isFavorite, setIsFavorite] = useState(meal.isFavorite || false);
  const [mealImage, setMealImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [useAiImage, setUseAiImage] = useState(false);

  useEffect(() => {
    loadMealImage();
  }, [meal.name, useAiImage]);

  const loadMealImage = async () => {
    setImageLoading(true);
    const mealId = meal.id || `${meal.day}-${meal.type}`;
    
    if (useAiImage && userTier !== 'free') {
      try {
        // Check cache first
        const cachedImage = await getCachedMealImage(mealId);
        if (cachedImage) {
          setMealImage(cachedImage);
          setImageLoading(false);
          return;
        }
        
        // Generate new AI image
        const aiImage = await generateMealImage(meal, {
          quality: userTier === 'premiumPlus' ? 'hd' : 'standard',
          size: '1024x1024'
        });
        
        setMealImage(aiImage);
        
        // Cache the generated image
        await cacheMealImage(mealId, aiImage);
      } catch (error) {
        console.error('Failed to generate AI image:', error);
        // Fallback to Unsplash
        setUseAiImage(false);
      }
    } else {
      // Use Unsplash as default or fallback
      const mealQuery = meal.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ').slice(0, 2).join('-');
      setMealImage(`https://source.unsplash.com/400x300/?${mealQuery},food,meal`);
    }
    
    setImageLoading(false);
  };

  const toggleImageSource = () => {
    if (userTier === 'free') {
      toast.error('AI-generated images are available for Basic plans and above');
      return;
    }
    setUseAiImage(!useAiImage);
  };

  const handleSwap = () => {
    if (userTier === 'free') {
      toast.error('Upgrade to Basic to swap meals');
      return;
    }
    setShowSwapModal(true);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (onFavorite) {
      onFavorite(meal, !isFavorite);
    }
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: meal.name,
          text: `Check out this delicious ${meal.name} recipe!`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${meal.name}: ${meal.description}`);
      toast.success('Recipe copied to clipboard!');
    }
  };

  const handleScaleRecipe = (servings, scaledIngredients) => {
    // Update meal with scaled ingredients
    console.log('Scaled to', servings, 'servings:', scaledIngredients);
  };

  const getMealTypeColor = (type) => {
    switch (type) {
      case 'breakfast':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'lunch':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'dinner':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getMealTypeIcon = (type) => {
    switch (type) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '☀️';
      case 'dinner':
        return '🌙';
      default:
        return '🍽️';
    }
  };

  return (
    <>
      <div className="relative group">
        <div
          className={`bg-white rounded-lg shadow-sm border-2 ${getMealTypeColor(meal.type)} overflow-hidden hover:shadow-md transition-all duration-200 ${
            flipped ? 'transform rotate-y-180' : ''
          }`}
        >
          {/* Meal Image */}
          <div className="relative h-48 bg-gray-200 overflow-hidden">
            {imageLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <img 
                src={mealImage} 
                alt={meal.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* AI Image Toggle for Premium Users */}
            {userTier !== 'free' && (
              <button
                onClick={toggleImageSource}
                className={`absolute top-2 left-2 p-2 rounded-full transition-all ${
                  useAiImage 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/90 text-gray-600 backdrop-blur-sm hover:bg-white'
                }`}
                title={useAiImage ? 'Using AI-generated image' : 'Using stock image'}
              >
                <Sparkles className="w-4 h-4" />
              </button>
            )}
            
            {/* Action Buttons Overlay */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={handleFavorite}
                className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
              >
                <Heart 
                  className={`w-4 h-4 transition-colors ${
                    isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'
                  }`} 
                />
              </button>
              <button
                onClick={handleShare}
                className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
              >
                <Share2 className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            {/* Meal Type Badge on Image */}
            <div className="absolute bottom-2 left-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm ${getMealTypeColor(meal.type)}`}>
                <span className="mr-1">{getMealTypeIcon(meal.type)}</span>
                {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
              </span>
            </div>
          </div>

          <div className="p-4">
            {/* Meal Name with Swap Button */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 flex-1">{meal.name}</h3>
              
              {/* Quick Swap Button */}
              {userTier !== 'free' && (
                <button
                  onClick={handleSwap}
                  disabled={loading}
                  className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                  title="Swap this meal"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3">{meal.description}</p>

            {/* Quick Info */}
            <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>{meal.prepTime}min</span>
              </div>
              <div className="flex items-center">
                <Users className="w-3 h-3 mr-1" />
                <span>{meal.servings || 4} servings</span>
              </div>
              {meal.cookTime && (
                <div className="flex items-center">
                  <ChefHat className="w-3 h-3 mr-1" />
                  <span>{meal.cookTime}min cook</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {meal.tags && meal.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {meal.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Nutrition Info (Premium) */}
            {meal.nutrition && (userTier === 'premium' || userTier === 'premiumPlus') && (
              <div className="border-t pt-3 mt-3">
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <Flame className="w-4 h-4 mx-auto mb-1 text-orange-500" />
                    <p className="font-medium">{meal.nutrition.calories}</p>
                    <p className="text-gray-500">cal</p>
                  </div>
                  <div className="text-center">
                    <Carrot className="w-4 h-4 mx-auto mb-1 text-red-500" />
                    <p className="font-medium">{meal.nutrition.protein}g</p>
                    <p className="text-gray-500">protein</p>
                  </div>
                  <div className="text-center">
                    <Wheat className="w-4 h-4 mx-auto mb-1 text-yellow-600" />
                    <p className="font-medium">{meal.nutrition.carbs}g</p>
                    <p className="text-gray-500">carbs</p>
                  </div>
                  <div className="text-center">
                    <Droplet className="w-4 h-4 mx-auto mb-1 text-green-500" />
                    <p className="font-medium">{meal.nutrition.fat}g</p>
                    <p className="text-gray-500">fat</p>
                  </div>
                </div>
              </div>
            )}

            {/* Premium Features */}
            {(userTier === 'premium' || userTier === 'premiumPlus') && (
              <div className="mt-3 space-y-2">
                {meal.kidFriendlyTips && (
                  <div className="bg-purple-50 rounded p-2 text-xs">
                    <span className="font-medium text-purple-700">Kid Tip:</span>
                    <span className="text-purple-600 ml-1">{meal.kidFriendlyTips}</span>
                  </div>
                )}
                {meal.mealPrepTips && (
                  <div className="bg-blue-50 rounded p-2 text-xs">
                    <span className="font-medium text-blue-700">Prep Ahead:</span>
                    <span className="text-blue-600 ml-1">{meal.mealPrepTips}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setFlipped(!flipped)}
                className="flex-1 text-sm text-gray-600 hover:text-gray-800 font-medium py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Recipe →
              </button>
              {(userTier === 'premium' || userTier === 'premiumPlus') && (
                <button
                  onClick={() => setShowScaler(!showScaler)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Adjust servings"
                >
                  <Users className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Recipe Scaler */}
            {showScaler && (userTier === 'premium' || userTier === 'premiumPlus') && (
              <div className="mt-4">
                <RecipeScaler
                  originalServings={meal.servings || 4}
                  ingredients={meal.ingredients}
                  onScale={handleScaleRecipe}
                />
              </div>
            )}
          </div>
        </div>

        {/* Back of Card - Ingredients & Instructions */}
        {flipped && (
          <div className="absolute inset-0 bg-white rounded-lg shadow-sm border overflow-hidden transform rotate-y-180">
            <div className="p-4 h-full overflow-y-auto">
              <button
                onClick={() => setFlipped(false)}
                className="text-sm text-gray-600 hover:text-gray-800 mb-3 flex items-center gap-1"
              >
                ← Back to meal
              </button>
              
              <h4 className="font-semibold text-gray-900 mb-2">Ingredients:</h4>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                {meal.ingredients.map((ing, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span className="flex-1">
                      {typeof ing === 'string' ? ing : (
                        <>
                          <span className="font-medium">{ing.amount}</span> {ing.name}
                          {ing.category && <span className="text-xs text-gray-400 ml-1">({ing.category})</span>}
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              {meal.instructions && (
                <>
                  <h4 className="font-semibold text-gray-900 mb-2">Instructions:</h4>
                  <ol className="text-sm text-gray-600 space-y-2 mb-4">
                    {meal.instructions.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="font-medium text-gray-700 mr-2">{index + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </>
              )}

              {meal.leftoverIdeas && (userTier === 'premium' || userTier === 'premiumPlus') && (
                <div className="bg-green-50 rounded p-2 text-xs mt-3">
                  <span className="font-medium text-green-700">Leftover Idea:</span>
                  <span className="text-green-600 ml-1">{meal.leftoverIdeas}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Meal Swap Modal */}
      {showSwapModal && (
        <MealSwapModal
          meal={meal}
          day={meal.day}
          onSwap={onSwap}
          onClose={() => setShowSwapModal(false)}
          preferences={preferences}
        />
      )}
    </>
  );
};

export default MealCard;