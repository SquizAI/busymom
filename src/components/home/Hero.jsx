import { useState, useEffect, useContext, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { UserContext } from '../../context/UserContext'
import HeroHeadline from './HeroHeadline'
import AIMealVisual from './AIMealVisual'
import HeroStats from './HeroStats'

const Hero = () => {
  const { user } = useContext(UserContext) || { user: null }
  const [mounted, setMounted] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const heroRef = useRef(null)
  const isInView = useInView(heroRef, { once: false, amount: 0.2 })
  const { scrollY } = useScroll()
  
  // Parallax effect values - reduced for mobile to prevent overlapping
  const y1 = useTransform(scrollY, [0, 500], [0, -50])
  const y2 = useTransform(scrollY, [0, 500], [0, -25])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.7])
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
        when: "beforeChildren"
      },
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      },
    }
  }
  
  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.98,
      boxShadow: "0 5px 15px -5px rgba(79, 70, 229, 0.4)"
    }
  }
  
  // Mount animations
  useEffect(() => {
    setMounted(true)
  }, [])
  


  return (
    <section 
      ref={heroRef}
      className="relative overflow-hidden py-12 md:py-20 lg:py-24"
    >
      {/* Direct background image for mobile - full height and width */}
      <div 
        className="absolute inset-0 -z-10 w-full h-full"
        style={{
          backgroundImage: "url(/img/hero-bg-mobile.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          minHeight: "100%"
        }}  
      >
        {/* Vibrant gradient overlay for mobile */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/85 via-fuchsia-900/80 to-indigo-900/85"></div>
      </div>

      {/* Desktop background (hidden on mobile) - full height and width */}
      <div 
        className="absolute inset-0 hidden md:block -z-10 w-full h-full"
        style={{
          backgroundImage: "url(/img/hero-bg-desktop.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          minHeight: "100%"
        }}  
      >
        {/* Vibrant gradient overlay for desktop */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 via-fuchsia-900/75 to-indigo-900/80"></div>
      </div>

      {/* Animated gradient elements with more diverse colors */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-64 md:h-96 opacity-40 pointer-events-none z-0"
        style={{ y: y1, opacity }}
      >
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-pink-300 to-fuchsia-300 blur-2xl"></div>
        <div className="absolute top-40 right-10 w-40 h-40 rounded-full bg-gradient-to-r from-violet-300 to-purple-300 blur-3xl"></div>
        <div className="absolute bottom-10 left-1/4 w-36 h-36 rounded-full bg-gradient-to-r from-cyan-300 to-teal-300 blur-2xl"></div>
      </motion.div>
      
      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
            variants={containerVariants}
            className="col-span-1 lg:col-span-6 space-y-8"
          >
            {/* Hero Headline Component */}
            <HeroHeadline 
              user={user} 
              buttonVariants={buttonVariants} 
              itemVariants={itemVariants} 
            />
          </motion.div>
          
          {/* Right Column - AI Meal Planner Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="col-span-1 lg:col-span-6 relative mt-6 md:mt-0"
          >
            {/* AI Meal Visual Component */}
            <div className="relative mb-4">
              <AIMealVisual y2={y2} />
            </div>
            
            {/* Call-to-action button for mobile */}
            <div className="mt-6 md:hidden text-center">
              <motion.a
                href="/signup"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500"
              >
                Start Your Free Trial
                <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>
        
        {/* Stats Section Component */}
        <motion.div 
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <HeroStats itemVariants={itemVariants} />
        </motion.div>
      </div>
      
      {/* Extra padding to prevent content from being hidden behind mobile sticky footer */}
      <div className="h-16 md:hidden"></div>
    </section>
  )
}

export default Hero
