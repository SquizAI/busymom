import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, Target, Activity, Zap, Heart } from 'lucide-react';

const NutritionalDashboard = ({ mealPlan, familyProfiles = [], userTier }) => {
  const [nutritionData, setNutritionData] = useState(null);
  const [selectedView, setSelectedView] = useState('weekly');
  const [selectedMember, setSelectedMember] = useState('all');

  useEffect(() => {
    calculateNutrition();
  }, [mealPlan, selectedMember]);

  const calculateNutrition = () => {
    if (!mealPlan || !mealPlan.days) return;

    const dailyData = mealPlan.days.map(day => {
      const dayMeals = day.meals || [];
      const dayNutrition = dayMeals.reduce((acc, meal) => {
        if (meal.nutrition) {
          return {
            calories: acc.calories + (meal.nutrition.calories || 0),
            protein: acc.protein + (meal.nutrition.protein || 0),
            carbs: acc.carbs + (meal.nutrition.carbs || 0),
            fat: acc.fat + (meal.nutrition.fat || 0),
            fiber: acc.fiber + (meal.nutrition.fiber || 0),
            sugar: acc.sugar + (meal.nutrition.sugar || 0),
          };
        }
        return acc;
      }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 });

      return {
        day: day.day,
        ...dayNutrition
      };
    });

    const weeklyTotal = dailyData.reduce((acc, day) => ({
      calories: acc.calories + day.calories,
      protein: acc.protein + day.protein,
      carbs: acc.carbs + day.carbs,
      fat: acc.fat + day.fat,
      fiber: acc.fiber + day.fiber,
      sugar: acc.sugar + day.sugar,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 });

    const weeklyAverage = {
      calories: Math.round(weeklyTotal.calories / 7),
      protein: Math.round(weeklyTotal.protein / 7),
      carbs: Math.round(weeklyTotal.carbs / 7),
      fat: Math.round(weeklyTotal.fat / 7),
      fiber: Math.round(weeklyTotal.fiber / 7),
      sugar: Math.round(weeklyTotal.sugar / 7),
    };

    setNutritionData({
      daily: dailyData,
      weekly: weeklyTotal,
      average: weeklyAverage
    });
  };

  if (!nutritionData) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Calculating nutrition data...</p>
      </div>
    );
  }

  // Pie chart data for macros
  const macroData = [
    { name: 'Protein', value: nutritionData.average.protein * 4, color: '#ef4444' },
    { name: 'Carbs', value: nutritionData.average.carbs * 4, color: '#f59e0b' },
    { name: 'Fat', value: nutritionData.average.fat * 9, color: '#10b981' },
  ];

  // Daily targets (can be customized per user)
  const dailyTargets = {
    calories: 2000,
    protein: 50,
    carbs: 300,
    fat: 65,
    fiber: 25,
    sugar: 50
  };

  const StatCard = ({ title, value, target, unit, icon: Icon, trend }) => {
    const percentage = target ? Math.round((value / target) * 100) : 0;
    const isOverTarget = percentage > 100;

    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-purple-600" />
            <h4 className="font-medium text-gray-700">{title}</h4>
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        
        <div className="mb-2">
          <p className="text-2xl font-bold text-gray-900">
            {value}
            <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
          </p>
          {target && (
            <p className="text-sm text-gray-500">
              of {target} {unit} daily target
            </p>
          )}
        </div>

        {target && (
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                  isOverTarget ? 'text-red-600 bg-red-200' : 'text-green-600 bg-green-200'
                }`}>
                  {percentage}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${Math.min(percentage, 100)}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                  isOverTarget ? 'bg-red-500' : 'bg-green-500'
                }`}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Nutritional Dashboard</h2>
        
        <div className="flex gap-2">
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="weekly">Weekly View</option>
            <option value="daily">Daily View</option>
            <option value="monthly">Monthly View</option>
          </select>

          {familyProfiles.length > 0 && (
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Family Members</option>
              {familyProfiles.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Daily Calories"
          value={nutritionData.average.calories}
          target={dailyTargets.calories}
          unit="cal"
          icon={Zap}
          trend={5}
        />
        <StatCard
          title="Protein"
          value={nutritionData.average.protein}
          target={dailyTargets.protein}
          unit="g"
          icon={Activity}
          trend={-2}
        />
        <StatCard
          title="Fiber"
          value={nutritionData.average.fiber}
          target={dailyTargets.fiber}
          unit="g"
          icon={Heart}
          trend={8}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calorie Trend Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Calorie Intake Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={nutritionData.daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="calories" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6' }}
              />
              <Line 
                type="monotone" 
                dataKey={() => dailyTargets.calories} 
                stroke="#ef4444" 
                strokeDasharray="5 5"
                name="Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Macro Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Macronutrient Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={macroData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {macroData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="mt-4 space-y-2">
            {macroData.map((macro) => (
              <div key={macro.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: macro.color }}
                  />
                  <span>{macro.name}</span>
                </div>
                <span className="font-medium">
                  {macro.name === 'Protein' ? nutritionData.average.protein :
                   macro.name === 'Carbs' ? nutritionData.average.carbs :
                   nutritionData.average.fat}g
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Nutrient Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Daily Nutrient Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={nutritionData.daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="protein" fill="#ef4444" />
              <Bar dataKey="carbs" fill="#f59e0b" />
              <Bar dataKey="fat" fill="#10b981" />
              <Bar dataKey="fiber" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Health Insights (Premium Feature) */}
      {(userTier === 'premium' || userTier === 'premiumPlus') && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-900">AI Health Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">Strengths</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Excellent protein intake for muscle maintenance
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Good variety of vegetables throughout the week
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Balanced meal timing for stable energy
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">Recommendations</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">→</span>
                  Consider adding more fiber-rich foods
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">→</span>
                  Try to reduce sugar intake by 15%
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">→</span>
                  Include more omega-3 rich foods
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionalDashboard;