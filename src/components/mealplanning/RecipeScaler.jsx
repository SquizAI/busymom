import React, { useState, useEffect } from 'react';
import { Minus, Plus, Users } from 'lucide-react';

const RecipeScaler = ({ originalServings, ingredients, onScale }) => {
  const [servings, setServings] = useState(originalServings);
  const [scaledIngredients, setScaledIngredients] = useState(ingredients);

  useEffect(() => {
    scaleIngredients();
  }, [servings]);

  const scaleIngredients = () => {
    const scale = servings / originalServings;
    const scaled = ingredients.map(ingredient => {
      // Parse quantity from ingredient string
      const match = ingredient.match(/^([\d/.]+)\s*(\w+)?\s*(.+)/);
      if (match) {
        const [, quantity, unit, item] = match;
        const scaledQty = scaleQuantity(quantity, scale);
        return `${scaledQty} ${unit || ''} ${item}`.trim();
      }
      return ingredient;
    });
    
    setScaledIngredients(scaled);
    onScale(servings, scaled);
  };

  const scaleQuantity = (quantity, scale) => {
    // Handle fractions
    if (quantity.includes('/')) {
      const [num, den] = quantity.split('/').map(Number);
      const decimal = num / den * scale;
      return formatQuantity(decimal);
    }
    
    // Handle decimals and whole numbers
    const decimal = parseFloat(quantity) * scale;
    return formatQuantity(decimal);
  };

  const formatQuantity = (decimal) => {
    // Common fractions
    const fractions = [
      { decimal: 0.125, fraction: '1/8' },
      { decimal: 0.25, fraction: '1/4' },
      { decimal: 0.333, fraction: '1/3' },
      { decimal: 0.375, fraction: '3/8' },
      { decimal: 0.5, fraction: '1/2' },
      { decimal: 0.625, fraction: '5/8' },
      { decimal: 0.667, fraction: '2/3' },
      { decimal: 0.75, fraction: '3/4' },
      { decimal: 0.875, fraction: '7/8' }
    ];

    // Check if close to a common fraction
    for (const { decimal: frac, fraction } of fractions) {
      if (Math.abs(decimal - frac) < 0.01) {
        return fraction;
      }
    }

    // Check if close to a whole number
    if (Math.abs(decimal - Math.round(decimal)) < 0.01) {
      return Math.round(decimal).toString();
    }

    // Return as decimal with max 2 decimal places
    return decimal.toFixed(2).replace(/\.?0+$/, '');
  };

  const handleDecrease = () => {
    if (servings > 1) {
      setServings(servings - 1);
    }
  };

  const handleIncrease = () => {
    setServings(servings + 1);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Users className="w-5 h-5" />
          <span className="font-medium">Servings</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleDecrease}
            disabled={servings <= 1}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              servings > 1
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className="font-bold text-xl w-8 text-center">{servings}</span>
          
          <button
            onClick={handleIncrease}
            className="w-8 h-8 rounded-full bg-purple-600 text-white hover:bg-purple-700 flex items-center justify-center transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {servings !== originalServings && (
        <div className="text-sm text-gray-600 mb-3">
          Scaled from {originalServings} servings (
          {servings > originalServings ? '+' : ''}
          {Math.round((servings / originalServings - 1) * 100)}%)
        </div>
      )}

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Scaled Ingredients:</h4>
        <ul className="space-y-1">
          {scaledIngredients.map((ingredient, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              {ingredient}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeScaler;