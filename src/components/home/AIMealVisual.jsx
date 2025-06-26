import React from 'react';
import { motion } from 'framer-motion';

const AIMealVisual = ({ y2 }) => {
  return (
    <div className="relative">
      <motion.div
        style={{ y: y2 }}
        className="w-full"
      >
        {/* Main interface container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Header with tabs */}
          <div className="flex border-b border-gray-100">
            <div className="px-6 py-3 font-medium text-indigo-600 border-b-2 border-indigo-600 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Weekly Meal Plan</span>
            </div>
            <div className="px-6 py-3 text-gray-500 font-medium flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Grocery List</span>
            </div>
          </div>
          
          {/* AI Label */}
          <div className="px-6 pt-4 flex justify-between items-center">
            <div className="flex space-x-2">
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
                </svg>
                AI Generated
              </span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Kid Tested
              </span>
            </div>
            <span className="text-xs text-gray-500">Quick meals for busy moms</span>
          </div>
          
          {/* Meal Plan Content */}
          <div className="p-6 pt-2">
            {/* Day Selection */}
            <div className="flex space-x-2 pb-4 overflow-x-auto scrollbar-hidden">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <button 
                  key={i} 
                  className={`flex-shrink-0 rounded-full px-3 py-1 text-sm font-medium ${i === 0 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {day}
                </button>
              ))}
            </div>
            
            {/* Meal Cards */}
            <div className="space-y-4">
              {/* Breakfast */}
              <div className="rounded-lg border border-gray-100 shadow-sm p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">BREAKFAST</h4>
                    <h3 className="font-semibold text-gray-900">Greek Yogurt Parfait</h3>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    5 min
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Greek yogurt with honey, berries, and granola</p>
                <div className="flex space-x-2">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">Kid-friendly</span>
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">Veg</span>
                </div>
              </div>
              
              {/* Lunch */}
              <div className="rounded-lg border border-gray-100 shadow-sm p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">LUNCH</h4>
                    <h3 className="font-semibold text-gray-900">Mediterranean Chickpea Bowl</h3>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    15 min
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Chickpeas, cucumber, tomato, feta, and olive oil</p>
                <div className="flex space-x-2">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">Make ahead</span>
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">Veg</span>
                </div>
              </div>
              
              {/* Dinner */}
              <div className="rounded-lg border border-gray-100 shadow-sm p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">DINNER</h4>
                    <h3 className="font-semibold text-gray-900">Sheet Pan Chicken & Veggies</h3>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    20 min
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Chicken breast, bell peppers, broccoli, and olive oil</p>
                <div className="flex space-x-2">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">Kid-friendly</span>
                  <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">One pan</span>
                </div>
              </div>
            </div>
            
            {/* Grocery List Preview */}
            <div className="mt-6 border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-900">Grocery List</h3>
                <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center">
                  Full List
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs font-medium text-gray-500 mb-2">INCLUDES:</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Chicken breast', 'Bell peppers', 'Broccoli', 'Greek yogurt', 
                    'Berries', 'Chickpeas', 'Cucumber', 'Tomatoes', '+8 more'
                  ].map((item, i) => (
                    <span key={i} className="bg-white rounded-full px-2.5 py-1 text-xs border border-gray-200 text-gray-700">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button className="flex-1 px-3 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Save as Note
                </button>
                <button className="flex-1 px-3 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Added background glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-100 to-indigo-100 rounded-xl blur opacity-30 -z-10"></div>
    </div>
  );
};

export default AIMealVisual;
