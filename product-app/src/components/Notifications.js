import React, { useState } from 'react';
import { useNotification } from '../components/NotificationContext';
import '../css/Notification.css';

const NotificationComponent = () => {
  const { notifications, markNotificationAsRead } = useNotification();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
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
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;
