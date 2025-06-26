import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const HeroStats = ({ itemVariants }) => {
  const stats = [
    { value: '100K+', label: 'Meals Generated', color: 'from-fuchsia-500 to-pink-600' },
    { value: '15', label: 'Minutes Prep Time', color: 'from-teal-400 to-cyan-600' },
    { type: 'special', label: 'Kid Approved', color: 'from-amber-400 to-orange-500' },
    { value: '4.9', label: 'Customer Rating', color: 'from-violet-500 to-purple-600' }
  ];

  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });
  
  // Animation variants
  const numberVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 10 
      }
    }
  };
  
  const labelVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15,
        delay: 0.1
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="mt-12 md:mt-16 lg:mt-20 py-6 px-4 md:py-8 md:px-0 relative z-10"
    >
      {/* Decorative background element with more vibrant colors */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-50/30 via-purple-50/30 to-cyan-50/30 backdrop-blur-sm rounded-xl -z-10"></div>
      {/* Decorative circles */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-100/30 rounded-full filter blur-xl"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-100/30 rounded-full filter blur-xl"></div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex flex-col items-center justify-center text-center"
          >
            <motion.div 
              variants={numberVariants}
              transition={{ duration: 0.6, delay: 0.1 + (index * 0.1) }}
              className={`relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${stat.color} shadow-lg mb-3`}
            >
              <span className="absolute inset-0.5 rounded-full bg-white/90 flex items-center justify-center">
                {stat.type === 'special' ? (
                  <svg className="w-12 h-12 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-2xl md:text-3xl font-bold bg-gradient-to-br bg-clip-text text-transparent ${stat.color}">
                    {stat.value}
                  </span>
                )}
              </span>
            </motion.div>
            
            <motion.p 
              variants={labelVariants}
              transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
              className="text-sm md:text-base font-medium text-gray-700">
              {stat.label}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HeroStats;
