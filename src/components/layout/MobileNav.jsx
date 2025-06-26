import { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { motion } from 'framer-motion';
import StickyFooter from './StickyFooter';

const MobileNav = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const [chatOpen, setChatOpen] = useState(false);
  
  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      path: '/meals',
      label: 'Meals',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      )
    },
    {
      path: '/pricing',
      label: 'Pricing',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      path: user ? '/dashboard' : '/login',
      label: user ? 'Account' : 'Login',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];
  
  // Special item for chat that doesn't use routing
  const chatItem = {
    label: 'Chat',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    )
  };

  return (
    <>
      <div className="block md:hidden fixed bottom-0 inset-x-0 bg-white shadow-lg border-t border-gray-200 z-40">
        <div className="grid grid-cols-5 h-16">
          {/* Four navigation items */}
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex flex-col items-center justify-center transition-colors ${
                isActive(item.path) 
                  ? 'text-indigo-600' 
                  : 'text-gray-500 hover:text-indigo-500'
              }`}
            >
              <div className={`${isActive(item.path) ? 'text-indigo-600' : 'text-gray-500'}`}>
                {item.icon}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
              {isActive(item.path) && (
                <motion.div
                  className="absolute bottom-0 w-1/5 h-1 bg-indigo-600"
                  layoutId="activeTabIndicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          ))}
          
          {/* Chat button */}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`flex flex-col items-center justify-center transition-colors ${
              chatOpen ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'
            }`}
          >
            <div className={chatOpen ? 'text-indigo-600' : 'text-gray-500'}>
              {chatItem.icon}
            </div>
            <span className="text-xs mt-1">{chatItem.label}</span>
          </button>
        </div>
      </div>
      
      {/* Chat component */}
      {chatOpen && <StickyFooter initialOpen={true} />}
    </>
  );
};

export default MobileNav;
