import { useState } from 'react'
import { motion } from 'framer-motion'

const faqs = [
  {
    question: "How much time will I save with your meal plans?",
    answer: "Our members save an average of 5-7 hours per week on meal planning, shopping, and preparation. All our recipes are designed to be prepared in 15 minutes or less."
  },
  {
    question: "How does the AI personalization work?",
    answer: "Using advanced AI algorithms powered by Google's Gemini 2.5, our system learns your preferences, dietary requirements, and taste preferences over time. The more you use the service, the better your recommendations become."
  },
  {
    question: "Can I customize my meal plans for dietary restrictions?",
    answer: "Absolutely! We accommodate a wide range of dietary needs including vegetarian, vegan, gluten-free, dairy-free, keto, paleo, and more. You can also specify ingredients you want to avoid."
  },
  {
    question: "How much does a subscription cost?",
    answer: "We offer several pricing tiers starting at $9.97/month for our Basic plan, $19.97/month for Premium, or $197.97/year for our best value Annual plan. All plans include a 14-day free trial so you can experience the benefits before committing."
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Yes, you can cancel your subscription at any time with no cancellation fees. We also offer a 30-day money-back guarantee if you're not completely satisfied with our service."
  },
  {
    question: "How many new recipes will I get each week?",
    answer: "Depending on your plan, you'll receive between 5-21 new recipes each week. Our Premium and Annual plans include exclusive recipes not available on the Basic plan."
  },
  {
    question: "Do you provide nutritional information for each meal?",
    answer: "Yes, all of our meal plans include detailed nutritional information including calories, macronutrients (protein, carbs, fat), and micronutrients. You can also set calorie goals, and our AI will adjust recommendations accordingly."
  },
  {
    question: "Will I need special cooking equipment?",
    answer: "No, our recipes are designed to be prepared with basic kitchen equipment. We focus on simplicity and efficiency, so you won't need any specialized tools or appliances."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <section id="faq" className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything you need to know about our meal planning service
          </motion.p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index} 
              className="border border-gray-200 rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full px-6 py-4 text-left font-medium text-gray-900 focus:outline-none"
              >
                <span>{faq.question}</span>
                <svg 
                  className={`w-5 h-5 text-indigo-600 transform ${openIndex === index ? 'rotate-180' : ''} transition-transform duration-200`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={`px-6 pb-4 ${openIndex === index ? 'block' : 'hidden'}`}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-gray-600">
            Still have questions? <a href="#contact" className="text-indigo-600 font-medium hover:text-indigo-500">Contact our support team</a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default FAQ
