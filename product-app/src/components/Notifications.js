import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../components/NotificationContext';
import '../css/Notification.css';

const NotificationComponent = () => {
  const { notifications, markNotificationAsRead } = useNotification();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const handleViewNotification = (notification) => {
    navigate(notification.link); // Navigate without refreshing
    markNotificationAsRead(notification.id); // Remove notification after clicking
  };


  return (
    <div className="notifications-container">
      {/*  Clicking the bell toggles the dropdown */}
      <button className="notification-icon" onClick={toggleDropdown}>
        🔔 {notifications.length > 0 && <span className="notification-count">{notifications.length}</span>}
      </button>

      {/*  Dropdown appears when clicked */}
      {isDropdownOpen && (
        <div className="notification-dropdown">
          {notifications.length === 0 ? (
            <p className="no-notifications">No new notifications</p>
          ) : (
            notifications.map((notification, index) => (
              <div 
                key={index} 
                className="notification-item"
                onClick={() => markNotificationAsRead(index)} 
              >
                 <p>{notification.message || "New Notification"}</p>
                 {notification.type === 'dynamic' && (
                 <button 
                className="view-button" 
                onClick={() => handleViewNotification(notification)}
              >
                View
              </button>
              )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;
