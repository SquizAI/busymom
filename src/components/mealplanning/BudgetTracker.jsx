import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, ShoppingCart, AlertCircle, PiggyBank } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const BudgetTracker = ({ mealPlan, preferences, userTier }) => {
  const [budgetData, setBudgetData] = useState({
    weeklyBudget: preferences.budget || 150,
    estimatedCost: 0,
    actualCost: 0,
    savings: 0,
    costByCategory: [],
    weeklyTrend: []
  });

  const [receipts, setReceipts] = useState([]);
  const [showAddReceipt, setShowAddReceipt] = useState(false);

  useEffect(() => {
    calculateBudget();
  }, [mealPlan]);

  const calculateBudget = () => {
    if (!mealPlan) return;

    // Estimate costs based on meal types and servings
    let totalEstimate = 0;
    const categoryBreakdown = {
      proteins: 0,
      vegetables: 0,
      grains: 0,
      dairy: 0,
      other: 0
    };

    mealPlan.days.forEach(day => {
      day.meals?.forEach(meal => {
        // Simple cost estimation (in production, this would use real pricing data)
        const baseCost = meal.type === 'breakfast' ? 3 : meal.type === 'lunch' ? 5 : 7;
        const servingMultiplier = (preferences.familySize || 2) / 2;
        const mealCost = baseCost * servingMultiplier;
        
        totalEstimate += mealCost;
        
        // Rough category allocation
        categoryBreakdown.proteins += mealCost * 0.4;
        categoryBreakdown.vegetables += mealCost * 0.25;
        categoryBreakdown.grains += mealCost * 0.2;
        categoryBreakdown.dairy += mealCost * 0.1;
        categoryBreakdown.other += mealCost * 0.05;
      });
    });

    const costByCategory = Object.entries(categoryBreakdown).map(([category, cost]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      cost: Math.round(cost * 100) / 100,
      percentage: Math.round((cost / totalEstimate) * 100)
    }));

    // Generate weekly trend (mock data for demo)
    const weeklyTrend = Array.from({ length: 4 }, (_, i) => ({
      week: `Week ${i + 1}`,
      budget: budgetData.weeklyBudget,
      actual: budgetData.weeklyBudget * (0.85 + Math.random() * 0.3)
    }));

    setBudgetData({
      ...budgetData,
      estimatedCost: Math.round(totalEstimate * 100) / 100,
      costByCategory,
      weeklyTrend
    });
  };

  const handleAddReceipt = (receipt) => {
    const newReceipt = {
      ...receipt,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    setReceipts([...receipts, newReceipt]);
    
    // Update actual cost
    const newActualCost = budgetData.actualCost + parseFloat(receipt.amount);
    setBudgetData({
      ...budgetData,
      actualCost: newActualCost,
      savings: budgetData.estimatedCost - newActualCost
    });
    
    toast.success('Receipt added successfully!');
    setShowAddReceipt(false);
  };

  const BudgetSummaryCard = ({ title, amount, icon: Icon, trend, color }) => (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${color}`} />
          <h4 className="font-medium text-gray-700">{title}</h4>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">${amount.toFixed(2)}</p>
    </div>
  );

  const ReceiptForm = () => {
    const [formData, setFormData] = useState({
      store: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: 'groceries'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.store || !formData.amount) {
        toast.error('Please fill in all fields');
        return;
      }
      handleAddReceipt(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 className="text-lg font-semibold mb-4">Add Receipt</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={formData.store}
                onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Whole Foods"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddReceipt(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Add Receipt
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BudgetSummaryCard
          title="Weekly Budget"
          amount={budgetData.weeklyBudget}
          icon={DollarSign}
          color="text-purple-600"
        />
        <BudgetSummaryCard
          title="Estimated Cost"
          amount={budgetData.estimatedCost}
          icon={ShoppingCart}
          color="text-blue-600"
        />
        <BudgetSummaryCard
          title="Actual Spent"
          amount={budgetData.actualCost}
          icon={DollarSign}
          color="text-orange-600"
          trend={budgetData.actualCost > 0 ? 
            Math.round(((budgetData.estimatedCost - budgetData.actualCost) / budgetData.estimatedCost) * 100) : 0
          }
        />
        <BudgetSummaryCard
          title="Savings"
          amount={budgetData.savings}
          icon={PiggyBank}
          color="text-green-600"
        />
      </div>

      {/* Budget vs Actual Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Budget Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={budgetData.weeklyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Line 
              type="monotone" 
              dataKey="budget" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Budget"
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Actual"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Cost by Category */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Cost Breakdown by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={budgetData.costByCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Bar dataKey="cost" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Receipt Management */}
      {(userTier === 'premium' || userTier === 'premiumPlus') && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Receipt Tracking</h3>
            <button
              onClick={() => setShowAddReceipt(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Add Receipt
            </button>
          </div>
          
          {receipts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No receipts added yet</p>
              <p className="text-sm">Track your actual spending by adding receipts</p>
            </div>
          ) : (
            <div className="space-y-2">
              {receipts.map((receipt) => (
                <div key={receipt.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{receipt.store}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(receipt.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="font-semibold">${parseFloat(receipt.amount).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Budget Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-900">💡 Budget Saving Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-2">This Week's Savings</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                Buy seasonal vegetables to save 15-20%
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                Batch cooking saves $20-30 per week
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                Use store brands for pantry staples
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-2">Smart Shopping</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                Check weekly ads before shopping
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                Buy in bulk for non-perishables
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                Plan meals around sales
              </li>
            </ul>
          </div>
        </div>
      </div>

      {showAddReceipt && <ReceiptForm />}
    </div>
  );
};

export default BudgetTracker;