import React, { useState, useEffect } from 'react';
import { Bell, Clock, Calendar, AlertCircle, Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const SmartNotifications = ({ mealPlan, preferences }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    mealPrep: true,
    shoppingReminder: true,
    mealTime: true,
    defrostReminder: true,
    notificationTime: '17:00' // 5 PM default
  });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    scheduleNotifications();
  }, [mealPlan, notificationSettings]);

  const scheduleNotifications = () => {
    if (!mealPlan) return;

    const now = new Date();
    const notifications = [];

    // Meal prep reminders
    if (notificationSettings.mealPrep) {
      const sundayPrep = new Date();
      sundayPrep.setDate(sundayPrep.getDate() + (7 - sundayPrep.getDay()));
      sundayPrep.setHours(10, 0, 0, 0);
      
      if (sundayPrep > now) {
        notifications.push({
          id: 'prep-sunday',
          title: 'Meal Prep Day!',
          message: 'Time to prep your meals for the week',
          time: sundayPrep,
          type: 'prep'
        });
      }
    }

    // Shopping reminder
    if (notificationSettings.shoppingReminder) {
      const saturdayShopping = new Date();
      saturdayShopping.setDate(saturdayShopping.getDate() + (6 - saturdayShopping.getDay()));
      saturdayShopping.setHours(9, 0, 0, 0);
      
      if (saturdayShopping > now) {
        notifications.push({
          id: 'shopping-saturday',
          title: 'Shopping List Ready',
          message: 'Don\'t forget to go grocery shopping today!',
          time: saturdayShopping,
          type: 'shopping'
        });
      }
    }

    // Meal time reminders
    if (notificationSettings.mealTime) {
      const [hours, minutes] = notificationSettings.notificationTime.split(':');
      const dinnerTime = new Date();
      dinnerTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      if (dinnerTime > now) {
        const todayMeals = mealPlan.days.find(d => 
          d.day.toLowerCase() === now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
        );
        
        if (todayMeals) {
          const dinner = todayMeals.meals.find(m => m.type === 'dinner');
          if (dinner) {
            notifications.push({
              id: 'dinner-today',
              title: 'Time to Start Dinner!',
              message: `Tonight's meal: ${dinner.name} (${dinner.prepTime} min prep)`,
              time: dinnerTime,
              type: 'meal'
            });
          }
        }
      }
    }

    // Defrost reminders
    if (notificationSettings.defrostReminder) {
      const tomorrowMeals = mealPlan.days.find(d => {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return d.day.toLowerCase() === tomorrow.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      });
      
      if (tomorrowMeals) {
        const needsDefrosting = tomorrowMeals.meals.filter(m => 
          m.ingredients?.some(ing => 
            typeof ing === 'string' ? ing.includes('frozen') : ing.name?.includes('frozen')
          )
        );
        
        if (needsDefrosting.length > 0) {
          const defrostTime = new Date();
          defrostTime.setHours(20, 0, 0, 0); // 8 PM tonight
          
          notifications.push({
            id: 'defrost-reminder',
            title: 'Defrost Reminder',
            message: `Take out ingredients for tomorrow's meals`,
            time: defrostTime,
            type: 'defrost'
          });
        }
      }
    }

    setNotifications(notifications);
    
    // Schedule browser notifications
    notifications.forEach(notification => {
      const timeUntil = notification.time - now;
      if (timeUntil > 0) {
        setTimeout(() => {
          showNotification(notification);
        }, timeUntil);
      }
    });
  };

  const showNotification = (notification) => {
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo192.png',
        tag: notification.id
      });
    }
    
    // In-app toast
    toast.custom((t) => (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="bg-white rounded-lg shadow-lg p-4 max-w-md"
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${
            notification.type === 'prep' ? 'bg-purple-100' :
            notification.type === 'shopping' ? 'bg-green-100' :
            notification.type === 'meal' ? 'bg-blue-100' :
            'bg-amber-100'
          }`}>
            {notification.type === 'prep' ? <Clock className="w-5 h-5 text-purple-600" /> :
             notification.type === 'shopping' ? <Calendar className="w-5 h-5 text-green-600" /> :
             notification.type === 'meal' ? <Bell className="w-5 h-5 text-blue-600" /> :
             <AlertCircle className="w-5 h-5 text-amber-600" />}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{notification.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    ), { duration: 5000 });
  };

  const NotificationSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Notification Settings</h3>
        <button
          onClick={() => setShowSettings(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <label className="flex items-center justify-between">
          <span className="text-gray-700">Meal Prep Reminders</span>
          <input
            type="checkbox"
            checked={notificationSettings.mealPrep}
            onChange={(e) => setNotificationSettings({
              ...notificationSettings,
              mealPrep: e.target.checked
            })}
            className="rounded text-purple-600 focus:ring-purple-500"
          />
        </label>

        <label className="flex items-center justify-between">
          <span className="text-gray-700">Shopping List Reminders</span>
          <input
            type="checkbox"
            checked={notificationSettings.shoppingReminder}
            onChange={(e) => setNotificationSettings({
              ...notificationSettings,
              shoppingReminder: e.target.checked
            })}
            className="rounded text-purple-600 focus:ring-purple-500"
          />
        </label>

        <label className="flex items-center justify-between">
          <span className="text-gray-700">Meal Time Alerts</span>
          <input
            type="checkbox"
            checked={notificationSettings.mealTime}
            onChange={(e) => setNotificationSettings({
              ...notificationSettings,
              mealTime: e.target.checked
            })}
            className="rounded text-purple-600 focus:ring-purple-500"
          />
        </label>

        <label className="flex items-center justify-between">
          <span className="text-gray-700">Defrost Reminders</span>
          <input
            type="checkbox"
            checked={notificationSettings.defrostReminder}
            onChange={(e) => setNotificationSettings({
              ...notificationSettings,
              defrostReminder: e.target.checked
            })}
            className="rounded text-purple-600 focus:ring-purple-500"
          />
        </label>

        <div>
          <label className="block text-gray-700 mb-2">
            Default Dinner Reminder Time
          </label>
          <input
            type="time"
            value={notificationSettings.notificationTime}
            onChange={(e) => setNotificationSettings({
              ...notificationSettings,
              notificationTime: e.target.value
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <button
        onClick={() => {
          scheduleNotifications();
          toast.success('Notification settings updated!');
          setShowSettings(false);
        }}
        className="w-full mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        Save Settings
      </button>
    </motion.div>
  );

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="absolute right-0 top-12 z-50 w-80">
            <NotificationSettings />
          </div>
        )}
      </AnimatePresence>

      {/* Upcoming Notifications Preview */}
      {showSettings && notifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 top-12 mt-96 z-40 w-80 bg-white rounded-lg shadow-lg p-4"
        >
          <h4 className="font-medium text-gray-700 mb-3">Upcoming Reminders</h4>
          <div className="space-y-2">
            {notifications.slice(0, 3).map(notification => (
              <div key={notification.id} className="flex items-center gap-3 text-sm">
                <Bell className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-gray-500">
                    {notification.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SmartNotifications;