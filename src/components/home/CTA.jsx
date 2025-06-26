import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserContext } from '../../context/UserContext' // You'll need to create this context

const CTA = () => {
  const { user } = useContext(UserContext) || { user: null }

  return (
    <section id="cta" className="py-16 md:py-24 bg-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-indigo-500"></div>
          <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-indigo-400"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Transform Your Meal Planning?
          </motion.h2>
          
          <motion.p 
            className="text-xl text-indigo-100 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join thousands of busy women who are saving time, eating healthier, and enjoying delicious meals without the stress of planning.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link 
              to={user ? "/dashboard" : "/register"}
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {user ? "Go to Dashboard" : "Start Free 14-Day Trial"}
            </Link>
            
            <Link 
              to="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-600 transition-all duration-200"
            >
              View Pricing Plans
            </Link>
          </motion.div>
          
          <motion.div
            className="text-indigo-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              No credit card required for trial
            </p>
            <p className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Cancel anytime, 30-day money-back guarantee
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default CTA
