import React, { useState, useEffect } from 'react';
import { ShoppingCart, Check, Download, Share2, DollarSign, TrendingDown } from 'lucide-react';
import { generateSmartShoppingList } from '../../services/mealPlanningService';
import { toast } from 'react-hot-toast';

const ShoppingList = ({ mealPlan, userTier }) => {
  const [shoppingList, setShoppingList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [pantryItems, setPantryItems] = useState([]);
  const [showPantry, setShowPantry] = useState(false);

  useEffect(() => {
    if (mealPlan) {
      generateList();
    }
  }, [mealPlan]);

  const generateList = async () => {
    if (!mealPlan) return;
    
    setLoading(true);
    try {
      const result = await generateSmartShoppingList(mealPlan, userTier, pantryItems);
      if (result.success) {
        setShoppingList(result.shoppingList);
        // Initialize checked state
        const checked = {};
        result.shoppingList.categories.forEach(category => {
          category.items.forEach(item => {
            checked[`${category.name}-${item.name}`] = item.checked || false;
          });
        });
        setCheckedItems(checked);
      } else {
        toast.error('Failed to generate shopping list');
      }
    } catch (error) {
      toast.error('Error generating shopping list');
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (categoryName, itemName) => {
    const key = `${categoryName}-${itemName}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getProgress = () => {
    const total = Object.keys(checkedItems).length;
    const checked = Object.values(checkedItems).filter(Boolean).length;
    return total > 0 ? (checked / total) * 100 : 0;
  };

  const downloadList = () => {
    if (!shoppingList) return;
    
    let text = 'Shopping List\n\n';
    shoppingList.categories.forEach(category => {
      text += `${category.name}:\n`;
      category.items.forEach(item => {
        const checked = checkedItems[`${category.name}-${item.name}`];
        text += `${checked ? '✓' : '○'} ${item.quantity} ${item.name}\n`;
      });
      text += '\n';
    });
    
    if (shoppingList.totalEstimatedCost) {
      text += `\nEstimated Total: $${shoppingList.totalEstimatedCost}`;
    }
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Shopping list downloaded!');
  };

  const shareList = async () => {
    if (!navigator.share) {
      toast.error('Sharing not supported on this device');
      return;
    }
    
    let text = 'Shopping List\n\n';
    shoppingList.categories.forEach(category => {
      text += `${category.name}:\n`;
      category.items.forEach(item => {
        text += `• ${item.quantity} ${item.name}\n`;
      });
      text += '\n';
    });
    
    try {
      await navigator.share({
        title: 'Shopping List',
        text: text
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Generate a meal plan first to see your shopping list</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold">Shopping List</h2>
          <p className="text-gray-600 text-sm mt-1">
            {userTier === 'free' ? 'Basic list' : 
             userTier === 'basic' ? 'Organized by store sections' :
             'Smart list with cost estimates'}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={downloadList}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </button>
          <button
            onClick={shareList}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
          >
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Shopping Progress</span>
          <span>{Math.round(getProgress())}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
      </div>

      {/* Pantry Manager (Basic+) */}
      {userTier !== 'free' && (
        <div className="mb-6">
          <button
            onClick={() => setShowPantry(!showPantry)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showPantry ? 'Hide' : 'Show'} Pantry Items
          </button>
          
          {showPantry && (
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                Items you already have (won't be added to shopping list):
              </p>
              <div className="flex flex-wrap gap-2">
                {['Salt', 'Pepper', 'Olive Oil', 'Butter', 'Garlic'].map(item => (
                  <button
                    key={item}
                    onClick={() => {
                      setPantryItems(prev => 
                        prev.includes(item) 
                          ? prev.filter(i => i !== item)
                          : [...prev, item]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      pantryItems.includes(item)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <button
                onClick={generateList}
                className="mt-3 text-sm bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Update List
              </button>
            </div>
          )}
        </div>
      )}

      {/* Shopping List */}
      {shoppingList && (
        <div className="space-y-6">
          {shoppingList.categories.map((category) => (
            <div key={category.name} className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold text-gray-900 mb-3">{category.name}</h3>
              <div className="space-y-2">
                {category.items.map((item) => {
                  const key = `${category.name}-${item.name}`;
                  const isChecked = checkedItems[key] || false;
                  
                  return (
                    <label
                      key={item.name}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50 ${
                        isChecked ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleItem(category.name, item.name)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className={`ml-3 ${isChecked ? 'line-through' : ''}`}>
                          <span className="font-medium text-gray-700">{item.quantity}</span>
                          <span className="text-gray-600 ml-1">{item.name}</span>
                        </span>
                      </div>
                      
                      {/* Cost estimate (Premium) */}
                      {item.estimatedCost && (userTier === 'premium' || userTier === 'premiumPlus') && (
                        <span className="text-sm text-gray-500">
                          ${item.estimatedCost.toFixed(2)}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Total Cost & Savings (Premium) */}
          {(userTier === 'premium' || userTier === 'premiumPlus') && shoppingList.totalEstimatedCost && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Estimated Total</h3>
                  <p className="text-sm text-gray-600">Based on average prices</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ${shoppingList.totalEstimatedCost.toFixed(2)}
                  </p>
                  <p className="text-sm text-green-600 flex items-center justify-end">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    Save ~$15 with these tips
                  </p>
                </div>
              </div>
              
              {shoppingList.savingsTips && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Money-Saving Tips:</h4>
                  {shoppingList.savingsTips.map((tip, index) => (
                    <div key={index} className="flex items-start text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      {tip}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShoppingList;