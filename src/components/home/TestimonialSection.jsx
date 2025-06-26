import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TestimonialCarousel from './TestimonialCarousel';

const TestimonialSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Testimonial data
  const testimonials = [
    {
      quote: "BusyWomen saved me 5+ hours every week planning meals for my family!",
      name: "Sarah J.",
      title: "Mom of 3",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      quote: "The 15-minute meals are actually 15 minutes! Game changer for busy evenings.",
      name: "Melissa T.",
      title: "Working Mom",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      quote: "My kids actually eat these meals. I'm no longer a short-order cook!",
      name: "Jessica L.",
      title: "Mom of Picky Eaters",
      avatar: "https://randomuser.me/api/portraits/women/54.jpg"
    },
    {
      quote: "The premium AI features have transformed my meal planning experience completely.",
      name: "Rachel K.",
      title: "Premium Member",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg"
    }
  ];
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-pink-50 to-violet-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            What Our Community Says
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="max-w-2xl mx-auto text-xl text-gray-600"
          >
            Join thousands of busy women who have transformed their meal planning routine
          </motion.p>
        </motion.div>
        
        <div className="relative">
          {/* Decorative elements with more diverse colors */}
          <div className="absolute top-1/4 left-0 w-32 h-32 bg-fuchsia-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/3 right-0 w-32 h-32 bg-violet-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          
          {/* Main testimonial carousel */}
          <div className="relative z-10 bg-gradient-to-br from-white to-pink-50/50 rounded-2xl shadow-xl p-6 md:p-10 max-w-4xl mx-auto border border-pink-100/50">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/3 mb-8 md:mb-0 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-violet-500 rounded-full opacity-10 scale-110 animate-pulse"></div>
                  <TestimonialCarousel 
                    currentSlide={currentSlide} 
                    setCurrentSlide={setCurrentSlide} 
                    testimonials={testimonials} 
                  />
                </div>
              </div>
              
              <div className="w-full md:w-2/3 md:pl-10">
                <div className="relative">
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ 
                        opacity: currentSlide === index ? 1 : 0,
                        x: currentSlide === index ? 0 : 20,
                      }}
                      transition={{ duration: 0.5 }}
                      className={`${currentSlide === index ? 'block' : 'hidden'}`}
                    >
                      <svg className="h-12 w-12 text-fuchsia-300 mb-6" fill="currentColor" viewBox="0 0 32 32">
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      <p className="text-xl md:text-2xl font-medium text-gray-900 mb-6">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={testimonial.avatar} 
                            alt={testimonial.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-base font-medium text-gray-900">{testimonial.name}</div>
                          <div className="text-sm text-fuchsia-600">{testimonial.title}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Navigation dots */}
                <div className="flex justify-center mt-8">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-3 w-3 mx-1 rounded-full focus:outline-none ${
                        currentSlide === index ? 'bg-fuchsia-600' : 'bg-fuchsia-200'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to action */}
        <motion.div 
          variants={itemVariants}
          className="mt-16 text-center"
        >
          <a 
            href="/signup" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500"
          >
            Join Our Community
            <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialSection;
