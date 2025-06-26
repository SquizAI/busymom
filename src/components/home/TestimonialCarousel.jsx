import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TestimonialCarousel = ({ currentSlide, setCurrentSlide, testimonials }) => {
  return (
    <div className="relative mt-8 max-w-md mx-auto md:ml-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-4 rounded-lg shadow-lg"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <img 
                src={testimonials[currentSlide].avatar} 
                alt={testimonials[currentSlide].name} 
                className="h-10 w-10 rounded-full object-cover border-2 border-indigo-200"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/40?text=User';
                }}
              />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">"{testimonials[currentSlide].quote}"</p>
              <p className="text-xs font-semibold text-gray-800">{testimonials[currentSlide].name}</p>
              <p className="text-xs text-gray-500">{testimonials[currentSlide].title}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Carousel Indicators */}
      <div className="flex justify-center mt-2 space-x-1">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all ${currentSlide === index ? 'w-4 bg-indigo-600' : 'w-1.5 bg-gray-300'}`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
