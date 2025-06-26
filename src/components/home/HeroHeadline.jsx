import React from 'react';
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const HeroHeadline = ({ user, buttonVariants, itemVariants }) => {
  return (
    <>
      <motion.span variants={itemVariants} className="inline-block bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full mb-4 shadow-sm border border-indigo-200">
        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
        Made for busy moms like you
      </motion.span>
      
      <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg">
        <span className="block">Healthy Meals</span>
        <span className="block text-yellow-300">In 15 Minutes</span>
        <span className="block">For Busy Moms</span>
      </motion.h1>
      
      <motion.p variants={itemVariants} className="text-base sm:text-lg md:text-xl text-white font-medium max-w-2xl mt-4 drop-shadow-md">
        No more "what's for dinner" stress. Get personalized weekly meal plans with quick recipes, done-for-you grocery lists, and kid-approved meals that actually get eaten.
      </motion.p>
      
      {/* Social proof addition */}
      <motion.div variants={itemVariants} className="mt-6 mb-6 bg-white/20 backdrop-blur-sm p-3 rounded-lg border border-white/30 inline-block">
        <div className="flex items-center">
          <div className="flex -space-x-2 mr-3">
            <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/32.jpg" alt="User" />
            <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" />
            <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/68.jpg" alt="User" />
            <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-indigo-600 text-white text-xs font-medium">42+</span>
          </div>
          <div className="text-white text-sm">
            <span className="font-bold">1,243 moms</span> joined this week
          </div>
        </div>
      </motion.div>
      
      {!user ? (
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mt-2">
          <Link to="/register">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="text-indigo-900 bg-yellow-300 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 font-bold rounded-lg text-lg px-6 py-3.5 sm:w-auto w-full text-center shadow-lg transition-all"
            >
              Try Free for 14 Days →
            </motion.button>
          </Link>
          
          <Link to="/meals">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="text-white bg-indigo-700/70 hover:bg-indigo-700/90 backdrop-blur-sm border border-indigo-300/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium rounded-lg text-lg px-6 py-3.5 sm:w-auto w-full text-center shadow-md transition-all"
            >
              See Sample Meals
            </motion.button>
          </Link>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="mt-6">
          <Link to="/dashboard">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="text-indigo-900 bg-yellow-300 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 font-bold rounded-lg text-lg px-6 py-3.5 text-center shadow-lg transition-all"
            >
              Go to Your Meal Plan
            </motion.button>
          </Link>
        </motion.div>
      )}
      
      {!user && (
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-sm text-white bg-indigo-700/40 backdrop-blur-sm p-2 rounded-lg inline-block"
        >
          <span className="flex items-center">
            <svg className="h-4 w-4 text-yellow-300 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            No credit card required
          </span>
          <span className="flex items-center">
            <svg className="h-4 w-4 text-yellow-300 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Cancel anytime
          </span>
          <span className="flex items-center">
            <svg className="h-4 w-4 text-yellow-300 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            3-minute signup
          </span>
        </motion.div>
      )}
      
      {/* Limited-time offer banner */}
      {!user && (
        <motion.div 
          variants={itemVariants}
          className="mt-6 bg-gradient-to-r from-red-500 to-red-600 p-2 rounded-lg shadow-md max-w-md"
        >
          <div className="flex items-center space-x-2">
            <div className="bg-white rounded-full p-1">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-white text-sm font-bold">Limited time: Get 25% off your first month! Offer ends June 5th</div>
          </div>
        </motion.div>
      )}
    </>
  )
}

export default HeroHeadline;
