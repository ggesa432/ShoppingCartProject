import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();
export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    // Static Notifications (Guides for users)
    { id: 1, message: 'Add Products from Product Screen', type: 'static' },
    { id: 2, message: 'Add Items from Cart Page', type: 'static' },
    { id: 3, message: 'Review cart from Checkout Page', type: 'static' },
    { id: 4, message: 'Make Payment from Payment Page', type: 'static' },
    { id: 5, message: 'Assist with cancel/reorder', type: 'static' },
  ]);

  const addNotification = (notification) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { ...notification, id: new Date().getTime() }, 
    ]);
  };

  const markNotificationAsRead = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification,markNotificationAsRead  }}>
      {children}
    </NotificationContext.Provider>
  );
};

