import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import MealCard from './MealCard';

const MealCalendar = ({ mealPlan, userTier, onMealSwap, onMealFavorite, preferences }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'day'

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Start on Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getMealsForDay = (day) => {
    if (!mealPlan?.days) return { breakfast: null, lunch: null, dinner: null };
    
    const dayName = format(day, 'EEEE');
    const dayPlan = mealPlan.days.find(d => d.day === dayName);
    
    if (!dayPlan) return { breakfast: null, lunch: null, dinner: null };
    
    const meals = {};
    dayPlan.meals.forEach(meal => {
      meals[meal.type] = { ...meal, day: dayName };
    });
    
    return meals;
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(addDays(currentWeek, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addDays(currentWeek, 7));
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    if (viewMode === 'week') {
      setViewMode('day');
    }
  };

  const mealTypes = ['breakfast', 'lunch', 'dinner'];
  const mealTypeColors = {
    breakfast: 'bg-yellow-50 border-yellow-200',
    lunch: 'bg-green-50 border-green-200',
    dinner: 'bg-blue-50 border-blue-200'
  };

  const mealTypeIcons = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙'
  };

  if (viewMode === 'day') {
    const dayMeals = getMealsForDay(selectedDay);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setViewMode('week')}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to week view
          </button>
          <h2 className="text-xl font-semibold">{format(selectedDay, 'EEEE, MMMM d')}</h2>
          <div className="w-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mealTypes.map(type => {
            const meal = dayMeals[type];
            
            if (!meal) {
              return (
                <div key={type} className={`p-6 rounded-lg border-2 ${mealTypeColors[type]} text-center`}>
                  <span className="text-2xl mb-2">{mealTypeIcons[type]}</span>
                  <p className="text-gray-500">No {type} planned</p>
                  <button className="mt-2 text-sm text-purple-600 hover:text-purple-700">
                    Add {type}
                  </button>
                </div>
              );
            }
            
            return (
              <MealCard
                key={`${type}-${selectedDay}`}
                meal={meal}
                userTier={userTier}
                onSwap={(newMeal) => onMealSwap(format(selectedDay, 'EEEE'), type, newMeal)}
                onFavorite={onMealFavorite}
                preferences={preferences}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // Week view
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Meal Calendar
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePreviousWeek}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium">
            {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
          </span>
          <button
            onClick={handleNextWeek}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-8 border-b">
          <div className="p-3 font-medium text-gray-700 text-sm">Meal</div>
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`p-3 text-center border-l cursor-pointer hover:bg-gray-50 ${
                isSameDay(day, new Date()) ? 'bg-purple-50' : ''
              }`}
              onClick={() => handleDayClick(day)}
            >
              <div className="font-medium text-gray-900">{format(day, 'EEE')}</div>
              <div className="text-sm text-gray-500">{format(day, 'd')}</div>
            </div>
          ))}
        </div>

        {mealTypes.map(type => (
          <div key={type} className="grid grid-cols-8 border-b last:border-b-0">
            <div className={`p-3 font-medium text-sm ${mealTypeColors[type]}`}>
              <span className="mr-2">{mealTypeIcons[type]}</span>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </div>
            {weekDays.map((day, index) => {
              const dayMeals = getMealsForDay(day);
              const meal = dayMeals[type];
              
              return (
                <div
                  key={index}
                  className={`p-3 border-l min-h-[100px] hover:bg-gray-50 cursor-pointer ${
                    isSameDay(day, new Date()) ? 'bg-purple-50/50' : ''
                  }`}
                  onClick={() => handleDayClick(day)}
                >
                  {meal ? (
                    <div className="space-y-1">
                      <p className="font-medium text-sm text-gray-900 line-clamp-2">
                        {meal.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{meal.prepTime + (meal.cookTime || 0)}min</span>
                      </div>
                      {meal.servings && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Users className="w-3 h-3" />
                          <span>{meal.servings}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 text-sm">
                      <p>No meal</p>
                      {userTier !== 'free' && (
                        <button className="text-xs text-purple-600 hover:text-purple-700 mt-1">
                          Add
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-50 rounded"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">🌅</span>
          <span>Breakfast</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">☀️</span>
          <span>Lunch</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">🌙</span>
          <span>Dinner</span>
        </div>
      </div>
    </div>
  );
};

export default MealCalendar;