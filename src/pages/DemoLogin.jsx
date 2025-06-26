import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';

const DemoLogin = () => {
  const { user, loginAsDummy, dummyUsers } = useContext(UserContext);
  const [selectedUser, setSelectedUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // If user is already logged in, redirect to dashboard
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleDemoLogin = (userType) => {
    loginAsDummy(userType);
    navigate('/dashboard');
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-xl rounded-lg overflow-hidden"
          >
            <div className="px-6 py-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                  Demo Experience
                </h2>
                <p className="text-gray-600 mb-8">
                  Choose a user type to explore BusyWomen as if you were already signed up!
                </p>
              </div>

              <div className="space-y-6">
                <div 
                  onClick={() => handleDemoLogin('regularUser')}
                  className="border border-gray-200 hover:border-indigo-500 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md"
                >
                  <div className="flex items-center">
                    <img 
                      src={dummyUsers.regularUser.profileImage} 
                      alt="Regular user" 
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{dummyUsers.regularUser.name}</h3>
                      <p className="text-indigo-600">Premium Subscriber</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Access premium meal plans and full AI chat features
                      </p>
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => handleDemoLogin('adminUser')}
                  className="border border-gray-200 hover:border-indigo-500 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md"
                >
                  <div className="flex items-center">
                    <img 
                      src={dummyUsers.adminUser.profileImage} 
                      alt="Admin user" 
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{dummyUsers.adminUser.name}</h3>
                      <p className="text-purple-600">Administrator</p>
                      <p className="text-gray-500 text-sm mt-1">
                        View admin dashboard with user management tools
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 text-center">
                <p className="text-gray-500 text-sm">
                  This is a demonstration mode. No real account will be created.
                </p>
                <a 
                  href="/register" 
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-2 inline-block"
                >
                  Want to create a real account? Sign up here
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default DemoLogin;
