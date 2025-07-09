import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import EnhancedMealPlanner from '../components/mealplanning/EnhancedMealPlanner';

const Dashboard = () => {
  const { user, loading, logoutDummy, isAdmin } = useContext(UserContext) || { user: null, loading: true };

  // Redirect if not logged in
  if (!loading && !user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  
  // Admin dashboard view component
  const renderAdminDashboard = () => {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8 grid grid-cols-1 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Dashboard</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-700 mb-2">User Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-md text-center">
                      <div className="text-2xl font-bold text-blue-600">842</div>
                      <div className="text-sm text-gray-500">Total Users</div>
                    </div>
                    <div className="bg-white p-3 rounded-md text-center">
                      <div className="text-2xl font-bold text-green-600">73%</div>
                      <div className="text-sm text-gray-500">Premium Users</div>
                    </div>
                    <div className="bg-white p-3 rounded-md text-center">
                      <div className="text-2xl font-bold text-purple-600">38</div>
                      <div className="text-sm text-gray-500">New Today</div>
                    </div>
                    <div className="bg-white p-3 rounded-md text-center">
                      <div className="text-2xl font-bold text-amber-600">91%</div>
                      <div className="text-sm text-gray-500">Retention</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-700 mb-2">Content Management</h4>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="flex items-center text-purple-600 hover:text-purple-800">
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        Manage Meal Plans
                      </a>
                    </li>
                    <li>
                      <a href="#" className="flex items-center text-purple-600 hover:text-purple-800">
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                        </svg>
                        Edit Recipe Database
                      </a>
                    </li>
                    <li>
                      <a href="#" className="flex items-center text-purple-600 hover:text-purple-800">
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                        </svg>
                        Manage User Accounts
                      </a>
                    </li>
                    <li>
                      <a href="#" className="flex items-center text-purple-600 hover:text-purple-800">
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        Edit Chatbot Responses
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="flow-root">
                <ul className="-mb-8">
                  <li>
                    <div className="relative pb-8">
                      <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      <div className="relative flex items-start space-x-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center">
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              New Premium User Registration
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">
                              12 minutes ago
                            </p>
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            <p>
                              Emma S. registered for a Premium Annual Plan ($119.97)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="relative pb-8">
                      <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      <div className="relative flex items-start space-x-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              New Meal Plan Published
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">
                              1 hour ago
                            </p>
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            <p>
                              'Summer Fresh Meals Under 30 Minutes' plan published by Admin
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="relative pb-8">
                      <div className="relative flex items-start space-x-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Weekly Report Generated
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">
                              3 hours ago
                            </p>
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            <p>
                              Weekly user engagement report has been generated and emailed to administrators
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin() ? 'Admin Dashboard' : 'My Dashboard'}
          </h1>
          <div className="flex items-center">
            <div className="text-right mr-4">
              <p className="text-sm font-medium text-gray-900">{user?.email || user?.name}</p>
              <p className="text-xs text-gray-500">{isAdmin() ? 'Administrator' : 'Premium Member'}</p>
            </div>
            <button
              onClick={logoutDummy}
              className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        {isAdmin() ? (
          renderAdminDashboard()
        ) : (
          <EnhancedMealPlanner />
        )}
      </main>
    </>
  );
};

export default Dashboard;
