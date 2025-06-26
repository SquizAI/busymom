import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    quote: "This meal subscription has been a game-changer for my family. I'm saving at least 5 hours a week on meal planning and prep. The recipes are simple, healthy, and my kids actually eat them!",
    name: "Sarah Johnson",
    title: "Marketing Director & Mom of 2",
    image: "/images/testimonials/sarah.jpg",
    rating: 5
  },
  {
    quote: "As a busy professional, I never had time to plan healthy meals. Now I'm eating nutritious food every day without the stress. The AI recommendations get better each week!",
    name: "Emily Chen",
    title: "Software Engineer & Fitness Enthusiast",
    image: "/images/testimonials/emily.jpg",
    rating: 5
  },
  {
    quote: "I was skeptical at first, but the meal plans are truly customized to my dietary needs. I have celiac disease, and finding quick gluten-free meals used to be so challenging.",
    name: "Michelle Rodriguez",
    title: "Teacher & Mom of 3",
    image: "/images/testimonials/michelle.jpg",
    rating: 4
  },
  {
    quote: "The budget-friendly plans and shopping lists have helped me cut my grocery bill by 30%. I'm eating healthier and saving money - what's not to love?",
    name: "Jessica Williams",
    title: "Accountant & Single Mom",
    image: "/images/testimonials/jessica.jpg",
    rating: 5
  },
  {
    quote: "I love how the AI learns my preferences. After a few weeks, it was suggesting meals that perfectly matched my taste. The 15-minute prep time is actually real, not exaggerated!",
    name: "Aisha Patel",
    title: "Nurse & Wellness Advocate",
    image: "/images/testimonials/aisha.jpg",
    rating: 5
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };
  
  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };
  
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What Our Members Say
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Real stories from busy women who transformed their meal planning routine
          </motion.p>
        </div>
        
        <div className="relative">
          {/* Desktop Navigation Controls */}
          {!isMobile && (
            <>
              <button 
                onClick={prevTestimonial}
                className="absolute top-1/2 -left-4 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
                aria-label="Previous testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={nextTestimonial}
                className="absolute top-1/2 -right-4 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
                aria-label="Next testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="w-full flex-shrink-0 px-4"
                >
                  <motion.div 
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="md:flex">
                      <div className="md:shrink-0 md:w-1/3">
                        <img 
                          className="h-full w-full object-cover md:h-full md:w-full"
                          src={testimonial.image}
                          alt={testimonial.name}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=6366F1&color=fff&size=250`;
                          }}
                        />
                      </div>
                      <div className="p-8 md:w-2/3">
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i}
                              className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <blockquote className="italic text-gray-600 mb-6 text-lg">"{testimonial.quote}"</blockquote>
                        <div>
                          <p className="font-bold text-gray-900">{testimonial.name}</p>
                          <p className="text-gray-500">{testimonial.title}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile Controls */}
          {isMobile && (
            <div className="flex justify-between items-center mt-6">
              <button 
                onClick={prevTestimonial}
                className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
                aria-label="Previous testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-2.5 h-2.5 rounded-full ${currentIndex === index ? 'bg-indigo-600' : 'bg-gray-300'}`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <button 
                onClick={nextTestimonial}
                className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
                aria-label="Next testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
