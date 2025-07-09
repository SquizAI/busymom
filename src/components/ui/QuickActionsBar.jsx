import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  ShoppingCart, 
  Search, 
  Sparkles, 
  History,
  Plus,
  X
} from 'lucide-react';

const QuickActionsBar = ({ onGenerateMeal, onViewShoppingList, onSearch, onViewHistory }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    {
      id: 'generate',
      label: "Generate Today's Meal",
      icon: Sparkles,
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: onGenerateMeal
    },
    {
      id: 'shopping',
      label: 'View Shopping List',
      icon: ShoppingCart,
      color: 'bg-green-600 hover:bg-green-700',
      onClick: onViewShoppingList
    },
    {
      id: 'search',
      label: 'Quick Recipe Search',
      icon: Search,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: onSearch
    },
    {
      id: 'history',
      label: 'Meal History',
      icon: History,
      color: 'bg-orange-600 hover:bg-orange-700',
      onClick: onViewHistory
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 flex flex-col gap-3 mb-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <button
                  onClick={() => {
                    action.onClick();
                    setIsExpanded(false);
                  }}
                  className={`${action.color} text-white rounded-full p-3 shadow-lg transition-all transform hover:scale-110`}
                >
                  <action.icon className="w-5 h-5" />
                </button>
                
                {/* Tooltip */}
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-gray-900 text-white text-sm py-1 px-3 rounded-lg whitespace-nowrap">
                    {action.label}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`${
          isExpanded ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'
        } text-white rounded-full p-4 shadow-xl transition-all transform hover:scale-110`}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="close"
              initial={{ rotate: -90 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: 90 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: -90 }}
            >
              <Plus className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default QuickActionsBar;